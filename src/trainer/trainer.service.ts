import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { Repository } from 'typeorm';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TrainerService {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string): Promise<void> {
    const trainer = await this.trainerRepository.findOne({where: {userId}});
    if (trainer) {
      throw new ConflictException('이미 등록된 트레이너');
    }

    const user = await this.userRepository.findOne({where: {userId}});
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    await this.trainerRepository.save({
      userId,
      user
    });

    await this.userRepository.update({userId}, {role: RoleType.TRAINER});
  }

  async createUser(trainerId: string, userId: string): Promise<void> {
    if(trainerId === userId) {
      throw new ForbiddenException('자기 자신은 추가할 수 없습니다');
    }

    const trainer = await this.trainerRepository.findOne({where: {userId: trainerId}});
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }

    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (!!user.ptTrainer) {
      throw new ConflictException('이미 담당하고 있는 회원');
    }

    await this.userRepository.update(user.userId, {
      ptTrainer: trainer,
    });
  }

  async findAll(userId: string): Promise<User[]> {
    const trainer = await this.trainerRepository.findOne(
      {
        where: {userId},
        relations: ['ptUsers'],
        select: {
          ptUsers: {
            userId: true,
            name: true,
            telNumber: true,
            address: true,
            addressDetail: true,
          }
        }
      }
    );
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }

    return trainer.ptUsers;
  }

  async delete(userId: string): Promise<void> {
    const trainer = await this.trainerRepository.findOne({where: {userId}});
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }
    
    await this.trainerRepository.remove(trainer);
    await this.userRepository.update({userId}, {role: RoleType.USER});
  }

  async deleteUser(trainerId:string, userId: string): Promise<void> {
    if(trainerId === userId) {
      throw new ConflictException('자기 자신은 삭제할 수 없습니다');
    }

    const trainer = await this.trainerRepository.findOne({where: {userId: trainerId}});
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }

    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (!user.ptTrainer) {
      throw new ConflictException('이미 담당하지 않는 회원');
    }

    await this.userRepository.update(user.userId, {ptTrainer: null});
  }
}
