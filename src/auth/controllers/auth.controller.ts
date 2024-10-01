import { Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('login')
  @UseGuards(AuthGuard('local'))
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
  async logout(@Req() request: any, @Res() response: any) {
    await this.authService.logout(request);
    return response.json({ message: '로그아웃 성공'});
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
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
    return response.json({ message: 'refreshToken 발급 성공' });
  }
}