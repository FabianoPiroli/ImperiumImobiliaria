import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Imovel } from '@prisma/client';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';

@Injectable()
export class ImoveisService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.midia.create({
      data: { imovelId, url: `/uploads/${file.filename}`, nome: file.originalname, tipo: file.mimetype.startsWith('video/') ? 'video' : 'imagem', mimeType: file.mimetype },
    });
  }
}
