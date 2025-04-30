import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateParkingSlotDto {
  @ApiProperty({ description: 'Number de la plaza' })
  @IsNumber()
  slotNumber: number;

  @ApiProperty({ description: 'Fecha de inicio del estacionamiento' })
  @IsDateString()
  startDateTime: Date;

  @ApiProperty({ description: 'Fecha de inicio del estacionamiento' })
  @IsDateString()
  endDateTime: Date;

  @ApiProperty({ description: 'Número de la matricula del vehículo' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ description: 'Marca del vehículo' })
  @IsString()
  brand: string;

  @ApiProperty({ description: 'Modelo del vehículo' })
  @IsString()
  model: string;
}
