import { Controller, Get } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/branches')
@ApiTags('Branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @ApiOperation({summary: '전체 지점 검색'})
  async findAll() {
    return await this.branchesService.findAll();
  }
}
