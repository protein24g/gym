import { ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { RoleType } from "../enums/role.type.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthPayload } from "src/auth/interfaces/auth-payload.interface";
import { UserService } from "src/member/user/user.service";
import { User } from "src/member/user/entities/user.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async update(payload: AuthPayload): Promise<void> {
    const user = await this.userService.findById(payload.userId);

    if (user.role === RoleType.OWNER || RoleType.OWNER === payload.role) {
      throw new ForbiddenException('상위 권한을 수정하거나 부여할 수 없습니다');
    }

    if (payload.role === RoleType.MANAGER && await this.userService.isManagerExists()) {
      throw new ConflictException('이미 매니저가 존재합니다');
    }

    if (user.role === payload.role) {
      throw new ConflictException('이미 권한이 부여된 유저입니다');
    }

    await this.userRepository.save({
      ...user,
      role: payload.role,
    });
  }
}