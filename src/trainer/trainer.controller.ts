import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { RoleGuard } from 'src/auth/roles/guards/role.guard';
import { RoleType } from 'src/auth/roles/enums/role.type';
import { Roles } from 'src/auth/roles/decorators/role.decorator';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/trainers')
@ApiTags('Trainers')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TrainerController {
  constructor(
    private readonly trainerService: TrainerService
  ) {}

  @Post()
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  @ApiOperation({
    summary: '트레이너 생성'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'test05' },    
      }
    }
  })
  @ApiCreatedResponse({description: '트레이너 생성 성공'})
  @ApiConflictResponse({description: '이미 등록된 트레이너'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  async create(@Body() body: {userId: string}) {
    await this.trainerService.create(body.userId);
  }

  @Post('users')
  @Roles(RoleType.TRAINER)
  @ApiOperation({
    summary: '트레이너가 관리하는 PT수업 회원 생성'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'test05' },    
      }
    }
  })
  @ApiCreatedResponse({description: '회원 생성 성공'})
  @ApiForbiddenResponse({description: '자기 자신은 추가할 수 없습니다'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiConflictResponse({description: '이미 담당하고 있는 회원'})
  async createUser(@Req() request: any, @Body() body: {userId: string}) {
    return await this.trainerService.createUser(request.user.userId, body.userId);
  }

  @Get('users')
  @Roles(RoleType.TRAINER)
  @ApiOperation({
    summary: '트레이너가 관리하는 PT수업 회원 목록'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'test05' },    
      }
    }
  })
  @ApiOkResponse({description: '회원 목록 조회 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  async findAll(@Req() request: any) {
    return await this.trainerService.findAll(request.user.userId);
  }
  
  @Delete()
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  @ApiOperation({
    summary: '트레이너 삭제'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'test05' },    
      }
    }
  })
  @ApiOkResponse({description: '트레이너 삭제 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  async delete(@Body() body: {userId: string}) {
    await this.trainerService.delete(body.userId);
  }

  @Delete('users')
  @Roles(RoleType.TRAINER)
  @ApiOperation({
    summary: '트레이너가 관리하는 PT수업 회원 삭제'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'test05' },    
      }
    }
  })
  @ApiOkResponse({description: '회원 삭제 성공'})
  @ApiConflictResponse({description: '자기 자신은 삭제할 수 없습니다'})
  @ApiNotFoundResponse({description: '존재하지 않는 트레이너'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiConflictResponse({description: '이미 담당하지 않는 회원'})
  async deleteUser(@Req() request: any, @Body() body: {userId: string}) {
    return await this.trainerService.deleteUser(request.user.userId, body.userId);
  }
}
