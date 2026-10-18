import { StandardSchemaValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Усі маршрути під /api: Angular проксуватиме /api/* на цей сервер
  app.setGlobalPrefix('api');
  // Перевіряє @Body({ schema }) Zod-схемами; помилка → 400 з описом полів
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  // Коректне завершення (закриття з'єднань) по Ctrl+C / SIGTERM, знадобиться з БД
  app.enableShutdownHooks();

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
