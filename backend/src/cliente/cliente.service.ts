import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

type ClienteToken = { sub: number; role: string };

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) {}

  private assertCliente(user: ClienteToken) {
    if (user.role !== 'cliente') throw new ForbiddenException('Área exclusiva do cliente.');
  }

  private assertAdmin(user: ClienteToken) {
    if (user.role !== 'admin') throw new ForbiddenException('Acesso exclusivo da equipe.');
  }

  listFavorites(user: ClienteToken) {
    this.assertCliente(user);
    return this.prisma.favorite.findMany({
      where: { userId: user.sub },
      include: { imovel: { include: { midias: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addFavorite(user: ClienteToken, imovelId: number) {
    this.assertCliente(user);
    const imovel = await this.prisma.imovel.findUnique({ where: { id: imovelId } });
    if (!imovel) throw new NotFoundException('Imóvel não encontrado.');
    return this.prisma.favorite.upsert({
      where: { userId_imovelId: { userId: user.sub, imovelId } },
      update: {},
      create: { userId: user.sub, imovelId },
    });
  }

  removeFavorite(user: ClienteToken, imovelId: number) {
    this.assertCliente(user);
    return this.prisma.favorite.deleteMany({ where: { userId: user.sub, imovelId } });
  }

  listRequests(user: ClienteToken) {
    this.assertCliente(user);
    return this.prisma.propertyRequest.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequest(user: ClienteToken, id: number) {
    this.assertCliente(user);
    const request = await this.prisma.propertyRequest.findFirst({
      where: { id, userId: user.sub },
    });
    if (!request) throw new NotFoundException('Solicitação não encontrada.');
    return request;
  }

  createRequest(user: ClienteToken, data: {
    titulo: string;
    tipo: string;
    finalidade: string;
    estado: string;
    cidade: string;
    bairro?: string;
    preco?: number;
    descricao: string;
    contatoEmail: string;
    contatoTelefone: string;
  }) {
    this.assertCliente(user);
    return this.prisma.propertyRequest.create({ data: { ...data, userId: user.sub } });
  }

  async updateRequest(user: ClienteToken, id: number, data: Partial<{
    titulo: string;
    tipo: string;
    finalidade: string;
    estado: string;
    cidade: string;
    bairro: string;
    preco: number;
    descricao: string;
    contatoEmail: string;
    contatoTelefone: string;
  }>) {
    this.assertCliente(user);
    const request = await this.prisma.propertyRequest.findFirst({
      where: { id, userId: user.sub },
    });
    if (!request) throw new NotFoundException('Solicitação não encontrada.');

    const { status, ...allowedData } = data as any;
    const cleanData = Object.fromEntries(
      Object.entries(allowedData).filter(([_, v]) => v !== undefined)
    );

    return this.prisma.propertyRequest.update({
      where: { id },
      data: cleanData,
    });
  }

  async deleteRequest(user: ClienteToken, id: number) {
    this.assertCliente(user);
    const request = await this.prisma.propertyRequest.findFirst({
      where: { id, userId: user.sub },
    });
    if (!request) throw new NotFoundException('Solicitação não encontrada.');
    await this.prisma.propertyRequest.delete({ where: { id } });
    return { success: true };
  }

  async addRequestPhoto(user: ClienteToken, requestId: number, file: Express.Multer.File) {
    const whereCondition = user.role === 'admin' ? { id: requestId } : { id: requestId, userId: user.sub };
    const request = await this.prisma.propertyRequest.findFirst({ where: whereCondition });
    if (!request) throw new NotFoundException('Solicitação não encontrada.');
    const uploaded = await this.cloudinary.uploadImage(file);
    return this.prisma.propertyRequest.update({
      where: { id: requestId },
      data: { fotoUrl: uploaded.secure_url, fotoPublicId: uploaded.public_id },
    });
  }

  listAllRequests(user: ClienteToken) {
    this.assertAdmin(user);
    return this.prisma.propertyRequest.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  }

  async getAdminRequest(user: ClienteToken, id: number) {
    this.assertAdmin(user);
    const request = await this.prisma.propertyRequest.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!request) throw new NotFoundException('Solicitação não encontrada.');
    return request;
  }

  async updateAdminRequest(user: ClienteToken, id: number, data: Partial<{
    titulo: string;
    tipo: string;
    finalidade: string;
    estado: string;
    cidade: string;
    bairro: string;
    preco: number;
    descricao: string;
    contatoEmail: string;
    contatoTelefone: string;
    status: string;
  }>) {
    this.assertAdmin(user);
    const request = await this.prisma.propertyRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Solicitação não encontrada.');

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    return this.prisma.propertyRequest.update({
      where: { id },
      data: cleanData,
      include: { user: true },
    });
  }

  async updateRequestStatus(user: ClienteToken, id: number, status: string) {
    this.assertAdmin(user);
    return this.prisma.propertyRequest.update({ where: { id }, data: { status } });
  }

  async deleteAdminRequest(user: ClienteToken, id: number) {
    this.assertAdmin(user);
    const request = await this.prisma.propertyRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Solicitação não encontrada.');
    await this.prisma.propertyRequest.delete({ where: { id } });
    return { success: true };
  }
}