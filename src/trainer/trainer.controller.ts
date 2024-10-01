import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/roles/guards/role.guard';
import { RoleType } from 'src/auth/roles/enums/role.type';
import { Roles } from 'src/auth/roles/decorators/role.decorator';

@Controller('api/trainers')
export class TrainerController {
  constructor(
    private readonly trainerService: TrainerService
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  async create(@Body() body: {userId: string}) {
    await this.trainerService.create(body.userId);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  async delete(@Body() body: {userId: string}) {
    await this.trainerService.delete(body.userId);
  }
}
