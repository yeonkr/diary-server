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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateNoteDto } from './dto/note.dto';
import { JwtAuthGuard } from 'src/user/jwt/jwt.guard';
import { JwtPayload } from 'src/user/jwt/jwt.payload';
import { GetTokenUser } from 'src/common/decorator/user.decorator';

@ApiTags('Note')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check to see if an authentication token is still valid.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async fetchAllNote(@GetTokenUser() user: JwtPayload) {
    return await this.noteService.fetchAllNote(user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check to see if an authentication token is still valid.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findNoteById(
    @GetTokenUser() user: JwtPayload,
    @Param('id', ParseIntPipe) noteId: number,
  ) {
    const userId = user.id;
    return await this.noteService.findNoteById(userId, noteId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check to see if an authentication token is still valid.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createNote(
    @GetTokenUser() user: JwtPayload,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    const userId = user.id;
    return await this.noteService.createNote(userId, createNoteDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check to see if an authentication token is still valid.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteNoteById(
    @Param('id', ParseIntPipe) noteId: number,

    @GetTokenUser() user: JwtPayload,
  ) {
    return this.noteService.deleteNoteById(user.id, noteId);
  }
}
