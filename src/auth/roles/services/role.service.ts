import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
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

  async update(loginId: string, role: RoleType) {
    const user = await this.userService.findByUserId(loginId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저');
    }

    if (user.role === RoleType.OWNER || RoleType.OWNER === role) {
      throw new UnauthorizedException('상위 권한을 수정하거나 부여할 수 없습니다');
    }

    if (role === RoleType.MANAGER && await this.userService.isManagerExists()) {
      throw new UnauthorizedException('이미 매니저가 존재합니다');
    }

    user.role = role;
    await this.userRepository.save(user);
  }
}