import { Trainer } from "src/trainer/entities/trainer.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Manager {
  @PrimaryColumn()
  userId: string;

  @OneToOne(() => User, user => user.manager)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Trainer, trainer => trainer.manager)
  trainers: Trainer[];
}