import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateParkingDto {
  @ApiProperty({ description: 'La placa del vehículo' })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ description: 'La marca del vehículo' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ description: 'El modelo del vehículo' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ description: 'Fecha y hora de inicio de la reserva' })
  @IsDateString()
  startDateTime: Date;
}
