import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiaryController } from './diary/diary.controller';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/controller/user.controller';

@Module({
  imports: [PostsModule, UserModule],
  controllers: [AppController, DiaryController, UserController],
  providers: [AppService],
})
export class AppModule {}
