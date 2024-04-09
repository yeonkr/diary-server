import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;
}
