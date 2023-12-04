import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../service/user.service';

@Controller('api/vi/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() data: User): Promise<User> {
    return this.userService.createUser(data);
  }
}
