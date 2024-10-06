import { Body, Controller, Patch, UseGuards } from "@nestjs/common";
import { RoleType } from "../enums/role.type";
import { AuthGuard } from "@nestjs/passport";
import { RoleService } from "../services/role.service";
import { Roles } from "../decorators/role.decorator";
import { RoleGuard } from "../guards/role.guard";
import { ApiBody, ApiConflictResponse, ApiCookieAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/auth/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Patch()
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: '권한 수정',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'test01' },
        role: { type: 'string', enum: Object.values(RoleType), example: RoleType.TRAINER },
      },
    },
  })
  @ApiResponse({status: 404, description: '유효하지 않은 사용자'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiForbiddenResponse({description: '상위 권한을 수정하거나 부여할 수 없습니다'})
  @ApiNotFoundResponse({description: '존재하지 않는 유저'})
  @ApiConflictResponse({description: '이미 매니저가 존재합니다'})
  @ApiConflictResponse({description: '이미 권한이 부여된 유저입니다'})
  async update(@Body() body: { userId: string, role: RoleType }) {
    await this.roleService.update(body.userId, body.role);
  }
}