import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, EmailDuplicateDto, LoginUserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(data: CreateUserDto) {
    const user = await this.findByEmail(data.email);

    if (user) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    this.ValidateEmail(data.email);

    try {
      const hashedPassword = await this.hashPassword(data.password);

      await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return {
        message: '사용자가 생성되었습니다.',
      };
    } catch (error) {
      throw new Error('사용자 생성에 실패했습니다.');
    }
  }

  async loginUser(data: LoginUserDto) {
    const user = await this.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('이메일이 존재하지 않습니다.');
    }

    const isSamePassword = bcrypt.compareSync(data.password, user.password);

    if (!isSamePassword) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    const token = await this.getToken(user.id, user.email, user.name);

    return {
      message: '로그인에 성공했습니다.',
      token,
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getToken(id: number, email: string, name: string) {
    const payload = { id, email, name };

    const accessTokenOptions = {
      expiresIn: 60 * 60,
      secret: 'accessToken',
    };

    const refreshTokenOptions = {
      expiresIn: 60 * 60 * 24 * 7,
      secret: 'refreshToken',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessTokenOptions),
      this.jwtService.signAsync(payload, refreshTokenOptions),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async hashPassword(password: string) {
    return bcrypt.hashSync(password, saltRounds);
  }

  ValidateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new BadRequestException('올바른 이메일 형식이 아닙니다.');
    }
  }

  async checkDuplicateEmail(data: EmailDuplicateDto) {
    const user = await this.findByEmail(data.email);

    if (user) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    this.ValidateEmail(data.email);

    return {
      message: '사용 가능한 이메일 입니다.',
      isDuplicate: false,
    };
  }
}
