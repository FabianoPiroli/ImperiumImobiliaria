import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET obrigatória em ambiente de produção.');
    }
    new Logger('AuthModule').warn('JWT_SECRET não definida. Usando chave padrão de desenvolvimento.');
    return 'imperium-dev-secret';
  }
  return secret;
};

@Module({
  imports: [
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, PrismaService],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
