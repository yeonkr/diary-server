import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NoteService } from './note.service';
import { Note } from '@prisma/client';

@Controller('api/vi/note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async fetchAllNote(): Promise<Note[]> {
    return this.noteService.fetchAllNote();
  }

  @Get(':id')
  async fetchNoteById(@Param('id') id: number): Promise<Note | null> {
    return this.noteService.fetchNoteById(id);
  }

  @Delete(':id')
  async deleteNoteById(@Param('id') id: number): Promise<Note | null> {
    return this.noteService.deleteNoteById(id);
  }

  @Post()
  async createNote(@Body() data: Note): Promise<Note> {
    return this.noteService.createNote(data);
  }
}
