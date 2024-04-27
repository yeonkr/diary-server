import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/note.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async fetchAllNote(userId: number) {
    const notes = await this.prisma.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: '게시글이 조회되었습니다.',
      data: notes,
    };
  }

  async findNoteById(userId: number, noteId: number) {
    const note = await this.prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    if (note.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    const copyNote = {
      ...note,
    };

    return {
      message: '게시글이 조회되었습니다.',
      data: copyNote,
    };
  }

  async deleteNoteById(userId: number, noteId: number) {
    await this.findNoteById(userId, noteId);

    await this.prisma.note.deleteMany({
      where: {
        id: noteId,
        userId: userId,
      },
    });

    return {
      message: '게시글이 삭제되었습니다.',
    };
  }

  async createNote(userId: number, createNoteDto: CreateNoteDto) {
    await this.prisma.note.create({
      data: {
        userId,
        content: createNoteDto.content,
      },
    });

    return {
      message: '게시글이 생성되었습니다.',
    };
  }

  async updateNote(userId: number, noteId: number, updateNote: CreateNoteDto) {
    await this.findNoteById(userId, noteId);

    await this.prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        userId,
        content: updateNote.content,
      },
    });

    return {
      message: '게시글이 수정되었습니다.',
    };
  }
}

@Injectable()
export class QuestionService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendQuestion() {
    const users = await this.prismaService.user.findMany();

    for (const user of users) {
      await this.prismaService.note.create({
        data: {
          userId: user.id,
          content: 'ex) 오늘 하루 어떠셨나요?',
        },
      });
    }

    return {
      message: '질문이 전송되었습니다.',
    };
  }
}
