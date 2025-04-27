import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class ParkingPage {
  constructor(private app: INestApplication) {}

  async reserveParking(token: string, parkingData: any) {
    return request(this.app.getHttpServer())
      .post('/parking/reserve')
      .set('Authorization', `Bearer ${token}`)
      .send(parkingData);
  }

  async getParkings(token: string) {
    return request(this.app.getHttpServer())
      .get('/parking/reserve')
      .set('Authorization', `Bearer ${token}`);
  }
}
