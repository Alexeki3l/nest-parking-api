import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthPage } from './pages/auth.page';
import { ParkingPage } from './pages/parking.page';
import { UsersPage } from './pages/users.page';
import { fakeUser } from './utils/users-fake';
import { createUserAdminDTO } from './utils/user-admin.constant';
import { fakeParking } from './utils/parking-fake';
import { fakeReservation } from './utils/reserve-data-fake';

describe('ParkingController (e2e)', () => {
  let app: INestApplication;
  let clientJwtToken: string;
  let parkingData: any;
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
    if (createUserResponse) {
      const responseData = JSON.parse(createUserResponse.text);
      await usersPage.delete(access_token, responseData.id);
    }

    await app.close();
  });

  it('api/parking/ (POST) debe crear un parking', async () => {
    const response = await parkingPage.createParking(
      access_token,
      fakeParking(),
    );
    parkingData = response.body;

    expect(response.status).toBe(201);
  });

  it('/parking/{{id}}/reserve (POST) debe reservar un parking slot por numero de slot', async () => {
    const createUserTestClientDTO = fakeUser('CLIENTE');

    ({ access_token, createUserResponse } = await usersPage.createAndLogin(
      authPage,
      createUserTestClientDTO,
    ));

    clientJwtToken = access_token;

    const fakeReservationData = fakeReservation(parkingData.slots.length);

    const response = await parkingPage.reserveParking(
      clientJwtToken,
      parkingData.id,
      fakeReservationData,
    );
    expect(response.status).toBe(201);
  });

  it('/parking/{{id}}/reserve_without (POST) debe reservar un parking slot sin numero de slot', async () => {
    const createUserTestClientDTO = fakeUser('CLIENTE');

    ({ access_token, createUserResponse } = await usersPage.createAndLogin(
      authPage,
      createUserTestClientDTO,
    ));

    clientJwtToken = access_token;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slotNumber, ...fakeReservationData } = fakeReservation(
      parkingData.slots.length,
    );

    const response = await parkingPage.reserveParking(
      clientJwtToken,
      parkingData.id,
      fakeReservationData,
    );
    expect(response.status).toBe(201);
  });

  it('/parking/reserve (POST) debe devolver un error 400 si no se envia el vehiculo', async () => {
    const response = await parkingPage.reserveParking(
      clientJwtToken,
      parkingData.id,
      {},
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual([
      'startDateTime must be a valid ISO 8601 date string',
      'endDateTime must be a valid ISO 8601 date string',
      'licensePlate must be a string',
      'brand must be a string',
      'model must be a string',
    ]);
  });

  it('/parking/{{id}} (DELETE) debe eliminar el parking', async () => {
    const response = await parkingPage.deleteParking(parkingData.id);
    expect(response.status).toBe(200);
  });
});
