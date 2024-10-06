import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { RoleType } from 'src/auth/roles/enums/role.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(userCreateDto: UserCreateDto) {
    const userId = await this.findByUserId(userCreateDto.userId);
    if (userId) {
      throw new ConflictException('이미 존재하는 아이디');
    }
    
    const telNumber = await this.findByTelNumber(userCreateDto.telNumber);
    if (telNumber) {
      throw new ConflictException('이미 존재하는 휴대폰 번호');
    }
    
    const user = this.userRepository.create({
      ...userCreateDto,
      createdAt: Date(),
    });
    await this.userRepository.save(user);

    return {
      userId: user.userId,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

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