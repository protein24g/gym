import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { FileType } from "../enums/file-type.enum";
import { User } from "src/user/entities/user.entity";

@Entity()
export class File {
  @PrimaryColumn()
  userId: string;

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

  @ManyToOne(() => User, user => user.files, {onDelete: "CASCADE"})
  @JoinColumn({name: 'userId'})
  user: User;
}