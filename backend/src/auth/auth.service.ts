import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async onModuleInit() {
    await this.ensureAdmin();
  }

  async login(email: string, senha: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(senha, user.senha))) throw new UnauthorizedException('E-mail ou senha inválidos.');
    return { accessToken: this.jwt.sign({ sub: user.id, email: user.email, role: user.role }), user: { id: user.id, nome: user.nome, email: user.email, role: user.role } };
  }

  async ensureAdmin() {
    const email = process.env.ADMIN_EMAIL ?? 'admin@imperium.com';
    const senha = process.env.ADMIN_PASSWORD ?? 'admin123';
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (!existing) await this.prisma.user.create({ data: { nome: 'Administrador', email, senha: await bcrypt.hash(senha, 10), role: 'admin' } });
  }
}
