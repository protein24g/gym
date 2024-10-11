import { Gym } from "src/gym/entities/gym.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gymId: number;

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

  @ManyToOne(() => Gym, gym => gym.branches, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'gymId'})
  gym: Gym;

  @OneToMany(() => User, user => user.branch, {cascade: true, onDelete: 'CASCADE'})
  users: User[];
}