import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(userId: string, password: string) {
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new UnauthorizedException('아이디 또는 패스워드 오류');
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('아이디 또는 패스워드 오류');
    }

    return {
      userId: user.userId,
      role: user.role,
    };
  }

  async login(payload: any) {
    const accessToken = this.tokenService.createAccessToken(payload);
    const refreshToken = this.tokenService.createRefreshToken(payload);

    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userRepository.update(payload.userId, { hashRefreshToken });

    return { accessToken, refreshToken };
  }

  async logout(request: any) {
    const user = await this.tokenService.checkRefreshToken(request.user.userId, request.cookies['refreshToken']);

    await this.userRepository.update(user.userId, { hashRefreshToken: null });
  }

  async refreshToken(request: any) {
    const user = await this.tokenService.checkRefreshToken(request.user.userId, request.cookies['refreshToken']);

    const accessToken = this.tokenService.createAccessToken({ userId: user.userId });
    const refreshToken = this.tokenService.createRefreshToken({ userId: user.userId });

    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userRepository.update(user.userId, { hashRefreshToken });

    return { accessToken, refreshToken };
  }
}