import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Imovel } from '@prisma/client';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ImoveisService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) {}

  findAll(): Promise<Imovel[]> {
    return this.prisma.imovel.findMany({ include: { midias: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number): Promise<Imovel> {
  const imovel = await this.prisma.imovel.findUnique({
    where: { id },
    include: { midias: true },
  });

  if (!imovel) {
    throw new NotFoundException(`Imóvel com ID ${id} não encontrado`);
  }

  return imovel;
}

  async findByCodigo(codigo: number): Promise<Imovel> {
    const imovel = await this.prisma.imovel.findUnique({ where: { codigo }, include: { midias: true } });
    if (!imovel) throw new NotFoundException(`Imóvel com código ${codigo} não encontrado`);
    return imovel;
  }

  create(data: CreateImovelDto): Promise<Imovel> {
    return this.prisma.imovel.create({ data });
  }

  update(id: number, data: UpdateImovelDto): Promise<Imovel> {
    return this.prisma.imovel.update({ where: { id }, data });
  }

  delete(id: number): Promise<Imovel> {
    return this.prisma.imovel.delete({ where: { id } });
  }

  async addMedia(imovelId: number, file: Express.Multer.File) {
    await this.findOne(imovelId);
    const uploaded = await this.cloudinary.uploadImage(file);
    return this.prisma.midia.create({
      data: { imovelId, url: uploaded.secure_url, nome: file.originalname, tipo: file.mimetype.startsWith('video/') ? 'video' : 'imagem', mimeType: file.mimetype, publicId: uploaded.public_id, resourceType: uploaded.resource_type },
    });
  }

  async removeMedia(imovelId: number, mediaId: number) {
    const media = await this.prisma.midia.findFirst({ where: { id: mediaId, imovelId } });
    if (!media) throw new NotFoundException('Mídia não encontrada para este imóvel.');
    if (media.publicId) await this.cloudinary.deleteMedia(media.publicId, media.resourceType);
    return this.prisma.midia.delete({ where: { id: mediaId } });
  }

  async resolveMapsUrl(url: string): Promise<{ lat: number; lng: number } | null> {
    try {
      if (!/^https?:\/\//i.test(url)) return null;

      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

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
      const matchCoords = finalUrl.match(/(-?\d{1,2}\.\d{3,})[,\s]+(-?\d{1,3}\.\d{3,})/);
      if (matchCoords) {
        return { lat: parseFloat(matchCoords[1]), lng: parseFloat(matchCoords[2]) };
      }

      // 4. Se for HTML retornado, verificar se contém metatag ou link com coordenadas
      const html = await response.text();
      const metaMatch = html.match(/meta\s+content="https:\/\/maps\.google\.com\/maps\/api\/staticmap\?[^"]*center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
      if (metaMatch) {
        return { lat: parseFloat(metaMatch[1]), lng: parseFloat(metaMatch[2]) };
      }

      const metaMatch2 = html.match(/(-?\d{1,2}\.\d{4,})[,\s]+(-?\d{1,3}\.\d{4,})/);
      if (metaMatch2) {
        return { lat: parseFloat(metaMatch2[1]), lng: parseFloat(metaMatch2[2]) };
      }

      return null;
    } catch {
      return null;
    }
  }
}
