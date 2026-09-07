import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImoveisModule } from './imoveis/imoveis.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ImoveisModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
