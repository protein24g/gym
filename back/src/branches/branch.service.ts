import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { BranchDTO } from './dto/branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async findAll(): Promise<BranchDTO[]> {
    const response = await this.branchRepository.find();

    return response.map((branch) => {
      return {
        id: branch.id,
        name: branch.name
      }
    })
  }

  async getBranchCount(): Promise<number> {
    return await this.branchRepository.count();
  }
}
