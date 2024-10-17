import { Branch } from "src/branches/entities/branch.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gym {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", length: 50, nullable: false})
  name: string;

  @Column({type: 'text'})
  description: string;

  @OneToMany(() => Branch, branch => branch.gym, {cascade: true, onDelete: 'SET NULL', nullable: true})
  branches: Branch[];
}