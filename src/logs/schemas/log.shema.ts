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

  @Prop({ type: Object })
  user: { id: string | null; role: string | null };

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
