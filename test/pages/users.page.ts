import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthPage } from './auth.page';
import { DataSource } from 'typeorm';

export class UsersPage {
  constructor(private app: INestApplication) {}

  // HTTP
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

  async findById(id: string) {
    return request(this.app.getHttpServer()).get(`/users/${id}`);
  }

  /**
   *
   * @param id
   * @param updateUserDTO
   * @param token
   * @returns retorna la respuesta de la peticion PUT a /users/:id
   */
  async update(id: string, updateUserDTO: any, token: string) {
    return request(this.app.getHttpServer())
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateUserDTO);
  }

  async delete(token: string, id: string) {
    return request(this.app.getHttpServer())
      .delete(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`);
  }

  // Methods auxiliary
  /**
   *
   * @param authPage
   * @param createUserAdminDTO
   * @returns access_token
   * @description Crea y loguea un usuario para obtener su access_token.
   * Si el usuario ya existe, no lo vuelve a crear.
   */
  async createAndLogin(authPage: AuthPage, createUserAdminDTO: any) {
    let createUserResponse: request.Response;
    const dataSource = this.app.get(DataSource);
    const userRepository = dataSource.getRepository('User');

    const users = await userRepository.findBy({
      email: createUserAdminDTO.email,
    });

    if (!users.length) {
      createUserResponse = await this.create(createUserAdminDTO);
    }

    const loginAdminResponse = await authPage.login(
      createUserAdminDTO.email,
      createUserAdminDTO.password,
    );

    return {
      access_token: loginAdminResponse.body.access_token,
      createUserResponse,
    };
  }
}
