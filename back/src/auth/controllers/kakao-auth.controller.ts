import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { KakaoAuthGuard } from "../guards/kakao-auth.guard";
import { ApiConflictResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { kakaoAuthService } from "../services/kakao-auth.service";
import { Request, Response } from "express";
import { UserService } from "src/member/user/user.service";
import { AuthService } from "../services/auth.service";
import { OAuthType } from "../enums/oauth-type.enum";
import { TokenService } from "../services/token.service";
import { AuthPayload } from "../interfaces/auth-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { OAuthPayload } from "../interfaces/oauth-payload.interface";
import { OAuthSignUpDTO } from "../dto/oauth-signup.dto";
import { ConfigService } from "@nestjs/config";

@Controller('api/kakao/oauth')
@ApiTags('OAuth')
export class kakaoAuthController {
  constructor(
    private readonly kakaoAuthService: kakaoAuthService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

      return response.redirect(this.configService.get<string>('FRONT_URL'));
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
    
      return response.redirect(this.configService.get<string>('FRONT_URL') + 'oauth-signup'); // 가입 안 된 사용자이기 때문에 기존 받은 정보와 함께 추가 정보 입력 페이지로 이동
    }
  }

  @Post('verify-token')
  @ApiOperation({
    summary: '카카오 회원가입 추가정보 입력 페이지 접속 토큰 검증',
    description: '추가정보 입력 페이지 접속시 기존에 받은 기본 정보를 담은 토큰 검증',
  })
  verifyToken(@Req() request: Request, @Res() response: Response) {
    const accessToken = request.cookies['accessToken'];
    
    if (!accessToken) {
      return response.json({ success: false });
    }
  
    const isValid = this.tokenService.checkOAuthAccessToken(accessToken);
    return response.json({ success: isValid });
  }

  @Post('signUp')
  @ApiOperation({
    summary: '카카오 회원가입',
    description: '카카오에서 받은 사용자 정보와 추가 정보를 합쳐서 회원가입 요청',
  })
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiConflictResponse({description: '이미 존재하는 OAuth 계정'})
  @ApiConflictResponse({description: '이미 존재하는 휴대폰 번호'})
  async signUp(@Req() request: Request, @Body() body: OAuthSignUpDTO, @Res() response: Response) {
    const accessToken = request.cookies['accessToken'];
    const user: OAuthPayload= this.jwtService.decode(accessToken);
    const payload = await this.authService.oAuthSignUp({
      ...user,
      ...body
    }, OAuthType.KAKAO);
    const token = await this.authService.signIn(payload);

    response.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: process.env.isProduction === 'true',
      maxAge: +process.env.ACCESS_TOKEN_EXPIRE_IN,
      sameSite: 'strict',
    });

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: process.env.isProduction === 'true',
      maxAge: +process.env.ACCESS_TOKEN_EXPIRE_IN,
      sameSite: 'strict',
    });

    return response.status(201).json({message: '회원가입 성공'});
  }
}