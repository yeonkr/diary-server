import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NoteModule } from './note/note.module';

async function bootstrap() {
  const app = await NestFactory.create(NoteModule);

  const config = new DocumentBuilder()
    .setTitle('Diary API')
    .setDescription('The Diary API Documentation')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
