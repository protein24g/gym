import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { accessSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';
import { File } from '../entities/file.entity';
import { FileType } from '../enums/file-type.enum';
import { UserService } from 'src/member/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.ensureDirectoryExists(this.fileUploadPath);
  }
  private fileUploadPath = join(this.configService.get<string>('FILE_UPLOAD_PATH'));

  ensureDirectoryExists(path: string): void {
    try {
      accessSync(path);
    } catch (error) {
      mkdirSync(path);
    }
  }

  async create(userId: number, file: Express.Multer.File, fileType: FileType, folder: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    this.ensureDirectoryExists(this.fileUploadPath + folder);
    const uniqueFileName = `${uuid()}_${file.originalname}`;
    const filePath = join(this.fileUploadPath, folder, uniqueFileName);

    try {
      writeFileSync(filePath, file.buffer);

      await this.fileRepository.save({
        fileName: uniqueFileName,
        originalName: file.originalname,
        mimetype: file.mimetype,
        path: filePath,
        size: file.size,
        fileType,
        user,
      });

    } catch (error) {
      throw new InternalServerErrorException('파일 저장 중 오류 발생');
    }
  }

  async update(userId: number, updateFile: Express.Multer.File, fileType: FileType, folder: string): Promise<void> {
    await this.delete(userId, folder);
    await this.create(userId, updateFile, fileType, folder);
  }

  async delete(userId: number, folder: string): Promise<void> {
    const file = await this.findById(userId);
    if (file) {
      try {
        unlinkSync(join(this.fileUploadPath, folder, file.fileName));
  
        await this.fileRepository.remove(file);
  
      } catch (error) {
        throw new InternalServerErrorException('파일 삭제 중 오류 발생');
      }
    }
  }

  async findById(userId: number): Promise<File> {
    return await this.fileRepository.findOne({where: {userId}});
  }
}
