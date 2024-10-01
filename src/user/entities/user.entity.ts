import { Branch } from "src/branches/entities/branch.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { RoleType } from "../../auth/roles/enums/role.type";
import { Manager } from "src/manager/entities/manager.entity";
import { Trainer } from "src/trainer/entities/trainer.entity";
import * as argon2 from "argon2";

@Entity()
export class User {
  @PrimaryColumn({ type: 'varchar', length: 50})
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  telNumber: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'text'})
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

  @BeforeInsert()
  async hashPassword() {
  this.password = await argon2.hash(this.password);
  }

  @Column({type: "text", nullable: true})
  hashRefreshToken: string;
}