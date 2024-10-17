import { Branch } from "src/branches/entities/branch.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trainer } from "src/member/trainer/entities/trainer.entity";
import * as argon2 from "argon2";
import { File } from "src/file/entities/file.entity";
import { OAuthType } from "src/auth/enums/oauth-type.enum";
import { RoleType } from "src/auth/roles/enums/role.type.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  oAuthId: string;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  telNumber: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  birth: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  addressDetail: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ type: 'enum', enum: OAuthType, default: OAuthType.LOCAL})
  provider: OAuthType;

  @Column({ type: 'text', nullable: true})
  oAuthProfileUrl: string;

  @ManyToOne(() => Branch, branch => branch.users)
  branch: Branch;

  @OneToOne(() => Trainer, trainer => trainer.user, {cascade: true, onDelete: 'SET NULL', nullable: true})
  trainer: Trainer;

  @ManyToOne(() => Trainer, trainer => trainer.ptUsers, {cascade: true, onDelete: 'SET NULL', nullable: true})
  ptTrainer: Trainer;

  @OneToMany(() => File, file => file.user)
  files: File[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }

  @Column({type: "text", nullable: true})
  hashRefreshToken: string;
}