import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { IsEmail, IsIn, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiBearerAuth, ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ClienteService } from './cliente.service';

class PropertyRequestDto {
  @ApiProperty() @IsString() @MaxLength(150) titulo: string;
  @ApiProperty() @IsString() tipo: string;
  @ApiProperty({ enum: ['venda', 'locacao'] }) @IsIn(['venda', 'locacao']) finalidade: string;
  @ApiProperty() @IsString() estado: string;
  @ApiProperty() @IsString() cidade: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) preco?: number;
  @ApiProperty() @IsString() @MaxLength(5000) descricao: string;
  @ApiProperty() @IsEmail() contatoEmail: string;
  @ApiProperty() @IsString() @MaxLength(30) contatoTelefone: string;
}

class UpdatePropertyRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(150) titulo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tipo?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['venda', 'locacao']) finalidade?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() estado?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cidade?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bairro?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) preco?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(5000) descricao?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() contatoEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(30) contatoTelefone?: string;
  @ApiPropertyOptional({ enum: ['pendente', 'em_avaliacao', 'aprovada', 'recusada'] })
  @IsOptional()
  @IsIn(['pendente', 'em_avaliacao', 'aprovada', 'recusada'])
  status?: string;
}

@ApiTags('Área do cliente')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cliente')
export class ClienteController {
  constructor(private service: ClienteService) {}

  @Get('favoritos')
  favorites(@Req() request: any) {
    return this.service.listFavorites(request.user);
  }

  @Post('favoritos/:imovelId')
  addFavorite(@Req() request: any, @Param('imovelId', ParseIntPipe) imovelId: number) {
    return this.service.addFavorite(request.user, imovelId);
  }

  @Delete('favoritos/:imovelId')
  removeFavorite(@Req() request: any, @Param('imovelId', ParseIntPipe) imovelId: number) {
    return this.service.removeFavorite(request.user, imovelId);
  }

  // Admin routes
  @Get('admin/solicitacoes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  allRequests(@Req() request: any) {
    return this.service.listAllRequests(request.user);
  }

  @Get('admin/solicitacoes/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAdminRequest(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.getAdminRequest(request.user, id);
  }

  @Patch('admin/solicitacoes/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateAdminRequest(@Req() request: any, @Param('id', ParseIntPipe) id: number, @Body() data: UpdatePropertyRequestDto) {
    return this.service.updateAdminRequest(request.user, id, data);
  }

  @Delete('admin/solicitacoes/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteAdminRequest(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.deleteAdminRequest(request.user, id);
  }

  // Client routes
  @Get('solicitacoes')
  requests(@Req() request: any) {
    return this.service.listRequests(request.user);
  }

  @Get('solicitacoes/:id')
  getRequest(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.getRequest(request.user, id);
  }

  @Post('solicitacoes')
  createRequest(@Req() request: any, @Body() data: PropertyRequestDto) {
    return this.service.createRequest(request.user, data);
  }

  @Patch('solicitacoes/:id')
  updateRequest(@Req() request: any, @Param('id', ParseIntPipe) id: number, @Body() data: UpdatePropertyRequestDto) {
    return this.service.updateRequest(request.user, id, data);
  }

  @Delete('solicitacoes/:id')
  deleteRequest(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.deleteRequest(request.user, id);
  }

  @Post('solicitacoes/:id/foto')
  @UseInterceptors(FileInterceptor('foto', { storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }))
  addRequestPhoto(@Req() request: any, @Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    if (!file || !file.mimetype.startsWith('image/')) throw new BadRequestException('Envie uma imagem válida.');
    return this.service.addRequestPhoto(request.user, id, file);
  }
}