// src/parking/parking.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import { ParkingService } from '../services/parking.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public, Roles, RolesGuard } from 'src/shared';
import { UserRole } from 'src/users/entities/user.entity';
import { CreateParkingSlotDto, CreateParkingSlotWithoutDto } from '../dto';

@UseGuards(JwtAuthGuard)
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createParking(@Body() body: { name: string; totalSlots: number }) {
    return this.parkingService.createParking(body.name, body.totalSlots);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLEADO)
  @Get()
  async findAllParkings() {
    return this.parkingService.findAllParkings();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLEADO)
  @Get(':id')
  async findParkingById(@Param('id') id: string) {
    return this.parkingService.findParkingById(id);
  }

  @Public()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.parkingService.delete(id);
  }

  /**
   *
   * @param parkingId
   * @param body :{ slotNumber: number; startDateTime: Date; endDateTime: Date; }
   * @returns
   * @description Reserva un estacionamiento en un parking especifico dado un slotNumber
   * @example POST /parking/:id/reserve
   */
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENTE)
  @Post(':id/reserve')
  async reserveSlotById(
    @Req() req: any,
    @Param('id') parkingId: string,
    @Body()
    createParking: CreateParkingSlotDto,
  ) {
    return await this.parkingService.reserveSlotById(
      req.user.id,
      parkingId,
      createParking,
    );
  }

  /**
   *
   * @param parkingId
   * @param body :{ startDateTime: Date; endDateTime: Date; }
   * @returns
   * @description Reserva un estacionamiento en un parking especifico sin el slotNumber
   * @example POST /parking/:id/reserve
   */
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENTE)
  @Post(':id/reserve_without')
  async reserveSlot(
    @Req() req: any,
    @Param('id') parkingId: string,
    @Body()
    body: CreateParkingSlotWithoutDto,
  ) {
    return this.parkingService.reserveSlotWithoutSlotNumber(
      req.user.id,
      parkingId,
      body,
    );
  }
}
