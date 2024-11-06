import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { Repository } from 'typeorm';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import * as argon2 from "argon2";
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';
import { UserPayload } from '../user/interfaces/user-payload.interface';
import { TrainerPayload } from './interfaces/trainer-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrainerService {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async create(payload: AuthPayload, userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (payload.userId === user.id) {
      throw new ConflictException('자신의 권한은 추가할 수 없습니다');
    }

    if (user.ptTrainer) {
      throw new ConflictException('담당 트레이너가 있는 회원을 트레이너로 변경할 수 없습니다');
    }

    const trainer = await this.findById(userId);
    if (trainer) {
      throw new ConflictException('이미 등록된 트레이너');
    } else {
      await this.trainerRepository.save({
        userId: user.id,
        user
      });
    }

    await this.userRepository.update({id: user.id}, {role: RoleType.TRAINER, password: await argon2.hash(user.birth)});
  }

  async createUser(trainerId: number, userId: number): Promise<void> {
    const trainer = await this.findById(trainerId);
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }

    const user = await this.userService.findByIdWithPtTrainer(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if(trainer.userId === user.id) {
      throw new ConflictException('자신의 권한은 추가할 수 없습니다');
    }

    if (!!user.ptTrainer) {
      throw new ConflictException('이미 담당하고 있는 회원');
    }

    await this.userRepository.update(user.id, {
      ptTrainer: trainer,
    });
  }

  async findAll(user: AuthPayload, page: string, size: string, keyword: string | null): Promise<TrainerPayload[]> {
    const trainers = await this.trainerRepository.find({
      relations: ['user', 'ptUsers'], // ptUsers 관계 추가
    });
  
    if (!trainers.length) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }
  
    return Promise.all(
      trainers.map(async (trainer) => {
        // user.id로 user 데이터 조회
        const user = await this.userRepository.findOne({
          where: { id: trainer.user.id },
          relations: ['profileImage'], // profileImage와 함께 가져오기
        });
  
        // profileImageUrl 결정
        const profileImageUrl = user?.profileImage
          ? this.configService.get<string>('BACK_URL') + 'uploads/' + user.profileImage.fileName
          : user?.oAuthProfileUrl || null;
  
        return {
          id: trainer.user.id,
          name: trainer.user.name,
          introduction: trainer.introduction,
          qualifications: trainer.qualifications,
          careerDetails: trainer.careerDetails,
          profileImageUrl: profileImageUrl,
          studentsCount: trainer.ptUsers.length, // ptUsers 배열의 길이를 studentsCount로 설정
        };
      })
    );
  }

  async findAllPtUsers(userId: number): Promise<UserPayload[]> {
    const trainer = await this.trainerRepository.findOne(
      {
        where: {userId},
        relations: ['ptUsers'],
   
      }
    );
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }

    return trainer.ptUsers.map(user => ({
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

  async delete(payload: AuthPayload, userId: number): Promise<void> {
    const trainer = await this.findById(userId);
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }
    
    if (payload.userId === trainer.id) {
      throw new ConflictException('자신의 권한은 삭제할 수 없습니다');
    }

    await this.trainerRepository.remove(trainer);
    await this.userRepository.update({id: userId}, {role: RoleType.USER});
  }

  async deleteUser(trainerId: number, userId: number): Promise<void> {
    if(trainerId === userId) {
      throw new ConflictException('자신의 권한은 삭제할 수 없습니다');
    }

    const trainer = await this.findById(trainerId);
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (!user.ptTrainer) {
      throw new ConflictException('담당하지 않는 회원');
    }

    await this.userRepository.update(user.id, {ptTrainer: null});
  }

  async findById(userId: number): Promise<Trainer> {
    return await this.trainerRepository.findOne({where: {userId}});
  }
}
