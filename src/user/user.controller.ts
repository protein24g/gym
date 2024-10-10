import { Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '회원 탈퇴',
  })
  @ApiOkResponse({description: '회원 탈퇴 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  async delete(@Req() request: Request) {
    const user = request.user as AuthPayload;
    const kakaoAccessToken = request.cookies['kakaoAccessToken'];
    await this.userService.delete(user.userId, kakaoAccessToken);
  }
}