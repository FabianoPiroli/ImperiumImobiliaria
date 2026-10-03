import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

@Module({
  imports: [AuthModule, CloudinaryModule],
  controllers: [ClienteController],
  providers: [ClienteService, PrismaService],
})
export class ClienteModule {}