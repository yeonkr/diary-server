import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { ConfigsModule } from './configs/configs.module';

@Module({
  imports: [ConfigsModule, UserModule, NoteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
