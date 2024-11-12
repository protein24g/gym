import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { RoleGuard } from 'src/auth/roles/guards/role.guard';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { Roles } from 'src/auth/roles/decorators/role.decorator';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';

@Controller('api/trainers')
@ApiTags('Trainers')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TrainerController {
  constructor(
    private readonly trainerService: TrainerService
  ) {}

  @Post()
  @Roles(RoleType.MANAGER)
  @ApiOperation({
    summary: '트레이너 생성'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: '123' },    
      }
    }
  })
  @ApiOkResponse({description: '트레이너 생성 성공'})
  @ApiConflictResponse({description: '자신의 권한은 추가할 수 없습니다'})
  @ApiConflictResponse({description: '이미 등록된 트레이너'})
  @ApiConflictResponse({description: '담당 트레이너가 있는 회원을 트레이너로 변경할 수 없습니다'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  async create(@Req() request: Request, @Body() body: {userId: number}) {
    const user = request.user as AuthPayload;
    await this.trainerService.create(user, body.userId);
  }

  @Post('users')
  @Roles(RoleType.MANAGER, RoleType.TRAINER)
  @ApiOperation({
    summary: '트레이너가 관리하는 PT수업 회원 생성'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: '123' },    
      }
    }
  })
  @ApiCreatedResponse({description: '회원 생성 성공'})
  @ApiConflictResponse({description: '자신의 권한은 추가할 수 없습니다'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiConflictResponse({description: '이미 담당하고 있는 회원'})
  async createUser(@Req() request: Request, @Body() body: {userId: number}) {
    const user = request.user as AuthPayload;
    return await this.trainerService.createUser(user.userId, body.userId);
  }

  @Get()
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  @ApiOperation({
    summary: '트레이너 목록'
  })
  @ApiOkResponse({description: '트레이너 목록 조회 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  async findAll(@Req() request: Request) {
    const user = request.user as AuthPayload;
    return await this.trainerService.findAll(user);
  }

  @Get('users')
  @Roles(RoleType.TRAINER)
  @ApiOperation({
    summary: '트레이너가 관리하는 PT수업 회원 목록'
  })
  @ApiOkResponse({description: '회원 목록 조회 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  async findAllPtUsers(@Req() request: Request) {
    const user = request.user as AuthPayload;
    return await this.trainerService.findAllPtUsers(user.userId);
  }
  
  @Delete()
  @Roles(RoleType.MANAGER)
  @ApiOperation({
    summary: '트레이너 삭제'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: '123' },    
      }
    }
  })
  @ApiOkResponse({description: '트레이너 삭제 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  @ApiConflictResponse({description: '자신의 권한은 삭제할 수 없습니다'})
  async delete(@Req() request: Request, @Body() body: {userId: number}) {
    const user = request.user as AuthPayload;
    await this.trainerService.delete(user, body.userId);
  }

  @Delete('users')
  @Roles(RoleType.MANAGER, RoleType.TRAINER)
  @ApiOperation({
    summary: '트레이너가 관리하는 PT수업 회원 삭제'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: '123' },    
      }
    }
  })
  @ApiOkResponse({description: '회원 삭제 성공'})
  @ApiConflictResponse({description: '자신의 권한은 삭제할 수 없습니다'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiConflictResponse({description: '담당하지 않는 회원'})
  async deleteUser(@Req() request: Request, @Body() body: {userId: number}) {
    const user = request.user as AuthPayload;
    return await this.trainerService.deleteUser(user.userId, body.userId);
  }
}
