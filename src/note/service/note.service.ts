import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Diary } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async fetchAllDiary(): Promise<Diary[]> {
    return this.prismaService.diary.findMany();
  }

  async fetchDiaryById(id: number): Promise<Diary | null> {
    return this.prismaService.diary.findUnique({
      where: { id: Number(id) },
    });
  }

  async deleteDiaryById(id: number): Promise<Diary | null> {
    return this.prismaService.diary.delete({
      where: { id: Number(id) },
    });
  }

  async createDiary(data: Diary): Promise<Diary> {
    return this.prismaService.diary.create({
      data: data,
    });
  }
}
