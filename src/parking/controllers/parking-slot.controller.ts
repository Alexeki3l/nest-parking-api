import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ParkingSlotService } from '../services/parking-slot.service';

@Controller('parking-slots')
export class ParkingSlotController {
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  @Get()
  async findAll() {
    return this.parkingSlotService.findAll();
  }

  @Get(':id/parking/:parkingId')
  async findOne(
    @Param('id') id: string,
    @Param('parkingId') parkingId: string,
  ) {
    return this.parkingSlotService.findOne(id, parkingId);
  }

  @Post()
  async create(@Body() body: { parkingId: string; slotNumber: number }) {
    return this.parkingSlotService.createParkingSlot(
      body.parkingId,
      body.slotNumber,
    );
  }

  @Delete(':id/parking/:parkingId')
  async delete(@Param('id') slotId: string, @Param('id') parkingId: string) {
    return this.parkingSlotService.delete(slotId, parkingId);
  }
}
