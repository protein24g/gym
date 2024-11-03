import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { OAuthType } from 'src/auth/enums/oauth-type.enum';
import axios from 'axios';
import { UserPayload } from './interfaces/user-payload.interface';
import { User } from './entities/user.entity';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';

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

  async findAll(payload: AuthPayload, page: string, size: string): Promise<{users: UserPayload[], totalCount: number}> {
    let users: User[];

    const take = (size ? parseInt(size, 10) : null);
    const skip = (page ? (parseInt(page, 10) - 1) * take : null);

    let total: number;
    if (payload.role === RoleType.OWNER) { // 모든 지점 회원 검색
      [users, total] = await this.userRepository.findAndCount(
        {
          where: {role: RoleType.USER},
          relations: ['branch'],
          skip,
          take,
          order: {id: 'DESC'}
        });
      return {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          telNumber: user.telNumber,
          birth: user.birth,
          createAt: user.createdAt,
          role: user.role,
          branchId: user.branch ? user.branch.id : null,
          branchName: user.branch ? user.branch.name : null
        })),
        totalCount: total
      };
    } else if (payload.role === RoleType.MANAGER || payload.role === RoleType.TRAINER) {
      const user = await this.findById(payload.userId);
      if (!user) {
        throw new NotFoundException('존재하지 않는 유저');
      }
      
      [users, total] = await this.userRepository.findAndCount(
        {
          where: {role: RoleType.USER, branch: {id: user.branch.id}},
          relations: ['branch'],
          skip,
          take,
          order: {id: 'DESC'}
        });
      return {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          telNumber: user.telNumber,
          birth: user.birth,
          createAt: user.createdAt,
          role: user.role,
          branchId: user.branch ? user.branch.id : null,
          branchName: user.branch ? user.branch.name : null
        })),
        totalCount: total
      }
    }
  }

  async findByName(name: string): Promise<UserPayload[]> {
    const users = await this.userRepository.find(
      {
        where: {name, role: RoleType.USER},
        order: {id: 'DESC'}
      });

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null,
      branchName: user.branch ? user.branch.name : null
    }));
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {email}});
    if (user) return true;
    return false;
  }

  async findByEmail(email: string): Promise<UserPayload> {
    const user = await this.userRepository.findOne(
      {
        where: {email, role: RoleType.USER},
        order: {id: 'DESC'}
      });
    if (!user) return;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null,
      branchName: user.branch ? user.branch.name : null
    };
  }

  async checkTelNumberExists(telNumber: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {telNumber}});
    if (user) return true;
    return false;
  }

  async findByTelNumber(telNumber: string): Promise<UserPayload> {
    const user = await this.userRepository.findOne(
      {
        where: {telNumber, role: RoleType.USER},
        relations: ['branch']
      });
    if (!user) return;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null,
      branchName: user.branch ? user.branch.name : null
    };
  }

  async findMyInfo(userId: number): Promise<UserPayload> {
    const user = await this.userRepository.findOne(
      {
        where: {id: userId},
        relations: ['ptTrainer']
      });
    if (!user) return;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null,
      branchName: user.branch ? user.branch.name : null
    }
  }

  async findById(userId: number): Promise<User> {
    return await this.userRepository.findOne({where: {id: userId}, relations: ['ptTrainer', 'profileImage', 'branch']});
  }
  
  async checkOAuthIdExists(oAuthId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {oAuthId}});
    if (user) return true;
    return false
  }

  async findByOAuthId(oAuthId: string): Promise<User> {
    return await this.userRepository.findOne({where: {oAuthId}, relations: ['ptTrainer']});
  }

  async findByIdWithPtTrainer(userId: number): Promise<User> {
    return await this.userRepository.findOne({where: {id: userId}, relations: ['ptTrainer']});
  }

  async isManagerExists(): Promise<boolean> {
    const manager = await this.userRepository.findOne({where: {role: RoleType.MANAGER}});
    return !!manager;
  }
}