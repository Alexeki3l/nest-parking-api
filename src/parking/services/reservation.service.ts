import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingSlot, Reservation, Vehicle } from '../entities';
import { UsersService } from 'src/users/users.service';
import { CreateParkingSlotWithoutDto } from '../dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ParkingSlot)
    private parkingSlotRepository: Repository<ParkingSlot>,

    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,

    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    private userService: UsersService,
  ) {}

  /**
   *
   * @param userId Id del usuario
   * @param parkingSlotId Id del parking slot
   * @param data Datos de la reservacion
   * @param data.licensePlate Placa del vehiculo
   * @param data.model Modelo del vehiculo
   * @param data.brand Marca del vehiculo
   * @param data.startDateTime Fecha de inicio del estacionamiento
   * @param data.endDateTime Fecha de fin del estacionamiento
   * @returns Retorna una reservacion
   */
  async reserveSlotById(
    userId: string,
    data: {
      licensePlate: string;
      model: string;
      brand: string;
      startDateTime: Date;
      endDateTime: Date;
    },
    parkingSlotId: string,
  ): Promise<Reservation> {
    const { startDateTime, endDateTime, licensePlate, brand, model } = data;

    const now = new Date();
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (startDate > endDate) {
      throw new BadRequestException(
        'La fecha de inicio no puede ser mayor a la fecha de fin',
      );
    }
    if (startDate.getTime() === endDate.getTime()) {
      throw new BadRequestException(
        'Las fechas de inicio y fin no pueden ser iguales',
      );
    }
    if (startDate < now || endDate < now) {
      throw new BadRequestException(
        'Las fechas no pueden ser anteriores a la fecha actual',
      );
    }

    const overlapping = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.parkingSlot = :slotId', { slotId: parkingSlotId })
      .andWhere(
        '(reservation.startDate, reservation.endDate) OVERLAPS (:startDate, :endDate)',
        { startDate, endDate },
      )
      .getOne();

    if (overlapping) {
      throw new BadRequestException(
        'El parking slot ya está reservado para ese rango de fechas',
      );
    }

    let vehicle = await this.vehicleRepository.findOne({
      where: { licensePlate },
    });

    const user = await this.userService.findOne(userId);

    if (!vehicle) {
      vehicle = this.vehicleRepository.create({
        licensePlate,
        brand,
        model,
        owner: user,
      });
      await this.vehicleRepository.save(vehicle);
    }

    const slot = await this.parkingSlotRepository.findOne({
      where: { id: parkingSlotId },
    });

    if (!slot) {
      throw new NotFoundException('ParkingSlot no encontrado');
    }

    const reservation = this.reservationRepository.create({
      parkingSlot: slot,
      vehicle,
      startDate,
      endDate,
    });

    return await this.reservationRepository.save(reservation);
  }

  async reserveSlotWithoutParkingId(
    userId: string,
    createParkingSlotDto: CreateParkingSlotWithoutDto,
  ) {
    const { startDateTime, endDateTime, licensePlate, brand, model } =
      createParkingSlotDto;

    const now = new Date();
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (startDate > endDate) {
      throw new BadRequestException(
        'La fecha de inicio no puede ser mayor a la fecha de fin',
      );
    }
    if (startDate.getTime() === endDate.getTime()) {
      throw new BadRequestException(
        'Las fechas de inicio y fin no pueden ser iguales',
      );
    }
    if (startDate < now || endDate < now) {
      throw new BadRequestException(
        'Las fechas no pueden ser anteriores a la fecha actual',
      );
    }
    const vehicleAvailable = await this.parkingSlotRepository
      .createQueryBuilder('slot')
      .leftJoin('slot.reservations', 'res')
      .leftJoin('res.vehicle', 'vehicle')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('reservation', 'r')
          .innerJoin('r.vehicle', 'v')
          .where('v.licensePlate = :licensePlate', { licensePlate })
          .andWhere(
            `(r.startDate, r.endDate) OVERLAPS (:startDate, :endDate)`,
            {
              startDate,
              endDate,
            },
          )
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      })
      .getOne();

    if (!vehicleAvailable) {
      throw new BadRequestException(
        'El vehiculo ya tiene una reserva para ese rango de fechas',
      );
    }

    const availableSlot = await this.parkingSlotRepository
      .createQueryBuilder('parkingSlot')
      .leftJoinAndSelect('parkingSlot.reservations', 'reservation')
      .where(
        'NOT EXISTS (' +
          'SELECT 1 FROM reservation ' +
          'WHERE reservation.parkingSlotId = parkingSlot.id ' +
          'AND (reservation.startDate, reservation.endDate) OVERLAPS (:startDate, :endDate)' +
          ')',
        { startDate, endDate },
      )
      .getOne();

    if (!availableSlot) {
      throw new BadRequestException(
        'No hay parking slots disponibles para ese rango de fechas',
      );
    }

    let vehicle = await this.vehicleRepository.findOne({
      where: { licensePlate },
    });

    const user = await this.userService.findOne(userId);

    if (!vehicle) {
      vehicle = this.vehicleRepository.create({
        licensePlate,
        brand,
        model,
        owner: user,
      });
      await this.vehicleRepository.save(vehicle);
    }

    const reservation = this.reservationRepository.create({
      parkingSlot: availableSlot,
      vehicle,
      startDate,
      endDate,
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAllReservations(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ['vehicle', 'parkingSlot'],
    });
  }
}
