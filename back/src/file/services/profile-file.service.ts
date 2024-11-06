import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileType } from "../enums/file-type.enum";

interface ProfilePayload {
  fileName: string | null;
}

@Injectable()
export class ProfileService {
  constructor(
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
  ) {}

  async create(userId: number, file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new NotFoundException('존재하지 않는 파일');
    }

    await this.fileService.create(userId, file, FileType.PROFILE, '/' + FileType.PROFILE.toLocaleLowerCase() + '/');
  }

  async findOne(userId: number): Promise<ProfilePayload | null> {
    const file = await this.fileService.findById(userId);
    return (file ? {fileName: file.fileName} : null)
  }

  async update(userId: number, updateFile: Express.Multer.File): Promise<void> {
    if (!updateFile) {
      throw new NotFoundException('존재하지 않는 파일');
    }

    await this.fileService.update(userId, updateFile, FileType.PROFILE, '/' + FileType.PROFILE.toLocaleLowerCase() + '/');
  }
}