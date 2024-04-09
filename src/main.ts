import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';
import * as path from 'path';
import * as expressBasicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

const PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  setupBasicAuth(app);

  const document = generateSwaggerDocument(app);
  const outputPath = path.join(__dirname, '../generate/openapi.json');
  writeFileSync(outputPath, JSON.stringify(document));

  setupSwaggerUI(app, document);

  await app.listen(PORT);
}

function setupBasicAuth(app) {
  app.use(
    ['/api'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PWD },
    }),
  );
}

function generateSwaggerDocument(app) {
  const config = new DocumentBuilder()
    .setTitle('NAYA API')
    .setDescription('NAYA API Documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  return SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
}

function setupSwaggerUI(app, document) {
  const configService = app.get(ConfigService);
  const openapiUrl = configService.get('SERVER_OPENAPI_URL', 'api');

  SwaggerModule.setup(openapiUrl, app, document, {
    jsonDocumentUrl: `${openapiUrl}.json`,
    yamlDocumentUrl: `${openapiUrl}.yaml`,
    explorer: true,
    customSiteTitle: 'api',
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
      filter: true,
      deepLinking: true,
    },
  });
}

bootstrap();
