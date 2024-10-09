import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { accessSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';
import { File } from '../entities/file.entity';
import { UserService } from 'src/user/user.service';
import { FileType } from '../enums/file-type.enum';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly userService: UserService,
  ) {
    this.ensureDirectoryExists(this.fileUploadPath);
  }
  private fileUploadPath = join(__dirname, '/../../../uploads');

  ensureDirectoryExists(path: string): void {
    try {
      accessSync(path);
    } catch (error) {
      mkdirSync(path);
    }
  }

  async create(userId: string, file: Express.Multer.File, fileType: FileType, folder: string): Promise<void> {
    const user = await this.userService.findByUserId(userId);
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

  async update(userId: string, updateFile: Express.Multer.File, fileType: FileType, folder: string): Promise<void> {
    try {
      await this.delete(userId, folder);
    } catch(error) {
      await this.create(userId, updateFile, fileType, folder);
    }
  }

  async delete(userId: string, folder: string): Promise<void> {
    const file = await this.findByUserId(userId);
    if (!file) {
      throw new NotFoundException('존재하지 않는 파일');
    }

    try {
      unlinkSync(join(this.fileUploadPath, folder, file.fileName));

      await this.fileRepository.remove(file);

    } catch (error) {
      throw new InternalServerErrorException('파일 삭제 중 오류 발생');
    }
  }

  async findByUserId(userId: string): Promise<File> {
    return await this.fileRepository.findOne({where: {userId}});
  }
}
