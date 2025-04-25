import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateLogDto {
  @IsString()
  method: string;

  @IsString()
  path: string;

  @IsNumber()
  statusCode: number;

  @IsString()
  user: any;

  @IsDate()
  timestamp: Date;
}
