import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class ParkingPage {
  constructor(private app: INestApplication) {}

  async createParking(
    token: string,
    parkingData: { name: string; totalSlots: number },
  ) {
    return request(this.app.getHttpServer())
      .post('/parking')
      .set('Authorization', `Bearer ${token}`)
      .send(parkingData);
  }

  async reserveParking(token: string, parkingId: string, reservationData: any) {
    if ('slotNumber' in reservationData) {
      return request(this.app.getHttpServer())
        .post(`/parking/${parkingId}/reserve`)
        .set('Authorization', `Bearer ${token}`)
        .send(reservationData);
    } else {
      return request(this.app.getHttpServer())
        .post(`/parking/${parkingId}/reserve_without`)
        .set('Authorization', `Bearer ${token}`)
        .send(reservationData);
    }
  }

  async getParkings(token: string) {
    return request(this.app.getHttpServer())
      .get('/parking/reserve')
      .set('Authorization', `Bearer ${token}`);
  }

  async deleteParking(id: string) {
    return request(this.app.getHttpServer()).delete(`/parking/${id}`);
    // .set('Authorization', `Bearer ${token}`);
  }
}
