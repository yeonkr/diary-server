import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, EmailDuplicateDto, LoginUserDto } from './dto/user.dto';
import { RefreshTokenPayload } from './types/tokenPayload';
import { GetTokenUser } from 'src/common/decorator/user.decorator';
import { JwtAuthGuard } from './jwt/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Post('/check')
  findEmail(@Body() data: EmailDuplicateDto) {
    return this.userService.checkDuplicateEmail(data);
  }

  @Post('/login')
  async loginUser(@Body() data: LoginUserDto) {
    return this.userService.loginUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/renew')
  refreshTokens(@GetTokenUser() data: RefreshTokenPayload) {
    const userId = data.userId;
    const refreshToken = data.refreshToken;
    return this.userService.refreshTokens(userId, refreshToken);
  }
}
