import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService, QuestionService } from './note.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [NoteController],
  providers: [NoteService, QuestionService],
})
export class NoteModule {}
