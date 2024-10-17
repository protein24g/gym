import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles/guards/role.guard';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { Roles } from 'src/auth/roles/decorators/role.decorator';

@Controller('api/users')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER)
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '사용자 전체 검색' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('name/:name')
  @ApiOperation({ summary: '사용자 이름으로 검색' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async findByName(@Param('name') name: string) {
    return await this.userService.findByName(name);
  }

  @Get('email/:email')
  @ApiOperation({ summary: '사용자 이메일로 검색' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async findByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  @Get('tel/:telNumber')
  @ApiOperation({ summary: '사용자 전화번호로 검색' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async findByTelNumber(@Param('telNumber') telNumber: string) {
    return await this.userService.findByTelNumber(telNumber);
  }

  @Delete('me')
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