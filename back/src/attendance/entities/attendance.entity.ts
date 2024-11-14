import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../member/user/entities/user.entity";
import { Branch } from "src/branches/entities/branch.entity";

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User , user => user.attendances)
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToOne(() => Branch, branch => branch.attendances)
  @JoinColumn({name: 'branchId'})
  branch: Branch;

  @CreateDateColumn()
  createAt: Date;
}