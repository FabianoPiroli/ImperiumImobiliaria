import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Imovel, Prisma } from '@prisma/client';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';
import { FilterImovelDto } from './dto/filter-imovel.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

export type ImovelComMidias = Prisma.ImovelGetPayload<{ include: { midias: true } }>;

@Injectable()
export class ImoveisService {
  private readonly logger = new Logger(ImoveisService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async findAll(filter?: FilterImovelDto): Promise<ImovelComMidias[]> {
    const where: Prisma.ImovelWhereInput = {};

    if (filter) {
      if (filter.tipo) where.tipo = filter.tipo;
      if (filter.status) where.status = filter.status;
      if (filter.finalidade) where.finalidade = filter.finalidade;
      if (filter.cidade) {
        where.cidade = { contains: filter.cidade, mode: 'insensitive' };
      }
      if (filter.quartos !== undefined) {
        where.quartos = { gte: filter.quartos };
      }
      if (filter.minPreco !== undefined || filter.maxPreco !== undefined) {
        where.preco = {};
        if (filter.minPreco !== undefined) where.preco.gte = filter.minPreco;
        if (filter.maxPreco !== undefined) where.preco.lte = filter.maxPreco;
      }
      if (filter.busca) {
        where.OR = [
          { titulo: { contains: filter.busca, mode: 'insensitive' } },
          { descricao: { contains: filter.busca, mode: 'insensitive' } },
          { endereco: { contains: filter.busca, mode: 'insensitive' } },
          { bairro: { contains: filter.busca, mode: 'insensitive' } },
          { cidade: { contains: filter.busca, mode: 'insensitive' } },
        ];
      }
    }

    return this.prisma.imovel.findMany({
      where,
      include: { midias: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<ImovelComMidias> {
    const imovel = await this.prisma.imovel.findUnique({
      where: { id },
      include: { midias: true },
    });

    if (!imovel) {
      throw new NotFoundException(`Imóvel com ID ${id} não encontrado`);
    }

    return imovel;
  }

  async findByCodigo(codigo: number): Promise<ImovelComMidias> {
    const imovel = await this.prisma.imovel.findUnique({
      where: { codigo },
      include: { midias: true },
    });
    if (!imovel) {
      throw new NotFoundException(`Imóvel com código ${codigo} não encontrado`);
    }
    return imovel;
  }

  create(data: CreateImovelDto): Promise<Imovel> {
    return this.prisma.imovel.create({ data });
  }

  async update(id: number, data: UpdateImovelDto): Promise<Imovel> {
    await this.findOne(id);
    return this.prisma.imovel.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Imovel> {
    const imovel = await this.findOne(id);

    // Limpar arquivos associados no Cloudinary antes da exclusão
    if (imovel.midias && imovel.midias.length > 0) {
      for (const media of imovel.midias) {
        if (media.publicId) {
          await this.cloudinary
            .deleteMedia(media.publicId, media.resourceType)
            .catch((err) =>
              this.logger.warn(
                `Falha ao deletar mídia remota ${media.publicId}: ${err.message}`,
              ),
            );
        }
      }
    }

    return this.prisma.imovel.delete({ where: { id } });
  }

  async addMedia(imovelId: number, file: Express.Multer.File) {
    await this.findOne(imovelId);
    const uploaded = await this.cloudinary.uploadImage(file);
    return this.prisma.midia.create({
      data: {
        imovelId,
        url: uploaded.secure_url,
        nome: file.originalname,
        tipo: file.mimetype.startsWith('video/') ? 'video' : 'imagem',
        mimeType: file.mimetype,
        publicId: uploaded.public_id,
        resourceType: uploaded.resource_type,
      },
    });
  }

  async removeMedia(imovelId: number, mediaId: number) {
    const media = await this.prisma.midia.findFirst({
      where: { id: mediaId, imovelId },
    });
    if (!media) {
      throw new NotFoundException('Mídia não encontrada para este imóvel.');
    }
    if (media.publicId) {
      await this.cloudinary.deleteMedia(media.publicId, media.resourceType);
    }
    return this.prisma.midia.delete({ where: { id: mediaId } });
  }

  async resolveMapsUrl(url: string): Promise<{ lat: number; lng: number } | null> {
    try {
      if (!/^https?:\/\//i.test(url)) return null;

      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();

      // Proteção SSRF: Permitir exclusivamente domínios legítimos do Google Maps
      const allowedDomains = [
        'maps.google.com',
        'www.google.com',
        'google.com',
        'maps.app.goo.gl',
        'goo.gl',
      ];

      const isAllowed = allowedDomains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      );

      if (!isAllowed) {
        this.logger.warn(`Tentativa de resolução de URL fora dos domínios permitidos: ${hostname}`);
        return null;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      clearTimeout(timeout);

      const finalUrl = response.url || url;

      // 1. Tentar casar @lat,lng na URL final
      const matchAt = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (matchAt) {
        return { lat: parseFloat(matchAt[1]), lng: parseFloat(matchAt[2]) };
      }

      // 2. Tentar casar parâmetro de busca ?q=lat,lng ou ?query=lat,lng
      const matchQ = finalUrl.match(/[?&](?:q|query)=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (matchQ) {
        return { lat: parseFloat(matchQ[1]), lng: parseFloat(matchQ[2]) };
      }

      // 3. Tentar casar coordenadas no corpo da URL (ex: /place/.../-27.5969,-48.5495)
      const matchCoords = finalUrl.match(
        /(-?\d{1,2}\.\d{3,})[,\s]+(-?\d{1,3}\.\d{3,})/,
      );
      if (matchCoords) {
        return { lat: parseFloat(matchCoords[1]), lng: parseFloat(matchCoords[2]) };
      }

      // 4. Se for HTML retornado, verificar se contém metatag ou link com coordenadas
      const html = await response.text();
      const metaMatch = html.match(
        /meta\s+content="https:\/\/maps\.google\.com\/maps\/api\/staticmap\?[^"]*center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/,
      );
      if (metaMatch) {
        return { lat: parseFloat(metaMatch[1]), lng: parseFloat(metaMatch[2]) };
      }

      const metaMatch2 = html.match(
        /(-?\d{1,2}\.\d{4,})[,\s]+(-?\d{1,3}\.\d{4,})/,
      );
      if (metaMatch2) {
        return { lat: parseFloat(metaMatch2[1]), lng: parseFloat(metaMatch2[2]) };
      }

      return null;
    } catch (err: any) {
      this.logger.debug(`Falha na resolução de mapa: ${err?.message}`);
      return null;
    }
  }
}
