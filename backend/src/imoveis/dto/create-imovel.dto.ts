import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateImovelDto {
  @IsString() titulo: string;
  @IsString() descricao: string;
  @IsString() tipo: string;
  @IsOptional() @IsString() estado?: string;
  @IsString() cidade: string;
  @IsOptional() @IsString() bairro?: string;
  @IsString() endereco: string;
  @IsNumber() @Min(0) preco: number;
  @IsInt() @Min(0) quartos: number;
  @IsInt() @Min(0) banheiros: number;
  @IsInt() @Min(0) vagasGaragem: number;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() finalidade?: string;
}