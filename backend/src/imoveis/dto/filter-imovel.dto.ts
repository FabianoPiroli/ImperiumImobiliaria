import { IsOptional, IsString, IsNumber, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterImovelDto {
  @ApiPropertyOptional({ description: 'Termo de busca textual para título, descrição ou endereço' })
  @IsOptional()
  @IsString()
  busca?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de imóvel',
    enum: ['casa', 'apartamento', 'terreno', 'comercial', 'cobertura', 'outro'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['casa', 'apartamento', 'terreno', 'comercial', 'cobertura', 'outro'])
  tipo?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: ['disponivel', 'reservado', 'vendido', 'alugado'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['disponivel', 'reservado', 'vendido', 'alugado'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por finalidade',
    enum: ['venda', 'locacao', 'ambos'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['venda', 'locacao', 'ambos'])
  finalidade?: string;

  @ApiPropertyOptional({ description: 'Filtrar por cidade' })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional({ description: 'Preço mínimo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPreco?: number;

  @ApiPropertyOptional({ description: 'Preço máximo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPreco?: number;

  @ApiPropertyOptional({ description: 'Mínimo de quartos' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quartos?: number;
}

