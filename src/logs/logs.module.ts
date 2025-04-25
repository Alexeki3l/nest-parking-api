import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LogsService } from './logs.service';
import { Log, LogSchema } from './schemas/log.shema';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { LogsController } from './logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    JwtModule,
    UsersModule,
  ],
  providers: [LogsService],
  exports: [LogsService],
  controllers: [LogsController],
})
export class LogsModule {}
