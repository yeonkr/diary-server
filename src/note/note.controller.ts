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

  @Get('/')
  async fetchAllNote() {
    return this.noteService.fetchAllNote();
  }

  @Get('/:id')
  async fetchNoteById(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.fetchNoteById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check to see if an authentication token is still valid.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteNoteById(
    @Param('id', ParseIntPipe) id: number,

    @GetTokenUser() user: JwtPayload,
  ) {
    return this.noteService.deleteNoteById(id, user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check to see if an authentication token is still valid.',
  })
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
