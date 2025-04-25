import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle, Parking } from './entities';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Parking, Vehicle]), UsersModule],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
