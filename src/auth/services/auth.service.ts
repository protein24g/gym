import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { TokenService } from './token.service';
import { UserCreateDto } from 'src/auth/dto/user-create.dto';
import { AuthUserCreateDto } from 'src/auth/dto/auth-user-create.dto';
import { AuthPayload } from '../interfaces/auth-payload.interface';
import { ProfileService } from 'src/file/services/profile-file.service';
import { OAuthType } from '../enums/oauth-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly profileService: ProfileService,
  ) {}

  async validateUser(userId: string, password: string): Promise<AuthPayload> {
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

  async signUp(
    createDto: UserCreateDto | AuthUserCreateDto, file: Express.Multer.File, provider?: OAuthType): Promise<AuthPayload> {
    const userId = await this.userService.findByUserId(createDto.userId);
    if (userId) {
      throw new ConflictException('이미 존재하는 아이디');
    }
    
    const telNumber = await this.userService.findByTelNumber(createDto.telNumber);
    if (createDto.telNumber && telNumber) {
      throw new ConflictException('이미 존재하는 휴대폰 번호');
    }

    const user = this.userRepository.create({
      ...createDto,
      createdAt: Date(),
      provider: provider ? provider : OAuthType.LOCAL,
    });
    await this.userRepository.save(user);

    if (file) {
      await this.profileService.create(user.userId, file);
    }

    return {
      userId: user.userId,
      role: user.role,
    };
  }

  async signIn(payload: AuthPayload): Promise<{accessToken: string, refreshToken: string}> {
    const accessToken = this.tokenService.createAccessToken(payload);
    const refreshToken = this.tokenService.createRefreshToken(payload);

    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userRepository.update(payload.userId, { hashRefreshToken });

    return { accessToken, refreshToken };
  }

  async signOut(payload: AuthPayload, refreshToken: string) {
    const user = await this.tokenService.checkRefreshToken(payload.userId, refreshToken);

    await this.userRepository.update(user.userId, { hashRefreshToken: null });
  }

  async refreshToken(payload: AuthPayload, refreshToken: string): Promise<{accessToken: string, refreshToken: string}> {
    const user = await this.tokenService.checkRefreshToken(payload.userId, refreshToken);

    const newAccessToken = this.tokenService.createAccessToken({
      userId: user.userId,
      role: user.role,
    });
    const newRefreshToken = this.tokenService.createRefreshToken({
      userId: user.userId,
      role: user.role,
    });

    const hashRefreshToken = await argon2.hash(newRefreshToken);
    await this.userRepository.update(user.userId, { hashRefreshToken });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}