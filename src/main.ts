import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('highlighted-offers');
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(3000);
}
void bootstrap();
