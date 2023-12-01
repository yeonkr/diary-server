import { Module } from '@nestjs/common';
import { NoteController } from './controller/note.controller';
import { NoteService } from './service/note.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [NoteController],
  providers: [NoteService, PrismaService],
})
export class NoteModule {}
