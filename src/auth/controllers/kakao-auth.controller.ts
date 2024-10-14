import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { KakaoAuthGuard } from "../guards/kakao-auth.guard";
import { ApiNotFoundResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { kakaoAuthService } from "../services/kakao-auth.service";
import { Request, Response } from "express";
import { UserService } from "src/member/user/user.service";
import { AuthService } from "../services/auth.service";
import { OAuthType } from "../enums/oauth-type.enum";
import { TokenService } from "../services/token.service";
import { AuthPayload } from "../interfaces/auth-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { OAuthPayload } from "../interfaces/oauth-payload.interface";

@Controller('api/kakao/oauth')
@ApiTags('OAuth')
export class kakaoAuthController {
  constructor(
    private readonly kakaoAuthService: kakaoAuthService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
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
    description: '카카오 인가 코드를 이용해 AccessToken 을 받고 토큰을 이용해 사용자 정보 요청 후 가입 여부에 따라 로그인, 추가 정보 입력 페이지로 redirect',
  })
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  async kakaoCallback(@Query('code') code: string, @Res() response: Response) {
    const kakaoAccessToken = await this.kakaoAuthService.getKakaoAccessToken(code);
    const oAuthPayload = await this.kakaoAuthService.getKakaoUserInfo(kakaoAccessToken);

    const user = await this.userService.findByOAuthId(oAuthPayload.oAuthId);
    if (user) {
      const payload: AuthPayload = { userId: user.id, role: user.role };
      const token = await this.authService.signIn(payload);
      
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
          maxAge: +process.env.ACCESS_TOKEN_EXPIRE_IN,
          sameSite: 'strict',
        }
      );

      return response.redirect('dashboard'); // 로그인 성공 시 대시보드로 이동
    } else {
      const token = this.tokenService.createOAuthAccessToken(oAuthPayload);

      response.cookie('accessToken', token,
        {
          httpOnly: true,
          secure: process.env.isProduction === 'true',
          maxAge: +process.env.ACCESS_TOKEN_EXPIRE_IN,
          sameSite: 'strict',
        }
      );
    
      return response.redirect('register');
    }
  }

  @Get('dashboard')
  async dashboard() {
  }

  @Get('register') // 토큰 검증 후 OAuth 가입 정보 목록 반환, 추가 정보 입력 폼
  @ApiOperation({
    summary: '가입시 추가 정보 입력',
  })
  async registerPage(@Req() request: Request): Promise<OAuthPayload> {
    const token = request.cookies['accessToken'];
    const decoded = await this.jwtService.decode(token);

    return {
      oAuthId: decoded.oAuthId,
      name: decoded.name,
      oAuthProfileUrl: decoded.oAuthProfileUrl
    };
  }

  @Post('register') // 클라이언트에서 보낸 추가 정보로 계정 생성 후 로그인 토큰 발급
  @ApiOperation({
    summary: '추가 정보를 받아 회원가입 후 로그인',
  })
  async register(@Body() body: any, @Res() response: Response) {
    const payload = await this.authService.oAuthSignUp(body, OAuthType.KAKAO);
    const token = await this.authService.signIn(payload);

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
        maxAge: +process.env.ACCESS_TOKEN_EXPIRE_IN,
        sameSite: 'strict',
      }
    );

    return response.redirect('dashboard'); // 로그인 성공 시 대시보드로 이동
  }
}