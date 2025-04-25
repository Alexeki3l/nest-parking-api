// src/parking/dto/create-parking.dto.ts
import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateParkingDto {
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsDateString()
  startDateTime: Date;
}
