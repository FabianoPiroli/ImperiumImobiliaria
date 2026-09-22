import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateImovelDto {
  @ApiProperty({ example: 'Apartamento de Luxo Frente Mar', description: 'Título do imóvel' })
  @IsString({ message: 'O título deve ser um texto.' })
  @MaxLength(150, { message: 'O título não pode ultrapassar 150 caracteres.' })
  titulo: string;

  @ApiProperty({ example: 'Excelente apartamento com 3 suítes...', description: 'Descrição detalhada' })
  @IsString({ message: 'A descrição deve ser um texto.' })
  @MaxLength(5000, { message: 'A descrição não pode ultrapassar 5000 caracteres.' })
  descricao: string;

  @ApiProperty({
    example: 'apartamento',
    enum: ['casa', 'apartamento', 'terreno', 'comercial', 'cobertura', 'outro'],
    description: 'Tipo do imóvel',
  })
  @IsString()
  @IsIn(['casa', 'apartamento', 'terreno', 'comercial', 'cobertura', 'outro'], {
    message: 'Tipo de imóvel inválido.',
  })
  tipo: string;

  @ApiPropertyOptional({ example: 'SC', description: 'UF do estado (2 letras)' })
  @IsOptional()
  @IsString()
  @MaxLength(2, { message: 'O estado deve ter no máximo 2 caracteres.' })
  estado?: string;

  @ApiProperty({ example: 'Florianópolis', description: 'Cidade onde fica o imóvel' })
  @IsString()
  @MaxLength(100, { message: 'A cidade não pode ultrapassar 100 caracteres.' })
  cidade: string;

  @ApiPropertyOptional({ example: 'Centro', description: 'Bairro onde fica o imóvel' })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'O bairro não pode ultrapassar 100 caracteres.' })
  bairro?: string;

  @ApiProperty({ example: 'Av. Beira Mar Norte, 1000', description: 'Endereço completo ou aproximado' })
  @IsString()
  @MaxLength(200, { message: 'O endereço não pode ultrapassar 200 caracteres.' })
  endereco: string;

  @ApiProperty({ example: 1250000.0, description: 'Preço de venda ou locação' })
  @IsNumber({}, { message: 'O preço deve ser um valor numérico.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  preco: number;

  @ApiProperty({ example: 3, description: 'Quantidade de quartos' })
  @IsInt({ message: 'A quantidade de quartos deve ser um número inteiro.' })
  @Min(0, { message: 'A quantidade de quartos não pode ser negativa.' })
  quartos: number;

  @ApiProperty({ example: 2, description: 'Quantidade de banheiros' })
  @IsInt({ message: 'A quantidade de banheiros deve ser um número inteiro.' })
  @Min(0, { message: 'A quantidade de banheiros não pode ser negativa.' })
  banheiros: number;

  @ApiProperty({ example: 2, description: 'Vagas de garagem disponíveis' })
  @IsInt({ message: 'A quantidade de vagas deve ser um número inteiro.' })
  @Min(0, { message: 'A quantidade de vagas não pode ser negativa.' })
  vagasGaragem: number;

  @ApiPropertyOptional({
    example: 'disponivel',
    enum: ['disponivel', 'reservado', 'vendido', 'alugado'],
    description: 'Status atual do imóvel',
  })
  @IsOptional()
  @IsString()
  @IsIn(['disponivel', 'reservado', 'vendido', 'alugado'], {
    message: 'Status deve ser: disponivel, reservado, vendido ou alugado.',
  })
  status?: string;

  @ApiPropertyOptional({
    example: 'venda',
    enum: ['venda', 'locacao', 'ambos'],
    description: 'Finalidade do anúncio',
  })
  @IsOptional()
  @IsString()
  @IsIn(['venda', 'locacao', 'ambos'], {
    message: 'Finalidade deve ser: venda, locacao ou ambos.',
  })
  finalidade?: string;

  @ApiPropertyOptional({ example: -27.5969, description: 'Latitude geográfica (-90 a 90)' })
  @IsOptional()
  @IsNumber({}, { message: 'A latitude deve ser um número decimal.' })
  @Min(-90, { message: 'Latitude mínima é -90.' })
  @Max(90, { message: 'Latitude máxima é 90.' })
  latitude?: number;

  @ApiPropertyOptional({ example: -48.5495, description: 'Longitude geográfica (-180 a 180)' })
  @IsOptional()
  @IsNumber({}, { message: 'A longitude deve ser um número decimal.' })
  @Min(-180, { message: 'Longitude mínima é -180.' })
  @Max(180, { message: 'Longitude máxima é 180.' })
  longitude?: number;

  @ApiPropertyOptional({ example: false, description: 'Ocultar número exato do endereço no frontend' })
  @IsOptional()
  @IsBoolean({ message: 'ocultarNumeroExato deve ser booleano.' })
  ocultarNumeroExato?: boolean;
}