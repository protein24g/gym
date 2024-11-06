import { Controller, Get, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ProfileService } from "../services/profile-file.service";
import { AuthPayload } from "src/auth/interfaces/auth-payload.interface";
import { Request } from "express";

@Controller('api/profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '특정 고유 ID 프로필 사진 조회',
  })
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  async findOne(@Req() request: Request) {
    const user = request.user as AuthPayload
    await this.profileService.findOne(user.userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({
    summary: '프로필 사진 수정',
  })
  @ApiOkResponse({description: '프로필 사진 수정 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiNotFoundResponse({description: '존재하지 않는 파일'})
  @ApiInternalServerErrorResponse({description: '파일 삭제 중 오류 발생'})
  async update(@Req() request: Request, @UploadedFile() file: Express.Multer.File) {
    const user = request.user as AuthPayload
    await this.profileService.update(user.userId, file);
  }
}