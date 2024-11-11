import { Controller, Get } from '@nestjs/common';
import { BranchService } from './branch.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/branches')
@ApiTags('Branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  @ApiOperation({summary: '전체 지점 검색'})
  async findAll() {
    return await this.branchService.findAll();
  }
}
