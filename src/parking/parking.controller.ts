import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('parking')
export class ParkingController {
  constructor(private parkingService: ParkingService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENTE)
  @Post('reserve')
  async createReserve(
    @Req() req: any,
    @Body() createParkingDto: CreateParkingDto,
  ) {
    return await this.parkingService.reserveParking(
      createParkingDto,
      req.user.userId,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLEADO)
  @Get('reserve')
  async findAllReserves() {
    return await this.parkingService.findAllReserves();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLEADO)
  @Get('reserve/:id')
  async findOneReserve(@Param('id') id: string) {
    return await this.parkingService.findOneReserve(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENTE)
  @Delete('reserve/:id')
  async removeReserve(@Req() req: any, @Param('id') id: string) {
    return await this.parkingService.freeParking(id, req.user.userId);
  }
}
