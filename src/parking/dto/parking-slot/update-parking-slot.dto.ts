import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingSlotDto } from './create-parking-slot.dto';
import { IsOptional } from 'class-validator';

export class UpdateParkingSlotDto extends PartialType(CreateParkingSlotDto) {
  @IsOptional()
  slotNUmber?: number;
}
