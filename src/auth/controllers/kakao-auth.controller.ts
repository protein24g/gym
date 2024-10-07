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
  async kakaoCallback(@Query('code') code: string, @Res() response: any) {
    const token = await this.kakaoAuthService.kakaoLogin(code);
    response.cookie('accessToken', token.accessToken,
      {
        httpOnly: true,
        secure: process.env.isProduction === 'true',
        maxAge: +process.env.ACCESS_TOKEN_EXPIRE_IN,
        sameSite: 'Strict',
      }
    );

    response.cookie('refreshToken', token.refreshToken,
      {
        httpOnly: true,
        secure: process.env.isProduction === 'true',
        maxAge: +process.env.REFRESH_TOKEN_EXPIRE_IN,
        sameSite: 'Strict',
      }
    );
    
    return response.json({ message: '로그인 성공' });
  }
}