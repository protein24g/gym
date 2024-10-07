import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import { KakaoAuthGuard } from "../guards/kakao-auth.guard";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { kakaoAuthService } from "../services/kakao-auth.service";
import { Response } from "express";

@Controller('api/kakao/oauth')
@ApiTags('OAuth')
export class kakaoAuthController {
  constructor(
    private readonly kakaoAuthService: kakaoAuthService,
  ) {}

  @Get('authorize')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({
    summary: '카카오 로그인 요청',
    description: 'callback url로 인가 코드 전달',
  })
  async getAuthorize() {}

  @Get('callback')
  @ApiOperation({
    summary: '카카오 로그인 callback',
    description: '카카오 인가 코드를 통해 엑세스 토큰 발급 후, 사용자 정보를 조회하여 회원가입 또는 로그인',
  })
  @ApiOkResponse({description: '로그인 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  async kakaoCallback(@Query('code') code: string, @Res() response: Response) {
    const token = await this.kakaoAuthService.kakaoLogin(code);
    response.cookie('accessToken', token.accessToken,
      {
        httpOnly: true,
        secure: process.env.isProduction === 'true',
        maxAge: +process.env.ACCESS_TOKEN_EXPIRE_IN,
        sameSite: 'strict',
      }
    );

    response.cookie('refreshToken', token.refreshToken,
      {
        httpOnly: true,
        secure: process.env.isProduction === 'true',
        maxAge: +process.env.REFRESH_TOKEN_EXPIRE_IN,
        sameSite: 'strict',
      }
    );
    
    return response.json({ message: '로그인 성공' });
  }
}