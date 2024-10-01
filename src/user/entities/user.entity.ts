import { Branch } from "src/branches/entities/branch.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { RoleType } from "../role/enums/role.type";
import { Manager } from "src/manager/entities/manager.entity";
import { Trainer } from "src/trainer/entities/trainer.entity";

@Entity()
export class User {
  @PrimaryColumn({ type: 'varchar', length: 50})
  loginId: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'text', nullable: true })
  addressDetail: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @ManyToOne(() => Branch, branch => branch.users)
  branch: Branch;

  @OneToOne(() => Manager, manager => manager.user)
  manager: Manager;

  @OneToOne(() => Trainer, trainer => trainer.user)
  trainer: Trainer;

  @ManyToOne(() => Trainer, trainer => trainer.ptUsers)
  ptTrainer: Trainer;
}