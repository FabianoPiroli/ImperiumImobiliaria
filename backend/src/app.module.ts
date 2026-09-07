import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImoveisModule } from './imoveis/imoveis.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ImoveisModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
