import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateParkingDto {
  @ApiProperty({ description: 'EL nombre del parking' })
  @IsString()
  @IsNotEmpty()
  @IsString({ message: 'El nombre del parking debe ser una cadena de texto' })
  name: string;

  @ApiProperty({ description: 'Cantidad de Slot del parking' })
  @IsNumber()
  @IsNotEmpty()
  totalSlots: number;
}
