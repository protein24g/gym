import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { OAuthType } from 'src/auth/enums/oauth-type.enum';
import axios from 'axios';
import { UserPayload } from './interfaces/user-payload.interface';
import { User } from './entities/user.entity';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { UserInfoPayload } from './interfaces/user-info-payload.interface';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async getRecentMonthUserRegisters(payload: AuthPayload): Promise<{ name: string; count: number }[]> {
    // 오늘 날짜 자정
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 30일 전 날짜 계산
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 29);  // 30일간의 데이터를 포함하려면 -29로 설정
    startDate.setHours(0, 0, 0, 0); // 자정으로 설정

    // 현재 날짜 끝 시간 설정 (23:59:59)
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999); // 23:59:59로 설정

    const user = await this.findById(payload.userId);

    // `startDate`와 `endDate`를 Between으로 사용하여 쿼리 실행
    const res = await this.userRepository.find({
      relations: ['branch'],
      where: {
        createdAt: Between(startDate, endDate),
        role: RoleType.USER,
        ...(payload.role === RoleType.OWNER
          ? {} // OWNER는 전체 조회
          : { branch: { id: user.branch.id } }) // MANAGER, TRAINER는 해당 branch 조회
      },
      order: { id: 'asc' }
    });

    const dateDict: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = String(date.getFullYear()) + String((date.getMonth() + 1)).padStart(2, '0') + String(date.getDate()).padStart(2, '0');
      dateDict[dateKey] = 0;
    }

    res.forEach((user) => {
      dateDict[String(user.createdAt.getFullYear()) + String((user.createdAt.getMonth() + 1)).padStart(2, '0') + String(user.createdAt.getDate()).padStart(2, '0')]++;
    })

    // dateDict를 { name: string, count: number }[] 형식으로 변환
    const chartData = Object.keys(dateDict).map((dateKey) => ({
      name: dateKey, // 날짜 (예: '20241015')
      count: dateDict[dateKey], // 해당 날짜의 사용자 수
    }));

    return chartData;
  }

  async getUserConut(payload: AuthPayload): Promise<number> {
    if (payload.role === RoleType.OWNER) {
      return await this.userRepository.count({where: {role: RoleType.USER}});
    } else {
      const user = await this.findById(payload.userId);

      if (!user) {
        throw new NotFoundException('존재하지 않는 유저');
      }

      return await this.userRepository.count({where: {branch: {id: user.branch.id}, role: RoleType.USER}});
    }
  }

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

  async findAll(payload: AuthPayload, page: string, size: string, select: string | null, keyword: string | null): Promise<{users: UserPayload[], totalCount: number} | UserPayload> {
    let users: User[], total: number;
    const take = (size ? parseInt(size, 10) : null);
    const skip = (page ? (parseInt(page, 10) - 1) * take : null);

    if (select && keyword) {
      if (select === 'name') return this.findByName(keyword, take, skip);
      else if (select === 'telNumber') return this.findByTelNumber(keyword);
      else {
        throw new NotFoundException('존재하지 않는 검색 조건');
      }
    }

    if (payload.role === RoleType.OWNER) { // 모든 지점 회원 검색
      [users, total] = await this.userRepository.findAndCount({
        where: {
          role: RoleType.USER,
        },
        relations: ['branch'],
        skip,
        take,
        order: {id: 'DESC'}
      });
    } else {
      const user = await this.findById(payload.userId);
      if (!user) {
        throw new NotFoundException('존재하지 않는 유저');
      }
      
      [users, total] = await this.userRepository.findAndCount({
        where: {role: RoleType.USER, branch: {id: user.branch.id}},
        relations: ['branch'],
        skip,
        take,
        order: {id: 'DESC'}
      });
    }
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

  async findByName(name: string, take: number, skip: number): Promise<{users: UserPayload[], totalCount: number}> {
    const [users, total] = await this.userRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
        role: RoleType.USER},
      relations: ['branch'],
      skip,
      take,
      order: {id: 'DESC'}
    });
    if (total === 0) {
      throw new NotFoundException('존재하지 않는 유저');
    }

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
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }
    
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

  async findUserById(userId: number): Promise<UserInfoPayload> {
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['ptTrainer', 'profileImage', 'branch']});
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telNumber: user.telNumber,
      birth: user.birth,
      createAt: user.createdAt,
      role: user.role,
      branchId: user.branch ? user.branch.id : null,
      branchName: user.branch ? user.branch.name : null,
      profileImageUrl: user.profileImage ?
        this.configService.get<string>('BACK_URL') + 'uploads/' + user.profileImage.fileName
        : 
        user.oAuthProfileUrl ?
        user.oAuthProfileUrl
        :
        null,
    }
  }

  async UpdateUserById(userId: number, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    await this.userRepository.update(userId, updateUserDto);
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