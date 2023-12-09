import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data: data,
    });
  }

  async loginUser(data: LoginUserDto) {
    const user = await this.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('이메일이 존재하지 않습니다.');
    }

    const isSamePassword = bcrypt.compareSync(data.password, user.password);

    if (!isSamePassword) {
      throw new ForbiddenException('비밀번호를 확인해주세요.');
    }

    const token = await this.getToken(user.id, user.email, user.name);

    return {
      message: '로그인 성공',
      token,
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getToken(id: number, email: string, name: string) {
    const payload = { id, email, name };
    return this.jwtService.sign(payload);
  }
}
