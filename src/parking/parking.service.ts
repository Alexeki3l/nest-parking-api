import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parking } from './entities/parking.entity';
import { CreateParkingDto } from './dto/create-parking.dto';
import { Vehicle } from './entities';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,

    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async reserveParking(
    createParkingDto: CreateParkingDto,
    userId: string,
  ): Promise<Parking> {
    const { licensePlate, brand, model, startDateTime } = createParkingDto;

    if (startDateTime < new Date()) {
      throw new BadRequestException('Debe ingresar una fecha futura');
    }

    const conflictByDate = await this.parkingRepository.findOne({
      where: { startDateTime },
    });

    if (conflictByDate) {
      throw new ConflictException(
        'Ya existe un parking reservado para esta fecha',
      );
    }

    const conflictByVehicle = await this.parkingRepository.findOne({
      where: { vehicle: { licensePlate } },
      relations: ['vehicle'],
    });

    if (conflictByVehicle) {
      throw new ConflictException(
        'Este vehículo ya está reservado en el parking',
      );
    }

    let vehicle = await this.vehicleRepository.findOne({
      where: { licensePlate },
    });

    if (!vehicle) {
      vehicle = this.vehicleRepository.create({ licensePlate, brand, model });
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    vehicle.owner = user;

    const savedVehicle = await this.vehicleRepository.save(vehicle);

    const parking = new Parking();
    parking.startDateTime = startDateTime;
    parking.vehicle = savedVehicle;

    return this.parkingRepository.save(parking);
  }

  async findAllReserves(): Promise<Parking[]> {
    const parking = await this.parkingRepository.find({
      relations: ['vehicle', 'vehicle.owner'],
    });

    if (!parking) {
      throw new NotFoundException('No parking found');
    }

    return parking;
  }

  async findOneReserve(id: string): Promise<Parking> {
    const parking = await this.parkingRepository.findOne({
      where: { id },
      relations: ['vehicle', 'vehicle.owner'],
    });

    if (!parking) {
      throw new NotFoundException('No parking found');
    }

    return parking;
  }
  async freeParking(id: string, userId: string): Promise<Parking> {
    const parking = await this.parkingRepository.findOne({
      where: { id, vehicle: { owner: { id: userId } } },
      relations: ['vehicle', 'vehicle.owner'],
    });

    if (!parking) {
      throw new NotFoundException('No parking found');
    }

    this.parkingRepository.delete(parking);
    return parking;
  }
}
