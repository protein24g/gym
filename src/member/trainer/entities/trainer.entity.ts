import { User } from "src/member/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({type: 'text', nullable: true})
  introduction: string;

  @Column({type: 'json', nullable: true})
  qualifications: string[];

  @Column({type: 'json', nullable: true})
  careerDetails: string[];

  @OneToOne(() => User, user => user.trainer)
  @JoinColumn({name: 'userId'})
  user: User;

  @OneToMany(() => User, user => user.ptTrainer)
  ptUsers: User[];
}