import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle, Parking } from './entities';
import { UsersModule } from 'src/users/users.module';
import { LogMiddleware, LogsModule } from 'src/logs';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/shared';

import { config } from 'dotenv';
config();

@Module({
  imports: [
    JwtModule.register(jwtConfig),
    TypeOrmModule.forFeature([Parking, Vehicle]),
    UsersModule,
    LogsModule,
  ],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes(ParkingController);
  }
}
