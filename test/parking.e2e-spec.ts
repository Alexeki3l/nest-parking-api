import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthPage } from './pages/auth.page';
import { ParkingPage } from './pages/parking.page';
import { UsersPage } from './pages/users.page';
import { fakeVehicle } from './utils/vehicle-fake';
import { fakeUser } from './utils/users-fake';
import { createUserAdminDTO } from './utils/user-admin.constant';

describe('ParkingController (e2e)', () => {
  let app: INestApplication;
  let clientJwtToken: string;
  let access_token: string;
  let createUserResponse: request.Response;

  let authPage: AuthPage;
  let usersPage: UsersPage;
  let parkingPage: ParkingPage;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    usersPage = new UsersPage(app);
    authPage = new AuthPage(app);
    parkingPage = new ParkingPage(app);

    ({ access_token, createUserResponse } = await usersPage.createAndLogin(
      authPage,
      createUserAdminDTO,
    ));
  });

  afterAll(async () => {
    const responseData = JSON.parse(createUserResponse.text);
    await usersPage.delete(access_token, responseData.id);
    await app.close();
  });

  it('/parking/reserve (POST) debe reservar un parking', async () => {
    const createUserTestClientDTO = fakeUser('cliente');

    ({ access_token, createUserResponse } = await usersPage.createAndLogin(
      authPage,
      createUserTestClientDTO,
    ));

    clientJwtToken = access_token;

    const response = await parkingPage.reserveParking(
      clientJwtToken,
      fakeVehicle(),
    );
    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('startDateTime');
    expect(response.body).toHaveProperty('vehicle');
    expect(response.body.vehicle).toHaveProperty('licensePlate');
    expect(response.body.vehicle).toHaveProperty('owner');
    expect(response.body.vehicle.owner).toHaveProperty('email');
  });

  it('/parking/reserve (POST) debe devolver un error 400 si no se envia el vehiculo', async () => {
    const response = await parkingPage.reserveParking(clientJwtToken, {});
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual([
      'licensePlate should not be empty',
      'licensePlate must be a string',
      'brand should not be empty',
      'brand must be a string',
      'model should not be empty',
      'model must be a string',
      'startDateTime must be a valid ISO 8601 date string',
    ]);
  });

  it('/parking/reserve (GET) debe devolver todos los parkings', async () => {
    const createUserTestEmpleadoDTO = fakeUser('EMPLEADO');

    ({ access_token, createUserResponse } = await usersPage.createAndLogin(
      authPage,
      createUserTestEmpleadoDTO,
    ));

    clientJwtToken = access_token;
    const response = await parkingPage.getParkings(clientJwtToken);
    expect(response.status).toBe(200);
  });
});
