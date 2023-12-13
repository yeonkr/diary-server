import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { Note } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateNoteDto } from './dto/note.dto';
import { JwtAuthGuard } from 'src/user/jwt/jwt.guard';
import { JwtPayload } from 'src/user/jwt/jwt.payload';
import { GetTokenUser } from 'src/common/decorator/user.decorator';

@ApiTags('Note')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  async fetchAllNote(): Promise<Note[]> {
    return this.noteService.fetchAllNote();
  }

  @Get('/:id')
  async fetchNoteById(@Param('id', ParseIntPipe) id: number) {
    return await this.noteService.fetchNoteById(id);
  }

  @Delete('/:id')
  async deleteNoteById(@Param('id') id: number): Promise<Note | null> {
    return this.noteService.deleteNoteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createNote(
    @GetTokenUser() user: JwtPayload,
    @Body() data: CreateNoteDto,
  ) {
    const userId = user.id;
    return this.noteService.createNote(data, userId);
  }
}
