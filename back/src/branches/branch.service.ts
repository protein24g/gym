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

  async getBranchUserCount(): Promise<{ name: string; count: number }[]> {
    const branches = await this.branchRepository
      .createQueryBuilder('branch')
      .leftJoinAndSelect('branch.users', 'user')
      .select('branch.name', 'name')
      .addSelect('COUNT(user.id)', 'count')
      .where('user.role = :role', { role: 'ROLES_USER' })
      .groupBy('branch.id')
      .orderBy('branch.id', 'ASC')
      .getRawMany();
  
    return branches.map((branch) => ({
      name: branch.name.split(' ')[1],
      count: parseInt(branch.count, 10),
    }));
  }
}
