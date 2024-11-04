import { Controller, Delete, Get, Query, Req, UseGuards } from '@nestjs/common';
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
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER)
  @ApiOperation({ summary: '회원 전체 검색' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async findAll(@Req() request: Request,
    @Query('page') page: string,
    @Query('size') size: string,
    @Query('select') select?: string | null,
    @Query('keyword') keyword?: string | null
   ) {
    const user = request.user as AuthPayload;

    return await this.userService.findAll(user, page, size, select, keyword);
  }

  // @Get('name/:name')
  // @Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER)
  // @ApiOperation({ summary: '회원 이름으로 검색' })
  // @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  // async findByName(@Param('name') name: string) {
  //   return await this.userService.findByName(name);
  // }

  // @Get('email/:email')
  // @Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER)
  // @ApiOperation({ summary: '회원 이메일로 검색' })
  // @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  // async findByEmail(@Param('email') email: string) {
  //   return await this.userService.findByEmail(email);
  // }

  // @Get('tel/:telNumber')
  // @Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER)
  // @ApiOperation({ summary: '회원 전화번호로 검색' })
  // @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  // async findByTelNumber(@Param('telNumber') telNumber: string) {
  //   return await this.userService.findByTelNumber(telNumber);
  // }

  @Get('me')
  @Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER, RoleType.USER)
  @ApiOperation({ summary: '내 정보' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async findMyInfo(@Req() request: Request) {
    const user = request.user as AuthPayload;
    return await this.userService.findMyInfo(user.userId);
  }

  @Delete('me')
  @Roles(RoleType.USER)
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