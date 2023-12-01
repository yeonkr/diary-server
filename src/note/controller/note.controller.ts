import { Controller, Delete, Get, Param } from '@nestjs/common';
import { NoteService } from '../service/note.service';
import { Diary } from '@prisma/client';

@Controller('api/vi/diary')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async fetchAllDiary(): Promise<Diary[]> {
    return this.noteService.fetchAllDiary();
  }

  @Get(':id')
  async fetchDiaryById(@Param('id') id: number): Promise<Diary | null> {
    return this.noteService.fetchDiaryById(id);
  }

  @Delete(':id')
  async deleteDiaryById(@Param('id') id: number): Promise<Diary | null> {
    return this.noteService.deleteDiaryById(id);
  }
}
