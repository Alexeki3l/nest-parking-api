// src/logs/schemas/log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Log extends Document {
  @Prop()
  method: string;

  @Prop()
  path: string;

  @Prop()
  statusCode: number;

  @Prop()
  userId?: string;

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
