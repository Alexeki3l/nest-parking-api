import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  licensePlate: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @OneToMany(() => Reservation, (reservation) => reservation.vehicle)
  reservations: Reservation[];

  @ManyToOne(() => User, (user) => user.vehicles, {
    onDelete: 'CASCADE',
  })
  owner: User;
}
