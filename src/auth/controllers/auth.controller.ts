import { Body, Controller, HttpCode, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserCreateDto } from 'src/auth/dto/user-create.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { Request, Response } from 'express';
import { AuthPayload } from '../interfaces/auth-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('signin')
  @UseGuards(LocalAuthGuard)
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
  async login(@Req() request: Request, @Res() response: Response) {
    const payload = request.user as AuthPayload;
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
    return response.json({ message: '로그인 성공' });
  }
  
  @HttpCode(201)
  @Post('signup')
  @UseInterceptors(FileInterceptor('profileImage'))
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  @ApiOperation({
    summary: '회원가입',
  })
  @ApiOkResponse({description: '회원가입 성공'})
  @ApiConflictResponse({description: '이미 가입된 정보'})
  @ApiNotFoundResponse({description: '존재하지 않는 파일'})
  @ApiInternalServerErrorResponse({description: '파일 저장 중 오류 발생'})
  async signUp(
    @Body() userCreateDto: UserCreateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.authService.signUp(userCreateDto, file);
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
    const kakaoAccessToken = request.cookies['kakaoAccessToken'];
    const refreshToken = request.cookies['refreshToken'];
    await this.authService.signOut(user, kakaoAccessToken, refreshToken);
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
    return response.json({ message: '토큰 재발급 성공' });
  }
}