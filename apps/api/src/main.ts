import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/** Boş / yok → tüm origin’ler (Nest’te `true`). `*` veya listede `*` → tüm origin’ler. Aksi halde virgülle ayrılmış whitelist. */
function resolveCorsOrigin(corsOriginsEnv: string | undefined): boolean | string[] {
  const raw = (corsOriginsEnv ?? '').trim();
  const segments = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length === 0) return true;
  if (segments.includes('*')) return true;
  return segments;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  app.enableCors({
    origin: resolveCorsOrigin(config.get<string>('CORS_ORIGINS')),
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('KimKimi API')
    .setDescription('Kim kimi ne kadar tanıyor — REST + WebSocket')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = Number(config.get('PORT') ?? 4000);
  await app.listen(port);
}
bootstrap();
