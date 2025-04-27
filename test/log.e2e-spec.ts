import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { AuthPage } from './pages/auth.page';
import { UsersPage } from './pages/users.page';
import { LogPage } from './pages/log.page';

describe('LogController (e2e)', () => {
  let app: INestApplication;
  let usersPage: UsersPage;
  let authPage: AuthPage;
  let adminJwtToken: string;

  let logPage: LogPage;

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

    logPage = new LogPage(app);
    usersPage = new UsersPage(app);
    authPage = new AuthPage(app);

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
    await app.close();
  });

  it('/logs (GET) debe retornar todos los logs', async () => {
    const response = await logPage.getLogs(adminJwtToken);
    expect(response.status).toBe(200);
  });
});
