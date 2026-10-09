import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Global Validation Pipe
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

  // CORS configuration
  const allowedOrigins = configService.get<string>(
    'CORS_ORIGIN',
    'http://localhost:5173',
  );
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

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Ayush Multi Speciality Hospital API')
    .setDescription(
      'REST API backend for handling hospital enquiry forms and doctor appointment bookings with PostgreSQL 18.',
    )
    .setVersion('1.0.0')
    .addTag('Enquiries', 'Enquiry submission and management endpoints')
    .addTag('Appointments', 'Doctor appointment booking and scheduling endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Ayush Hospital API Docs',
  });

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🏥 Ayush Hospital Backend is running on port: ${port}`);
  logger.log(`🔗 API Base URL:     http://localhost:${port}/api`);
  logger.log(`📚 Swagger Docs:     http://localhost:${port}/api/docs`);
  logger.log(`🗄️ Database:         PostgreSQL 18 (${configService.get<string>('DB_NAME', 'ayushhospital_db')})`);
  logger.log(`=======================================================`);
}

bootstrap();
