import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Imovel } from '@prisma/client';

@Injectable()
export class ImoveisService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Imovel[]> {
    return this.prisma.imovel.findMany();
  }

  async findOne(id: number): Promise<Imovel> {
  const imovel = await this.prisma.imovel.findUnique({
    where: { id },
  });

  if (!imovel) {
    throw new NotFoundException(`Imóvel com ID ${id} não encontrado`);
  }

  return imovel;
}

  create(data: any): Promise<Imovel> {
    return this.prisma.imovel.create({ data });
  }

  update(id: number, data: any): Promise<Imovel> {
    return this.prisma.imovel.update({ where: { id }, data });
  }

  delete(id: number): Promise<Imovel> {
    return this.prisma.imovel.delete({ where: { id } });
  }
}
