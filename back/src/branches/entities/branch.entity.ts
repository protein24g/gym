import { Gym } from "src/gym/entities/gym.entity";
import { Attendance } from "src/attendance/entities/attendance.entity";
import { User } from "src/member/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  gymId: number;

  @Column({type: "varchar", length: 50, nullable: false})
  name: string;

  @Column({type: 'text', nullable: false})
  address: string;

  @Column({type: 'text', nullable: false})
  addressDetail: string;

  @Column({type: 'varchar', length: 20, nullable: true})
  phone: string;

  @Column({type: 'text', nullable: false})
  openingHours: string;

  @ManyToOne(() => Gym, gym => gym.branches, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'gymId'})
  gym: Gym;

  @OneToMany(() => User, user => user.branch, {cascade: true, onDelete: 'CASCADE'})
  users: User[];

  @OneToOne(() => User, user => user.managerBranch, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn()
  manager: User;

  @OneToMany(() => Attendance, attendance => attendance.user)
  attendances: Attendance[];
}