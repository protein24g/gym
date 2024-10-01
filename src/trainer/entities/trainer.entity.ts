import { Manager } from "src/manager/entities/manager.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Trainer {
  @PrimaryColumn()
  userId: string;

  @OneToOne(() => User, user => user.trainer)
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToOne(() => Manager, manager => manager.trainers)
  manager: Manager;

  @OneToMany(() => User, user => user.ptTrainer)
  ptUsers: User[];
}