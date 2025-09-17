import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import CookieParser from 'cookie-parser';
import { GeneralExceptionFilter } from './common/filters/general.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(CookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new GeneralExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
