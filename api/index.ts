import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const server = express();
let initializationPromise: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const allowedOrigins = configService.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    origin: allowedOrigins.includes(',')
      ? allowedOrigins.split(',').map((o) => o.trim())
      : allowedOrigins === '*'
        ? true
        : [allowedOrigins, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  await app.init();
}

export default async function handler(req: Request, res: Response) {
  try {
    if (!initializationPromise) {
      initializationPromise = bootstrap();
    }
    await initializationPromise;
    server(req, res);
  } catch (error: any) {
    console.error('Serverless Initialization Error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Backend serverless initialization failed',
      error: error?.message || String(error),
      hint: 'If this is a database connection error, ensure DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, and DB_NAME are configured in your Vercel Project Settings > Environment Variables.',
    });
  }
}
