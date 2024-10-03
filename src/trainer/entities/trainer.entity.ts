import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Trainer {
  @PrimaryColumn()
  userId: string;

  @Column({type: 'text', nullable: true})
  introduction: string;

  @Column({type: 'json', nullable: true})
  qualifications: string[];

  @Column({type: 'json', nullable: true})
  careerDetails: string[];

  @OneToOne(() => User, user => user.trainer)
  user: User;

  @OneToMany(() => User, user => user.ptTrainer)
  ptUsers: User[];
}