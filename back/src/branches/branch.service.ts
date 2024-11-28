import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async findAll(): Promise<BranchInfo[]> {
    const branches = await this.branchRepository.find({order: {id: 'ASC'}, relations: ['manager']});
    if (!branches) {
      return;
    }

    return branches?.map((branch) => ({
      id: branch.id,
      branchName: branch.name || '',
      managerName: branch.manager?.name || '공석',
      email: branch.manager?.email || '',
      telNumber: branch.manager?.telNumber || '',
      address: `${branch.address} ${branch.addressDetail || ''}`.trim(),
    }));
  }

  async findBranchesForSignup(): Promise<BranchListForSignupResponse[]> {
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

  async update(payload: AuthPayload, body: {prevUserId: number, userId: number}) {
    const branch = await this.branchRepository.findOne({where: {manager: {id: body.userId}}, relations: ['manager']});
  }

  async delete(id: number) {
    const branch = await this.branchRepository.findOne({where: {id}, relations: ['manager']});
    await this.branchRepository.remove(branch);
  }
}
