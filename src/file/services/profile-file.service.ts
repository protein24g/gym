import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileType } from "../enums/file-type.enum";

@Injectable()
export class ProfileService {
  constructor(
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
  ) {}

  async create(userId: string, file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new NotFoundException('존재하지 않는 파일');
    }

    await this.fileService.create(userId, file, FileType.PROFILE, '/' + FileType.PROFILE.toLocaleLowerCase() + '/');
  }

  async update(userId: string, updateFile: Express.Multer.File): Promise<void> {
    if (!updateFile) {
      throw new NotFoundException('존재하지 않는 파일');
    }

    await this.fileService.update(userId, updateFile, FileType.PROFILE, '/' + FileType.PROFILE.toLocaleLowerCase() + '/');
  }
}