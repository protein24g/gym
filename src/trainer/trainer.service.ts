import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { Repository } from 'typeorm';
import { RoleType } from 'src/auth/roles/enums/role.type';
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

  async create(userId: string) {
    const trainer = await this.trainerRepository.findOne({where: {userId}});
    if (trainer) {
      throw new NotFoundException('이미 등록된 트레이너');
    }

    const savedTrainer = await this.trainerRepository.save({
      userId
    });

    await this.userRepository.update({userId}, {
      role: RoleType.TRAINER,
      trainer: savedTrainer,
    })
  }

  async createUser(trainerId: string, userId: string) {
    if(trainerId === userId) {
      throw new UnauthorizedException('자기 자신은 추가할 수 없습니다');
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
      throw new UnauthorizedException('이미 담당하고 있는 회원');
    }

    await this.userRepository.update(user.userId, {
      ptTrainer: trainer,
    });

    return {
      trainerId: trainer.userId,
      userId: user.userId,
    }
  }

  async findAll(userId: string) {
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

  async delete(userId: string) {
    const trainer = await this.trainerRepository.findOne({where: {userId}});
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }
    
    await this.trainerRepository.remove(trainer);
    await this.userRepository.update({userId}, {role: RoleType.USER});
  }

  async deleteUser(trainerId:string, userId: string) {
    if(trainerId === userId) {
      throw new UnauthorizedException('자기 자신은 삭제할 수 없습니다');
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
      throw new UnauthorizedException('이미 담당하지 않는 회원');
    }

    await this.userRepository.update(user.userId, {ptTrainer: null});

    return {
      trainerId: trainer.userId,
      userId: user.userId,
    }
  }
}
