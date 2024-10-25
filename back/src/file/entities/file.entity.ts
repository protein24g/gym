import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FileType } from "../enums/file-type.enum";
import { User } from "src/member/user/entities/user.entity";

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column()
  mimetype: string;

  @Column()
  path: string;

  @Column()
  size: number;

  @Column({type: 'enum', enum: FileType})
  fileType: FileType;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, user => user.profileImage, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'userId'})
  user: User;
}