import { Body, Controller, Get, HttpCode, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { Request, Response } from 'express';
import { AuthPayload } from '../interfaces/auth-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignInDTO } from '../dto/signin.dto';
import { SignUpDTO } from '../dto/signup.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(200)
  @Post('signin')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test01@email.com' },
        password: { type: 'string', example: 'testpw' },
      },
    },
  })
  @ApiOkResponse({description: '로그인 성공'})
  @ApiUnauthorizedResponse({description: '아이디 또는 패스워드 오류'})
  @ApiForbiddenResponse({description: '권한이 없습니다'})
  async signIn(@Req() request: Request, @Res() response: Response, @Body() signInDTO: SignInDTO) {
    request.user = await this.authService.validateUser(signInDTO);
    const payload = request.user as AuthPayload;
    try {
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
          maxAge: +process.env.REFRESH_TOKEN_EXPIRE_IN,
          sameSite: 'strict',
        }
      );

      return response.status(200).json({message: '로그인 성공', role: payload.role});
    } catch(error) {
      return response.redirect(this.configService.get<string>('FRONT_URL') + 'auth/oauth-signup');
    }
  }
  
  @HttpCode(201)
  @Post('signup')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({
    summary: '회원가입',
  })
  @ApiCreatedResponse({description: '회원가입 성공'})
  @ApiConflictResponse({description: '이미 존재하는 휴대폰 번호'})
  @ApiConflictResponse({description: '이미 존재하는 이메일'})
  @ApiNotFoundResponse({description: '존재하지 않는 파일'})
  @ApiNotFoundResponse({description: '존재하지 않는 지점'})
  @ApiInternalServerErrorResponse({description: '파일 저장 중 오류 발생'})
  async signUp(@Body() signUpDTO: SignUpDTO, @UploadedFile() file: Express.Multer.File, @Res() response: Response) {
    await this.authService.signUp(signUpDTO, file);

    return response.status(201).json({message: '회원가입 성공'});
  }

  @HttpCode(200)
  @Post('signout')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({
    summary: '로그아웃',
  })
  @ApiOkResponse({description: '로그아웃 성공'})
  @ApiUnauthorizedResponse({description: '비정상 refreshToken'})
  @ApiNotFoundResponse({description: '유효하지 않은 사용자'})
  async signOut(@Req() request: Request, @Res() response: Response) {
    const user = request.user as AuthPayload;
    const refreshToken = request.cookies['refreshToken'];
    try {
      await this.authService.signOut(user, refreshToken);
    } catch {
    } finally {
      response.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
      response.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });
    
    }
    return response.json({ message: '로그아웃 성공'});
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({
    summary: '토큰 재발급',
  })
  @ApiCreatedResponse({description: '토큰 재발급 성공'})
  @ApiUnauthorizedResponse({description: '비정상 리프레시 토큰'})
  @ApiNotFoundResponse({description: '유효하지 않은 사용자'})
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const user = request.user as AuthPayload;
    const refreshToken = request.cookies['refreshToken'];
    const token = await this.authService.refreshToken(user, refreshToken);
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
    
    return response.json({ role: user.role });
  }

  @Get('check-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '엑세스 토큰 검증',
  })
  checkToken(@Req() request: Request, @Res() response: Response): Response<{ role: string }> {
    const user = request.user as AuthPayload;
    return response.status(200).json({ role: user.role });
  }
}