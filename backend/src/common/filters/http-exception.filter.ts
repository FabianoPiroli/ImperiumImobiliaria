import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: any;

    if (isHttpException) {
      const res = exception.getResponse();
      responseBody =
        typeof res === 'object'
          ? res
          : { statusCode: status, message: res };
    } else {
      // Registrar erro crítico de forma segura no servidor, sem vazar para o cliente
      this.logger.error(
        `[${request.method}] ${request.url} - Erro interno não tratado:`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );

      responseBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocorreu um erro interno no servidor.',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    response.status(status).json(responseBody);
  }
}

