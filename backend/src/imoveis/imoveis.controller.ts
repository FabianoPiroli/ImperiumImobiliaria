import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ImoveisService } from './imoveis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateImovelDto } from './dto/create-imovel.dto';
import { UpdateImovelDto } from './dto/update-imovel.dto';
import { FilterImovelDto } from './dto/filter-imovel.dto';

@ApiTags('Imóveis')
@Controller('imoveis')
export class ImoveisController {
  constructor(private service: ImoveisService) {}

  @Get('resolver-maps')
  @ApiOperation({ summary: 'Extrair latitude e longitude a partir de um link do Google Maps' })
  @ApiResponse({ status: 200, description: 'Coordenadas extraídas com sucesso.' })
  @ApiResponse({ status: 400, description: 'Link inválido ou não suportado.' })
  async resolveMapsUrl(@Query('url') url: string) {
    if (!url) throw new BadRequestException('A URL é obrigatória.');
    const coords = await this.service.resolveMapsUrl(url);
    if (!coords) {
      throw new BadRequestException(
        'Não foi possível extrair as coordenadas do link informado. Certifique-se de usar um link válido do Google Maps.',
      );
    }
    return coords;
  }

  @Get()
  @ApiOperation({ summary: 'Listar imóveis com filtros opcionais de busca' })
  @ApiResponse({ status: 200, description: 'Lista de imóveis cadastrados.' })
  findAll(@Query() filter: FilterImovelDto) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um imóvel pelo ID' })
  @ApiResponse({ status: 200, description: 'Dados do imóvel encontrado.' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Buscar imóvel pelo código público' })
  @ApiResponse({ status: 200, description: 'Dados do imóvel encontrado.' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado.' })
  findByCodigo(@Param('codigo', ParseIntPipe) codigo: number) {
    return this.service.findByCodigo(codigo);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastrar um novo imóvel (Requer autenticação)' })
  @ApiResponse({ status: 201, description: 'Imóvel cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de validação inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() data: CreateImovelDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar imóvel completo pelo ID (Requer autenticação)' })
  @ApiResponse({ status: 200, description: 'Imóvel atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de validação inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateImovelDto) {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualização parcial de um imóvel (Requer autenticação)' })
  @ApiResponse({ status: 200, description: 'Imóvel atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de validação inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado.' })
  patch(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateImovelDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um imóvel pelo ID (Requer autenticação)' })
  @ApiResponse({ status: 200, description: 'Imóvel removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Delete(':id/midias/:mediaId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover foto ou mídia de um imóvel (Requer autenticação)' })
  @ApiResponse({ status: 200, description: 'Mídia removida com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Mídia não encontrada.' })
  deleteMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('mediaId', ParseIntPipe) mediaId: number,
  ) {
    return this.service.removeMedia(id, mediaId);
  }

  @Post(':id/midias')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fazer upload de mídia para o imóvel (Requer autenticação)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        arquivo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Mídia enviada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou ausente.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        const permitido =
          file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
        callback(
          permitido ? null : new BadRequestException('Envie uma imagem ou vídeo.'),
          permitido,
        );
      },
    }),
  )
  uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo não enviado.');
    return this.service.addMedia(id, file);
  }
}
