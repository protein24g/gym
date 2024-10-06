import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RoleType } from "../enums/role.type";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async update(userId: string, role: RoleType) {
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저');
    }

    if (user.role === RoleType.OWNER || RoleType.OWNER === role) {
      throw new ForbiddenException('상위 권한을 수정하거나 부여할 수 없습니다');
    }

    if (role === RoleType.MANAGER && await this.userService.isManagerExists()) {
      throw new ConflictException('이미 매니저가 존재합니다');
    }

    if (user.role === role) {
      throw new ConflictException('이미 권한이 부여된 유저입니다');
    }

    await this.userRepository.save({
      ...user,
      role,
    });
  }
}