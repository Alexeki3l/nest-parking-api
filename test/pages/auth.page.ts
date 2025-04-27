import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class AuthPage {
  constructor(private app: INestApplication) {}

  async login(email: string, password: string) {
    return request(this.app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });
  }
}
