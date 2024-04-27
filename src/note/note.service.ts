import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
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
        title: createNoteDto.title,
        content: createNoteDto.content,
      },
    });

    return {
      message: '게시글이 생성되었습니다.',
    };
  }

  async updateNote(userId: number, noteId: number, updateNote: UpdateNoteDto) {
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
  constructor(
    private readonly prismaService: PrismaService,
    private readonly noteService: NoteService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendQuestion() {
    const users = await this.prismaService.user.findMany();
    const questions = [
      '오늘은 무엇을 배우셨나요?',
      '오늘의 하루는 어땠나요?',
      '가장 기억에 남는 순간은 무엇이었나요?',
      // 추후 따로 분리해서 관리 예정
    ];

    for (const user of users) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      const randomQuestion = questions[randomIndex];

      await this.noteService.createNote(user.id, {
        title: randomQuestion,
        content: '',
      });
    }

    return {
      message: '질문이 전송되었습니다.',
    };
  }
}
