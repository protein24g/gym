import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { KakaoAuthGuard } from "../guards/kakao-auth.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { kakaoAuthService } from "../services/kakao-auth.service";

@Controller('api/kakao/oauth')
@ApiTags('OAuth')
export class kakaoAuthController {
  constructor(
    private readonly kakaoAuthService: kakaoAuthService,
  ) {}

  @Get('authorize')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({
    summary: '카카오 인가 코드 받기'
  })
  async getAuthorize(@Req() request: Request) {
  }

  @Get('callback')
  async kakaoCallback(@Query('code') code: string, @Res() response: Response) {
    await this.kakaoAuthService.kakaoLogin(code);
  }
}