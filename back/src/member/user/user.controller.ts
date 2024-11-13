import { Body, Controller, Delete, Get, Param, Patch, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles/guards/role.guard';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { Roles } from 'src/auth/roles/decorators/role.decorator';
import { UpdateUserDto } from './dto/UpdateUserDto';

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

  @Get('id/:userId')
  @Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER)
  @ApiOperation({ summary: '고유 ID로 회원 검색' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async findByName(@Param('userId') userId: string, @Res() response: Response) {
    const user = await this.userService.findUserById(parseInt(userId));
    return response.status(200).json({user});
  }

  @Patch('id/:userId')
  @Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER)
  @ApiOperation({ summary: '고유 ID로 회원 검색' })
  @ApiNotFoundResponse({ description: '존재하지 않는 유저' })
  async UpdateUserById(@Param('userId') userId: string, @Res() response: Response, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.UpdateUserById(parseInt(userId), updateUserDto);
    return response.status(200).json({message: '정보 수정 완료'});
  }

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