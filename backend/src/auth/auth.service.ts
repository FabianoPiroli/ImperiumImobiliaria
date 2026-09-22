import { Injectable, UnauthorizedException, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async onModuleInit() {
    await this.ensureAdmin();
  }

  async login(email: string, senha: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      this.logger.warn(`Tentativa de login falha para o e-mail: ${email}`);
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    this.logger.log(`Login bem-sucedido para o usuário ID: ${user.id}`);
    return {
      accessToken: this.jwt.sign({ sub: user.id, email: user.email, role: user.role }),
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    };
  }

  async ensureAdmin() {
    const defaultEmail = 'admin@imperium.com';
    const email = process.env.ADMIN_EMAIL || defaultEmail;
    const senha = process.env.ADMIN_PASSWORD || 'admin123';

    if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== 'production') {
      this.logger.warn('ADMIN_PASSWORD não configurada. Usando senha padrão para desenvolvimento local.');
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await this.prisma.user.create({
        data: {
          nome: 'Administrador',
          email,
          senha: await bcrypt.hash(senha, 10),
          role: 'admin',
        },
      });
      this.logger.log(`Usuário administrador criado com sucesso (${email}).`);
    }
  }
}
