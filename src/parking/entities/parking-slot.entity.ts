import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Parking } from './parking.entity';
import { Vehicle } from './vehicle.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class ParkingSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  slotNumber: number;

  @ManyToOne(() => Parking, (parking) => parking.slots)
  parking: Parking;

  @OneToMany(() => Reservation, (reservation) => reservation.parkingSlot)
  reservations: Reservation[];
}
