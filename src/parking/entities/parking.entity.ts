import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ParkingSlot } from './parking-slot.entity';

@Entity()
export class Parking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  totalSlots: number;

  @OneToMany(() => ParkingSlot, (slot) => slot.parking, { cascade: true })
  slots: ParkingSlot[];
}
