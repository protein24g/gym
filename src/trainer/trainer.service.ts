import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from './entities/trainer.entity';
import { Repository } from 'typeorm';
import { RoleService } from 'src/auth/roles/services/role.service';
import { RoleType } from 'src/auth/roles/enums/role.type';

@Injectable()
export class TrainerService {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
    private readonly roleService: RoleService,
  ) {}

  async create(userId: string) {
    const user = await this.roleService.update(userId, RoleType.TRAINER);

    await this.trainerRepository.save({
      user,
    });
  }

  async delete(userId: string) {
    const user = await this.roleService.update(userId, RoleType.USER);

    const trainer = await this.trainerRepository.findOne({where: {user}});
    await this.trainerRepository.remove(trainer);
  }
}
