import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { OAuthType } from 'src/auth/enums/oauth-type.enum';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async delete(userId: number, kakaoAccessToken: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }
    
    if (user.provider === OAuthType.KAKAO) {
      await axios.post('https://kapi.kakao.com/v1/user/unlink', null,
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`
          }
        }
      );
    }

    await this.userRepository.remove(user);
  }

  async findByName(name: string): Promise<User> {
    return await this.userRepository.findOne({where: {name}});
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({where: {email}});
  }

  async findByTelNumber(telNumber: string): Promise<User> {
    return await this.userRepository.findOne({where: {telNumber}});
  }

  async findUserByTelNumberWithPtTrainer(telNumber: string): Promise<User> {
    return await this.userRepository.findOne({where: {telNumber}, relations: ['ptTrainer']});
  }

  async findById(userId: number): Promise<User> {
    return await this.userRepository.findOne({where: {id: userId}});
  }

  async isManagerExists(): Promise<boolean> {
    const manager = await this.userRepository.findOne({where: {role: RoleType.MANAGER}});
    return !!manager;
  }
}