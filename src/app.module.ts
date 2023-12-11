import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { JwtMiddleware } from './user/jwt/jwt.middleware';
import { ConfigsModule } from './configs/configs.module';

@Module({
  imports: [ConfigsModule, UserModule, NoteModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
