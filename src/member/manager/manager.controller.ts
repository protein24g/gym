import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles/guards/role.guard';
import { Roles } from 'src/auth/roles/decorators/role.decorator';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';

@Controller('api/managers')
@ApiTags('Managers')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(RoleType.OWNER)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  @ApiOperation({
    summary: '매니저 생성'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: '123 '}
      }
    }
  })
  @ApiCreatedResponse({description: '매니저 생성 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiConflictResponse({description: '담당 트레이너가 있는 회원은 매니저로 변경할 수 없습니다'})
  @ApiConflictResponse({description: '자신의 권한은 추가할 수 없습니다'})
  @ApiConflictResponse({description: '이미 권한이 부여된 유저'})
  async create(@Req() request: Request, @Body() body: {userId: number}) {
    const user = request.user as AuthPayload;
    await this.managerService.create(user, body.userId);
  }

  @Get()
  @Roles(RoleType.OWNER)
  @ApiOperation({
    summary: '매니저 목록'
  })
  @ApiOkResponse({description: '매니저 목록 조회 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 매니저'})
  async findAll() {
    return await this.managerService.findAll();
  }

  @Delete()
  @ApiOperation({
    summary: '매니저 삭제'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: '123' },    
      }
    }
  })
  @ApiCreatedResponse({description: '매니저 생성 성공'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiConflictResponse({description: '자신의 권한은 삭제할 수 없습니다'})
  @ApiConflictResponse({description: '이미 권한이 해지된 유저'})
  async delete(@Req() request: Request, @Body() body: {userId: number}) {
    const user = request.user as AuthPayload;
    await this.managerService.delete(user, body.userId);
  }
}
