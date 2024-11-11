import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/mypage')
@UseGuards(JwtAuthGuard)
export class MypageController {
  constructor(
    private readonly mypageService: MypageService,
  ) {}

  @Get('profile')
  async getMyProfileImage(@Req() request: Request) {
    const user = request.user as AuthPayload;
    return await this.mypageService.getMyProfile(user.userId);
  }
}
