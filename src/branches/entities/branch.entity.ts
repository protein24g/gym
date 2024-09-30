import { Gym } from "src/gym/entities/gym.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", length: 50, nullable: false})
  name: string;

  @Column({type: 'text', nullable: false})
  address: string;

  @Column({type: 'text', nullable: false})
  addressDetail: string;

  @Column({type: 'varchar', length: 20, nullable: false})
  phone: string;

  @Column({type: 'text', nullable: false})
  openingHours: string;

  @ManyToOne(() => Gym, gym => gym.branches)
  @JoinColumn({name: 'gymId'})
  gym: Gym;
}