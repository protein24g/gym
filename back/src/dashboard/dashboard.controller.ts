import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/auth/roles/decorators/role.decorator';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService
  ) {}

  @Get()
  @Roles(RoleType.OWNER, RoleType.MANAGER, RoleType.TRAINER)
  @ApiOperation({
    summary: '대시보드 요약 정보 조회'
  })
  async getDashboardSummary(@Req() request: Request, @Res() response: Response) {
    const user = request.user as AuthPayload;
    const summary = await this.dashboardService.getDashboardSummary(user);
    return response.status(200).json(summary);
  }
}
