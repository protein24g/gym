import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/roles/guards/role.guard';
import { RoleType } from 'src/auth/roles/enums/role.type';
import { Roles } from 'src/auth/roles/decorators/role.decorator';

@Controller('api/trainers')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class TrainerController {
  constructor(
    private readonly trainerService: TrainerService
  ) {}

  @Post()
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  async create(@Body() body: {userId: string}) {
    await this.trainerService.create(body.userId);
  }

  @Post('users')
  @Roles(RoleType.TRAINER)
  async createUser(@Req() request: any, @Body() body: {userId: string}) {
    return await this.trainerService.createUser(request.user.userId, body.userId);
  }

  @Get('users')
  @Roles(RoleType.TRAINER)
  async findAll(@Req() request: any) {
    return await this.trainerService.findAll(request.user.userId);
  }
  
  @Delete()
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  async delete(@Body() body: {userId: string}) {
    await this.trainerService.delete(body.userId);
  }

  @Delete('users')
  @Roles(RoleType.TRAINER)
  async deleteUser(@Req() request: any, @Body() body: {userId: string}) {
    return await this.trainerService.deleteUser(request.user.userId, body.userId);
  }
}
