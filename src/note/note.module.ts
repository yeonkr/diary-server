import { Module } from '@nestjs/common';
import { NoteController } from './controller/note.controller';
import { NoteService } from './service/note.service';
import { PrismaService } from 'src/prisma.service';
import { UserController } from 'src/user/controller/user.controller';
import { UserService } from 'src/user/service/user.service';

@Module({
  controllers: [NoteController, UserController],
  providers: [NoteService, PrismaService, UserService],
})
export class NoteModule {}
