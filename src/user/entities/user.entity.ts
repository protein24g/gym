import { Branch } from "src/branches/entities/branch.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { RoleType } from "../../auth/roles/enums/role.type";
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

  @OneToOne(() => Trainer, trainer => trainer.user, {cascade: true, onDelete: 'SET NULL', nullable: true})
  trainer: Trainer;

  @ManyToOne(() => Trainer, trainer => trainer.ptUsers, {cascade: true, onDelete: 'SET NULL', eager: true, nullable: true})
  ptTrainer: Trainer;

  @BeforeInsert()
  async hashPassword() {
  this.password = await argon2.hash(this.password);
  }

  @Column({type: "text", nullable: true})
  hashRefreshToken: string;
}