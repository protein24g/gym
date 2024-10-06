import { Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: '로그인',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'test01' },
        password: { type: 'string', example: 'testpw' },
      },
    },
  })
  @ApiOkResponse({description: '로그인 성공'})
  @ApiUnauthorizedResponse({description: '아이디 또는 패스워드 오류'})
  async login(@Req() request: any, @Res() response:any) {
    const token = await this.authService.login(request.user);
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

  @HttpCode(200)
  @Post('logout')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({
    summary: '로그아웃',
  })
  @ApiOkResponse({description: '로그아웃 성공'})
  @ApiUnauthorizedResponse({description: '비정상 refreshToken'})
  @ApiNotFoundResponse({description: '유효하지 않은 사용자'})
  async logout(@Req() request: any, @Res() response: any) {
    await this.authService.logout(request);
    return response.json({ message: '로그아웃 성공'});
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({
    summary: '토큰 재발급',
  })
  @ApiCreatedResponse({description: '토큰 재발급 성공'})
  @ApiUnauthorizedResponse({description: '비정상 refreshToken'})
  @ApiNotFoundResponse({description: '유효하지 않은 사용자'})
  async refreshToken(@Req() request: any, @Res() response: any) {
    const token = await this.authService.refreshToken(request);
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
    return response.json({ message: '토큰 재발급 성공' });
  }
}