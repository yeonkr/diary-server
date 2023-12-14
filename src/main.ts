import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';
import * as path from 'path';

const PORT = 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Diary API')
    .setDescription('The Diary API Documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  const outputPath = path.join(__dirname, '../generate/openapi.json');
  writeFileSync(outputPath, JSON.stringify(document));

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: `api/json`,
    yamlDocumentUrl: `api/yaml`,
    explorer: true,
    customSiteTitle: 'api',
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      // displayOperationId: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
      filter: true,
      deepLinking: true,
    },
  });

  await app.listen(PORT);
}
bootstrap();
