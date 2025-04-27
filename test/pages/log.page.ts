import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class LogPage {
  constructor(private app: INestApplication) {}

  async getLogs(token: string) {
    return request(this.app.getHttpServer())
      .get('/logs')
      .set('Authorization', `Bearer ${token}`);
  }
}
