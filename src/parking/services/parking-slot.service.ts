import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parking, Reservation, Vehicle, ParkingSlot } from '../entities';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ParkingSlotService {
  constructor(
    @InjectRepository(ParkingSlot)
    private parkingSlotRepository: Repository<ParkingSlot>,

    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,

    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,

    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    private userService: UsersService,
  ) {}

  async findAll(): Promise<ParkingSlot[]> {
    return this.parkingSlotRepository.find({ relations: ['parking'] });
  }

  async findOne(id: string, parkingId: string): Promise<ParkingSlot> {
    return this.parkingSlotRepository.findOne({
      where: { id, parking: { id: parkingId } },
      relations: ['parking', 'reservations'],
    });
  }

  async createParkingSlot(
    parkingData: Parking | string, //El string es el id del parking
    slotNumber: number,
  ): Promise<ParkingSlot> {
    let newSlot: ParkingSlot;
    if (typeof parkingData !== 'string') {
      const existingSlot = await this.parkingSlotRepository.findOne({
        where: { parking: parkingData, slotNumber },
      });
      if (existingSlot) {
        throw new ConflictException('El slot ya existe');
      }

      newSlot = this.parkingSlotRepository.create({
        parking: parkingData,
        slotNumber,
      });
    } else {
      const parking = await this.parkingRepository.findOne({
        where: { id: parkingData },
      });
      if (!parking) {
        throw new ConflictException('El parking no existe');
      }

      const slot = this.parkingSlotRepository.findOne({
        where: { parking, slotNumber },
      });

      if (slot) {
        throw new ConflictException('El slot ya existe');
      }
      newSlot = this.parkingSlotRepository.create({
        parking,
        slotNumber,
      });
    }
    return this.parkingSlotRepository.save(newSlot);
  }

  async delete(slotId: string, parkingId: string): Promise<ParkingSlot> {
    const parking = await this.parkingRepository.findOne({
      where: { id: parkingId },
    });
    const slot = await this.parkingSlotRepository.findOne({
      where: { id: slotId, parking },
    });
    if (!slot) {
      throw new ConflictException('El slot no existe');
    }
    await this.reservationRepository.delete({ parkingSlot: slot });
    await this.parkingSlotRepository.delete(slot);

    return slot;
  }
}
