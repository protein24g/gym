import { Body, Controller, HttpCode, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserCreateDto } from 'src/auth/dto/user-create.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';

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
  async login(@Req() request: any, @Res() response:any) {
    const token = await this.authService.signIn(request.user);
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
  
  @HttpCode(201)
  @Post('signup')
  @UsePipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  @ApiOperation({
    summary: '회원가입',
  })
  @ApiOkResponse({description: '회원가입 성공'})
  @ApiConflictResponse({description: '이미 가입된 정보'})
  async signUp(@Body() userCreateDto: UserCreateDto) {
    return await this.authService.signUp(userCreateDto);
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
  async signOut(@Req() request: any, @Res() response: any) {
    await this.authService.signOut(request);
    return response.json({ message: '로그아웃 성공'});
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
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