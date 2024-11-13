import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/mypage')
@ApiTags('MyPage')
@UseGuards(JwtAuthGuard)
export class MypageController {
  constructor(
    private readonly mypageService: MypageService,
  ) {}

  @Get('')
  @ApiOperation({
    summary: '내 프로필 요약 정보 조회'
  })
  async getMyProfile(@Req() request: Request) {
    const user = request.user as AuthPayload;
    return await this.mypageService.getMyProfile(user.userId);
  }

  @Get('profile')
  @ApiOperation({
    summary: '내 프로필 이름, 사진 조회'
  })
  async getMyProfileImage(@Req() request: Request) {
    const user = request.user as AuthPayload;
    return await this.mypageService.getMyProfileImage(user.userId);
  }
}
