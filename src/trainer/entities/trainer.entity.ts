import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Trainer {
  @PrimaryColumn()
  userId: string;

  @Column({type: 'text', nullable: true})
  introduction: string;

  @Column({type: 'json', nullable: true})
  qualifacations: string[];

  @Column({type: 'json', nullable: true})
  experience: string[];

  @OneToOne(() => User, user => user.trainer)
  @JoinColumn({name: 'userId'})
  user: User;

  @OneToMany(() => User, user => user.ptTrainer)
  ptUsers: User[];
}