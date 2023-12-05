import { Injectable } from '@nestjs/common';

import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: User): Promise<User> {
    return this.prisma.user.create({
      data: data,
    });
  }
}
