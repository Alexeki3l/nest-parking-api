import {
  Body,
  Controller,
  Delete,
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Parking')
@Controller('parking')
export class ParkingController {
  constructor(private parkingService: ParkingService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENTE)
  @Post('reserve')
  @ApiOperation({ summary: 'Reserva un parking para un vehículo' })
  @ApiResponse({
    status: 201,
    description: 'Parking reservado con éxito',
    schema: {
      example: {
        startDateTime: '2025-11-24T14:11:49',
        vehicle: {
          id: '0ffb88a9-c729-4d15-9593-369747a54953',
          licensePlate: 'U534233',
          brand: 'toyota',
          model: 'supra',
          owner: {
            id: '1f0aa9c8-fe48-43d6-8115-dad16aa5687d',
            email: 'cliente@asda.com',
            password:
              '$2b$10$8IplF9l42F6tO6/0GrkK/e2OkkYZVKXA4CMC86VQV/RmKb4yF0zYa',
            name: 'cliente',
            phone: '+543634566435',
            role: 'cliente',
          },
        },
        id: 'ecdc9703-f1bf-4f8d-baf9-cf54c183ec07',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Este vehículo ya está reservado en el parking',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un parking reservado para esta fecha',
  })
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
