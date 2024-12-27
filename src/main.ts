import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as basicAuth from 'express-basic-auth';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config(); // Load environment variables

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Configure CORS with environment variables
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Frame-Options',
    credentials: true,
  });

  // Enable global versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  // Basic Auth for Swagger documentation
  app.use(
    ['/api/docs', '/api/docs-json'], // Protect the Swagger documentation routes
    basicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Jobber App Api Docs')
    .setDescription(
      'API documentation for Jobber App Api (Nest/TypeScript) backend application.\n',
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
