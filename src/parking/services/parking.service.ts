import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parking } from '../entities';
import { ParkingSlot } from '../entities/parking-slot.entity';
import { ParkingSlotService } from './parking-slot.service';
import { CreateParkingSlotDto, CreateParkingSlotWithoutDto } from '../dto';
import { ReservationService } from './reservation.service';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,

    private reservationService: ReservationService,

    private parkingSlotService: ParkingSlotService,
  ) {}

  async createParking(name: string, totalSlots: number): Promise<Parking> {
    const parking = this.parkingRepository.create({ name, totalSlots });
    const parkingSaved = await this.parkingRepository.save(parking);

    const slots: ParkingSlot[] = [];

    for (let i = 1; i <= totalSlots; i++) {
      const slot = await this.parkingSlotService.createParkingSlot(
        parkingSaved,
        i,
      );
      slots.push(slot);
    }

    parkingSaved.slots = slots;

    return parkingSaved;
  }

  async findAllParkings(): Promise<Parking[]> {
    return this.parkingRepository.find({
      relations: ['slots'],
    });
  }

  async findParkingById(id: string): Promise<Parking> {
    return this.parkingRepository.findOne({
      where: { id },
      relations: ['slots'],
    });
  }

  async delete(parkingId: string): Promise<Parking> {
    const parking = await this.parkingRepository.findOne({
      where: { id: parkingId },
      relations: ['slots'],
    });
    if (!parking) {
      throw new NotFoundException('Parking no encontrado');
    }
    for (const slot of parking.slots) {
      await this.parkingSlotService.delete(slot.id, parkingId);
    }
    await this.parkingRepository.delete(parkingId);
    return parking;
  }

  async reserveSlotById(
    userId: string,
    parkingId: string,
    createParkingSlotDto: CreateParkingSlotDto,
  ): Promise<any> {
    const parking = await this.parkingRepository.findOne({
      where: { id: parkingId },
      relations: ['slots'],
    });

    if (!parking) {
      throw new NotFoundException('Parking no encontrado');
    }

    const { slotNumber, ...another } = createParkingSlotDto;
    const slot = parking.slots.find((slot) => slot.slotNumber === slotNumber);

    if (!slot) {
      throw new NotFoundException('Slot no existe');
    }

    return await this.reservationService.reserveSlotById(
      userId,
      another,
      slot.id,
    );
  }

  async reserveSlotWithoutSlotNumber(
    userId: string,
    parkingId: string,
    createParkingSlotDto: CreateParkingSlotWithoutDto,
  ): Promise<any> {
    const parking = await this.parkingRepository.findOne({
      where: { id: parkingId },
      relations: ['slots'],
    });

    if (!parking) {
      throw new NotFoundException('Parking no encontrado');
    }

    return await this.reservationService.reserveSlotWithoutParkingId(
      userId,
      createParkingSlotDto,
    );
  }
}
