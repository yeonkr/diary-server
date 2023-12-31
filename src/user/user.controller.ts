import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Post('/login')
  async loginUser(@Body() data: LoginUserDto) {
    return this.userService.loginUser(data);
  }
}
