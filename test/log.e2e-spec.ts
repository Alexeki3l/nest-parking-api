import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthPage } from './pages/auth.page';
import { UsersPage } from './pages/users.page';
import { LogPage } from './pages/log.page';
import { createUserAdminDTO } from './utils/user-admin.constant';

describe('LogController (e2e)', () => {
  let app: INestApplication;
  let usersPage: UsersPage;
  let authPage: AuthPage;
  let access_token: string;

  let logPage: LogPage;

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

    ({ access_token } = await usersPage.createAndLogin(
      authPage,
      createUserAdminDTO,
    ));
  });

  afterAll(async () => {
    await app.close();
  });

  it('/logs (GET) debe retornar todos los logs', async () => {
    const response = await logPage.getLogs(access_token);
    expect(response.status).toBe(200);
  });
});
