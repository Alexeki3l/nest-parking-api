import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity()
export class Parking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startDateTime: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  vehicle: Vehicle;
}
