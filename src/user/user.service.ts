import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RoleType } from 'src/auth/roles/enums/role.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByName(name: string) {
    return await this.userRepository.findOne({where: {name}});
  }

  async findByTelNumber(telNumber: string) {
    return await this.userRepository.findOne({where: {telNumber}});
  }

  async findByUserId(userId: string) {
    return await this.userRepository.findOne({where: {userId}});
  }

  async isManagerExists() {
    const manager = await this.userRepository.findOne({where: {role: RoleType.MANAGER}});
    return !!manager;
  }
}