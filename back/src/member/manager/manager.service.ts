import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { Branch } from 'src/branches/entities/branch.entity';

@Injectable()
export class ManagerService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(payload: AuthPayload, userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (user.ptTrainer) {
      throw new ConflictException('담당 트레이너가 있는 회원은 매니저로 변경할 수 없습니다');
    }

    if (payload.userId === user.id) {
      throw new ConflictException('자신의 권한은 추가할 수 없습니다');
    }

    if (user.role === RoleType.MANAGER) {
      throw new ConflictException('이미 권한이 부여된 유저')
    }

    await this.userRepository.update({id: user.id}, {role: RoleType.MANAGER});
  }

  async findAll(): Promise<ManagerInfo[]> {
    const manager = await this.userRepository.find({where: {role: RoleType.MANAGER}, relations: ['branch'], order: {branch: {id: 'ASC'}}});
    if (!manager) {
      throw new NotFoundException('존재하지 않는 매니저');
    }

    return manager.map(manager => ({
      email: manager.email,
      name: manager.name,
      telNumber: manager.telNumber,
      branchName: manager.branch.name,
      address: manager.branch.address + manager.branch.addressDetail
    }));
  }

  async update(payload: AuthPayload, body: {prevUserId: number, userId: number, address: string}): Promise<void> {
    const prevUser = await this.userService.findById(body.userId);
    if (!prevUser) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (body.userId) {
      const user = await this.userService.findById(body.userId);
      if (!user) {
        throw new NotFoundException('존재하지 않는 유저');
      }
  
      try {
        if (body.prevUserId !== body.userId) {
          await this.delete(payload, body.prevUserId);
        }
      } catch (error) {
      } finally {
        await this.create(payload, body.userId);
      }
    }

    await this.branchRepository.update({id: prevUser.branch.id}, {manager: {id: body.userId}, address: body.address});
  }

  async delete(payload: AuthPayload, userId: number): Promise<void> {
    const manager = await this.userService.findById(userId);
    if (!manager) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (payload.userId === userId) {
      throw new ConflictException('자신의 권한은 삭제할 수 없습니다');
    }

    if (manager.role !== RoleType.MANAGER) {
      throw new ConflictException('이미 권한이 해지된 유저');
    }

    await this.userRepository.update({id: userId}, {role: RoleType.USER});
  }
}
