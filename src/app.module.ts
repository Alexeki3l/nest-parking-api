import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ParkingModule } from './parking/parking.module';
import { LogsModule } from './logs/logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';
import { Vehicle } from './parking/entities/vehicle.entity';
import { Parking, ParkingSlot, Reservation } from './parking/entities';
import { User } from './users/entities/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (): TypeOrmModuleOptions => ({
        entities:
          process.env.NODE_ENV === 'test'
            ? [User, Vehicle, Parking, ParkingSlot, Reservation]
            : [__dirname + '/../**/*.entity.js'],
        ...databaseConfig,
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),

    UsersModule,
    AuthModule,
    ParkingModule,
    LogsModule,
  ],
})
export class AppModule {}
