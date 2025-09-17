import {
  type ArgumentsHost,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { type Response } from 'express';

export class GeneralExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GeneralExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(
      `Status: ${status} - Message: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      status_code: status,
      message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest<Request>().url,
    });
  }
}
