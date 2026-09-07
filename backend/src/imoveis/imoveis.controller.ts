import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImoveisService } from './imoveis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';

@Controller('imoveis')
export class ImoveisController {
  constructor(private service: ImoveisService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Get('codigo/:codigo')
  findByCodigo(@Param('codigo', ParseIntPipe) codigo: number) {
    return this.service.findByCodigo(codigo);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateImovelDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateImovelDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Post(':id/midias')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('arquivo', {
    storage: diskStorage({ destination: './uploads', filename: (_request, file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`) }),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      const permitido = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
      callback(permitido ? null : new BadRequestException('Envie uma imagem ou vídeo.'), permitido);
    },
  }))
  uploadMedia(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Arquivo não enviado.');
    return this.service.addMedia(id, file);
  }
}
