import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { BranchService } from './branch.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles/decorators/role.decorator';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';

@Controller('api/branches')
@ApiTags('Branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  @ApiOperation({summary: '전체 지점 검색'})
  async findAll() {
    return await this.branchService.findAll();
  }

  @Get('signup')
  @ApiOperation({ summary: '가입 시 사용할 지점 리스트 조회' })
  async findBranchesForSignup() {
    return await this.branchService.findBranchesForSignup();  // 가입 시 필요한 지점 리스트 반환
  }

  @Delete(':id')
  @ApiOperation({ summary: '지점 삭제' })
  @UseGuards(JwtAuthGuard)
  @Roles(RoleType.OWNER)
  async delete(@Param('id') id: number) {
    await this.branchService.delete(id);
  }
}
