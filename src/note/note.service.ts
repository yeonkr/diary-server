import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Note } from '@prisma/client';
import { CreateNoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async fetchAllNote(): Promise<Note[]> {
    return this.prisma.note.findMany();
  }

  async fetchNoteById(id: number): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: { id: Number(id) },
    });
  }

  async deleteNoteById(id: number): Promise<Note | null> {
    return this.prisma.note.delete({
      where: { id: Number(id) },
    });
  }

  async createNote(createNoteDto: CreateNoteDto, userId: number) {
    await this.prisma.note.create({
      data: {
        userId,
        title: createNoteDto.title,
        content: createNoteDto.content,
      },
    });

    return {
      message: '게시글이 생성되었습니다.',
    };
  }
}
