import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import express from 'express';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

const server = express();
let isInitialized = false;

async function bootstrap() {
  if (!isInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    // Headers de segurança com Helmet
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      }),
    );

    // Filtro global de exceções para proteção contra vazamento de dados internos
    app.useGlobalFilters(new AllExceptionsFilter());

    // Configuração de CORS seguro
    // Configuração de CORS seguro e compatível com Vercel
    const frontendUrl = process.env.FRONTEND_URL;
    const allowedOrigins = frontendUrl
      ? frontendUrl.split(',').map((u) => u.trim().replace(/\/+$/, ''))
      : ['http://localhost:3000', 'http://localhost:3001'];
      : [];

    app.enableCors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          process.env.NODE_ENV !== 'production'
        ) {
          callback(null, true);
        } else {
          callback(new Error('Origem não permitida pela política de CORS.'));
        // Permitir requisições sem header Origin (como SSR, server-to-server, curl, Postman)
        if (!origin) return callback(null, true);

        try {
          const parsedOrigin = new URL(origin);
          const isLocalhost =
            parsedOrigin.hostname === 'localhost' ||
            parsedOrigin.hostname === '127.0.0.1';
          const isVercel =
            parsedOrigin.hostname === 'vercel.app' ||
            parsedOrigin.hostname.endsWith('.vercel.app');
          const isExplicitlyAllowed = allowedOrigins.includes(origin);

          // Se estiver em desenvolvimento, se for Vercel, localhost ou se estiver na whitelist
          if (
            process.env.NODE_ENV !== 'production' ||
            !frontendUrl ||
            isLocalhost ||
            isVercel ||
            isExplicitlyAllowed
          ) {
            return callback(null, true);
          }

          return callback(null, false);
        } catch {
          return callback(null, false);
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Validação estrita de entradas via DTO
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Documentação Swagger / OpenAPI
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Imperium Imobiliária - API')
      .setDescription('Documentação dos endpoints e serviços da Imperium Imobiliária')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, swaggerDocument);

    await app.init();
    isInitialized = true;
  }
  return server;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}

if (!process.env.VERCEL) {
  bootstrap().then(() => {
    const port = process.env.PORT ?? 3000;
    server.listen(port, () => {
      console.log(`Aplicação iniciada com sucesso em: http://localhost:${port}`);
      console.log(`Documentação Swagger disponível em: http://localhost:${port}/api/docs`);
    });
  });
}
