import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from './token.service';
import { UserCreateDto } from 'src/user/dto/user-create.dto';

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

  async signUp(userCreateDto: UserCreateDto) {
    const userId = await this.userService.findByUserId(userCreateDto.userId);
    if (userId) {
      throw new ConflictException('이미 존재하는 아이디');
    }
    
    const telNumber = await this.userService.findByTelNumber(userCreateDto.telNumber);
    if (telNumber) {
      throw new ConflictException('이미 존재하는 휴대폰 번호');
    }
    
    const user = this.userRepository.create({
      ...userCreateDto,
      createdAt: Date(),
    });
    await this.userRepository.save(user);

    return {
      userId: user.userId,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  async signIn(payload: any) {
    const accessToken = this.tokenService.createAccessToken(payload);
    const refreshToken = this.tokenService.createRefreshToken(payload);

    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userRepository.update(payload.userId, { hashRefreshToken });

    return { accessToken, refreshToken };
  }

  async signOut(request: any) {
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