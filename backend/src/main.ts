// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule }   from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Disable stripping and forbidding of unknown properties:
  // – whitelist: false  ⇒ do not strip anything
  // – forbidNonWhitelisted: false ⇒ do not throw on extra props
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      // (transform: true) can be added if you want to auto-convert JSON → DTO types
    }),
  );

  // Allow CORS from your Next.js frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
