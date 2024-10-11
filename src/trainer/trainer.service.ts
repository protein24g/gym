import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { Repository } from 'typeorm';
import { RoleType } from 'src/auth/roles/enums/role.type.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import * as argon2 from "argon2";
import { AuthPayload } from 'src/auth/interfaces/auth-payload.interface';

@Injectable()
export class TrainerService {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async create(payload: AuthPayload, email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    const trainer = await this.trainerRepository.findOne({where: {userId: user.id}});
    if (trainer) {
      throw new ConflictException('이미 등록된 트레이너');
    }

    await this.trainerRepository.save({
      userId: user.id,
      user
    });

    if (payload.userId !== user.id) {
      await this.userRepository.update({id: user.id}, {role: RoleType.TRAINER, password: await argon2.hash(user.birth)});
    }
  }

  async createUser(trainerId: number, telNumber: string): Promise<void> {
    const trainer = await this.trainerRepository.findOne({where: {userId: trainerId}});
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }

    const user = await this.userService.findUserByTelNumberWithPtTrainer(telNumber);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if(trainer.userId === user.id) {
      throw new ForbiddenException('자기 자신은 추가할 수 없습니다');
    }

    if (!!user.ptTrainer) {
      throw new ConflictException('이미 담당하고 있는 회원');
    }

    await this.userRepository.update(user.id, {
      ptTrainer: trainer,
    });
  }

  async findAll(userId: number): Promise<User[]> {
    const trainer = await this.trainerRepository.findOne(
      {
        where: {userId},
        relations: ['ptUsers'],
        select: {
          ptUsers: {
            id: true,
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

  async delete(userId: number): Promise<void> {
    const trainer = await this.trainerRepository.findOne({where: {userId}});
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }
    
    await this.trainerRepository.remove(trainer);
    await this.userRepository.update({id: userId}, {role: RoleType.USER});
  }

  async deleteUser(trainerId: number, userId: number): Promise<void> {
    if(trainerId === userId) {
      throw new ConflictException('자기 자신은 삭제할 수 없습니다');
    }

    const trainer = await this.trainerRepository.findOne({where: {userId: trainerId}});
    if (!trainer) {
      throw new NotFoundException('존재하지 않는 트레이너');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (!user.ptTrainer) {
      throw new ConflictException('이미 담당하지 않는 회원');
    }

    await this.userRepository.update(user.id, {ptTrainer: null});
  }
}
