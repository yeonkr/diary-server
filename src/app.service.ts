import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello get!';
  }
  postHello(): string {
    return 'Hello post!';
  }
  putHello(): string {
    return 'Hello put!';
  }
  deleteHello(): string {
    return 'Hello delete!';
  }
}
