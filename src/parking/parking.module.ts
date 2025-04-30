import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ParkingController } from './controllers/parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle, Parking, Reservation } from './entities';
import { UsersModule } from 'src/users/users.module';
import { LogMiddleware, LogsModule } from 'src/logs';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/shared';

import { config } from 'dotenv';
import { ParkingService } from './services/parking.service';
import { ParkingSlotService } from './services/parking-slot.service';
import { ParkingSlotController } from './controllers/parking-slot.controller';
import { ParkingSlot } from './entities/parking-slot.entity';
import { ReservationService } from './services/reservation.service';
config();

@Module({
  imports: [
    JwtModule.register(jwtConfig),
    TypeOrmModule.forFeature([Parking, ParkingSlot, Vehicle, Reservation]),
    UsersModule,
    LogsModule,
  ],
  controllers: [ParkingController, ParkingSlotController],
  providers: [ParkingService, ParkingSlotService, ReservationService],
})
export class ParkingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogMiddleware)
      .exclude(
        { path: 'parking', method: RequestMethod.GET },
        { path: 'parking/(.*)', method: RequestMethod.GET },
      )
      .forRoutes(ParkingController);
  }
}
