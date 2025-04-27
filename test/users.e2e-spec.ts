import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthPage } from './pages/auth.page';
import { UsersPage } from './pages/users.page';
import { createUserAdminDTO } from './utils/user-admin.constant';
import { fakeUser } from './utils/users-fake';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersPage: UsersPage;
  let authPage: AuthPage;
  let access_token: string;
  let userID: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    usersPage = new UsersPage(app);
    authPage = new AuthPage(app);

    ({ access_token } = await usersPage.createAndLogin(
      authPage,
      createUserAdminDTO,
    ));
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) debe crear un usuario', async () => {
    const roles = ['ADMIN', 'EMPLEADO', 'CLIENTE'];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const response = await usersPage.create(fakeUser(role));
    userID = response.body.id;

    expect(response.status).toBe(201);
  });

  it('/users (GET) debe retornar un usuario porm ID', async () => {
    const response = await usersPage.findById(userID);

    expect(response.status).toBe(200);
  });

  it('/users (UPDATE) debe actualizar un usuario porm ID', async () => {
    const response = await usersPage.update(
      userID,
      {
        name: fakeUser('cliente').name, // aqui no importa el rol ya que solo necesitamos un nombre diferente
      },
      access_token,
    );

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('password');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('phone');
    expect(response.body).toHaveProperty('role');
  });

  it('/users (DELETE) debe eliminar un usuario porm ID', async () => {
    const response = await usersPage.delete(access_token, userID);

    expect(response.status).toBe(200);
  });
});
