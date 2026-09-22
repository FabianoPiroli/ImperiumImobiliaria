import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

export class LoginDto {
  @ApiProperty({ example: 'admin@imperium.com', description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Senha de acesso (mínimo 6 caracteres)' })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;
}

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login e obter token JWT' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido, retorna accessToken e dados do usuário.' })
  @ApiResponse({ status: 400, description: 'Dados de requisição inválidos.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.senha);
  }
}
