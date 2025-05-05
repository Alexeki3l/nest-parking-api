import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

export const appInit = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app: INestApplication = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init();

  return app;
};
