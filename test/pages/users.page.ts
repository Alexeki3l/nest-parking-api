import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { fakeUser } from '../utils/create-users-fake';
import { AuthPage } from './auth.page';

export class UsersPage {
  constructor(private app: INestApplication) {}

  async create({
    email,
    password,
    name,
    phone,
    role,
  }: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role?: string;
  }) {
    return request(this.app.getHttpServer())
      .post('/users')
      .send({ email, password, name, phone, role });
  }

  async delete(token: string, id: string) {
    return request(this.app.getHttpServer())
      .delete(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`);
  }

  async createAndLogin(role: string) {
    const createUserTestClientDTO = fakeUser(role);

    const createUserClientResponse = await this.create(createUserTestClientDTO);

    const authPage = new AuthPage(this.app); // Ensure AuthPage is imported and initialized
    const loginClientResponse = await authPage.login(
      createUserTestClientDTO.email,
      createUserTestClientDTO.password,
    );

    return {
      access_token: loginClientResponse.body.access_token,
      createResponse: createUserClientResponse,
    };
  }
}
