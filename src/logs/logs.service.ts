import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './schemas/log.shema';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async createLog(data: CreateLogDto) {
    const log = new this.logModel(data);
    await log.save();
  }

  async findAll() {
    return this.logModel.find().exec();
  }
}
