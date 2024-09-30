import { Branch } from "src/branches/entities/branch.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from "../role/enums/role.type";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 50, nullable: false, unique: true})
  loginId: string;

  @Column({type: 'varchar', length: 100, nullable: false})
  password: string;

  @Column({type: 'varchar', length: 20, nullable: false})
  name: string;

  @Column({type: 'text', nullable: false})
  address: string;

  @Column({type: 'text'})
  addressDetail: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({type: 'enum', enum: RoleType, default: RoleType.USER})
  role: RoleType;

  @ManyToOne(() => Branch, branch => branch.users)
  @JoinColumn({name: 'branchId'})
  branch: Branch;
}