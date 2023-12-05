import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Note } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async fetchAllNote(): Promise<Note[]> {
    return this.prismaService.note.findMany();
  }

  async fetchNoteById(id: number): Promise<Note | null> {
    return this.prismaService.note.findUnique({
      where: { id: Number(id) },
    });
  }

  async deleteNoteById(id: number): Promise<Note | null> {
    return this.prismaService.note.delete({
      where: { id: Number(id) },
    });
  }

  async createNote(data: Note): Promise<Note> {
    return this.prismaService.note.create({
      data: data,
    });
  }
}
