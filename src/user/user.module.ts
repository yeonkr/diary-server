import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './jwt/accessToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenStrategy } from './jwt/refreshToken.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [UserController, AccessTokenStrategy, RefreshTokenStrategy],
  providers: [UserService],
})
export class UserModule {}
