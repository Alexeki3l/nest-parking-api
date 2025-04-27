import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { AuthPage } from './pages/auth.page';
import { ParkingPage } from './pages/parking.page';
import { UsersPage } from './pages/users.page';
import { fakeVehicle } from './utils/create-vehicle-fake';
import { fakeUser } from './utils/create-users-fake';

describe('ParkingController (e2e)', () => {
  let app: INestApplication;
  let clientJwtToken: string;
  let adminJwtToken: string;
  let createUserClientResponse: request.Response;
  // let createUserAdminResponse: request.Response;

  let authPage: AuthPage;
  let usersPage: UsersPage;
  let parkingPage: ParkingPage;

  const createUserAdminDTO = {
    email: 'adminTest@asda.com',
    password: 'admin',
    name: 'admin',
    phone: '+55 123456789',
    role: 'admin',
  };

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

    const dataSource = app.get(DataSource);
    const userRepository = dataSource.getRepository('User');

    const users = await userRepository.findBy({
      email: createUserAdminDTO.email,
    });

    if (!users.length) {
      await usersPage.create(createUserAdminDTO);
    }

    const loginAdminResponse = await authPage.login(
      createUserAdminDTO.email,
      createUserAdminDTO.password,
    );

    adminJwtToken = loginAdminResponse.body.access_token;
  });

  afterAll(async () => {
    const responseData = JSON.parse(createUserClientResponse.text);
    await usersPage.delete(adminJwtToken, responseData.id);
    await app.close();
  });

  it('/parking/reserve (POST) debe reservar un parking', async () => {
    const createUserTestClientDTO = fakeUser('cliente');

    createUserClientResponse = await usersPage.create(createUserTestClientDTO);

    const loginClientResponse = await authPage.login(
      createUserTestClientDTO.email,
      createUserTestClientDTO.password,
    );

    clientJwtToken = loginClientResponse.body.access_token;

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
    const createUserTestClientDTO = fakeUser('EMPLEADO');

    createUserClientResponse = await usersPage.create(createUserTestClientDTO);

    const loginClientResponse = await authPage.login(
      createUserTestClientDTO.email,
      createUserTestClientDTO.password,
    );

    clientJwtToken = loginClientResponse.body.access_token;

    const response = await parkingPage.getParkings(clientJwtToken);
    // console.log(response)
    expect(response.status).toBe(200);
  });
});
