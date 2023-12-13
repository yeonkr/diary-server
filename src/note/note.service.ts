import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Note } from '@prisma/client';
import { CreateNoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async fetchAllNote(): Promise<Note[]> {
    return this.prisma.note.findMany();
  }

  async fetchNoteById(id: number) {
    const note = await this.findNoteById(id);
    return {
      message: '게시글이 조회되었습니다.',
      data: note,
    };
  }

  async findNoteById(id: number) {
    const note = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    return note;
  }

  async deleteNoteById(id: number, userId: number) {
    const note = await this.findNoteById(id);

    if (note.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    await this.prisma.note.deleteMany({
      where: { id, userId },
    });

    return {
      message: '게시글이 삭제되었습니다.',
    };
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
