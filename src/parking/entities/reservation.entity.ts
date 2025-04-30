import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ParkingSlot } from './parking-slot.entity';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ParkingSlot, (slot) => slot.reservations)
  parkingSlot: ParkingSlot;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.reservations, {
    cascade: true,
  })
  @JoinColumn({ name: 'vehicleid' })
  vehicle: Vehicle;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
