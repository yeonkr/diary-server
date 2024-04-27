import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsString()
  @ApiProperty()
  content: string;
}

export class UpdateNoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;
}
