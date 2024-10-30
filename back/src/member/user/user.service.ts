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

  async findAll(payload: AuthPayload): Promise<UserPayload[]> {
    let users: User[];
    if (payload.role === RoleType.OWNER) { // 모든 지점 회원 검색
      users = await this.userRepository.find({where: {role: RoleType.USER}, relations: ['branch']});
      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        telNumber: user.telNumber,
        birth: user.birth,
        createAt: user.createdAt,
        role: user.role,
        branchId: user.branch ? user.branch.id : null
      }));
    } else if (payload.role === RoleType.MANAGER || payload.role === RoleType.TRAINER) {
      const user = await this.findById(payload.userId);
      if (!user) {
        throw new NotFoundException('존재하지 않는 유저');
      }
      
      users = await this.userRepository.find({where: {role: RoleType.USER, branch: {id: user.branch.id}}, relations: ['branch']});
      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        telNumber: user.telNumber,
        birth: user.birth,
        createAt: user.createdAt,
        role: user.role,
        branchId: user.branch ? user.branch.id : null
      }));
    }

    if (users.length === 0) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null
    }));
  }

  async findByName(name: string): Promise<UserPayload[]> {
    const users = await this.userRepository.find({where: {name, role: RoleType.USER}});

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null
    }));
  }

  async findByEmail(email: string): Promise<UserPayload> {
    const user = await this.userRepository.findOne({where: {email, role: RoleType.USER}});
    if (!user) return;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null
    };
  }

  async findByTelNumber(telNumber: string): Promise<UserPayload> {
    const user = await this.userRepository.findOne({where: {telNumber, role: RoleType.USER}, relations: ['branch']});
    if (!user) return;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null
    };
  }

  async findMyInfo(userId: number): Promise<UserPayload> {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['ptTrainer']});
    if (!user) return;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null
    }
  }

  async findById(userId: number): Promise<User> {
    return await this.userRepository.findOne({where: {id: userId}, relations: ['ptTrainer', 'profileImage', 'branch']});
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