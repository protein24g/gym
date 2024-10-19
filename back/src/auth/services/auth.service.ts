import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDTO } from 'src/auth/dto/signup.dto';
import { AuthPayload } from '../interfaces/auth-payload.interface';
import { ProfileService } from 'src/file/services/profile-file.service';
import { OAuthType } from '../enums/oauth-type.enum';
import { TokenPayload } from '../interfaces/token-payload.interface';
import axios from 'axios';
import { SignInDTO } from '../dto/signin.dto';
import { OAuthSignUpDTO } from '../dto/oauth-signup.dto';
import { User } from 'src/member/user/entities/user.entity';
import { UserService } from 'src/member/user/user.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly profileService: ProfileService,
  ) {}

  async validateUser(signInDTO: SignInDTO): Promise<{
    user: AuthPayload,
    resetPassword: boolean,
  }> {
    const user = await this.userRepository.findOne({where: {email: signInDTO.email}});
    if (!user || !user.password) {
      throw new UnauthorizedException('아이디 또는 패스워드 오류');
    }

    const isValid = await argon2.verify(user.password, signInDTO.password);
    if (!isValid) {
      throw new UnauthorizedException('아이디 또는 패스워드 오류');
    }

    return {
      user: {
        userId: user.id,
        role: user.role,
      },
      resetPassword: await argon2.verify(user.password, user.birth)
    };
  }

  async signUp(signUpDTO: SignUpDTO, file: Express.Multer.File): Promise<AuthPayload> {
    const telNumber = await this.userService.findByTelNumber(signUpDTO.telNumber);
    if (telNumber) {
      throw new ConflictException('이미 존재하는 휴대폰 번호');
    }
    
    const user = this.userRepository.create({
      ...signUpDTO,
      createdAt: Date(),
      // 사장 수동 생성
      // role: RoleType.OWNER,
      // password: 'testpw',
    });
    await this.userRepository.save(user);

    if (file) {
      await this.profileService.create(user.id, file);
    }

    return {
      userId: user.id,
      role: user.role,
    };
  }

  async oAuthSignUp(signUpDTO: OAuthSignUpDTO, provider: OAuthType): Promise<AuthPayload> {
    const oAuthId = await this.userService.findByOAuthId(signUpDTO.oAuthId);
    if (oAuthId) {
      throw new ConflictException('이미 존재하는 OAuth 계정');
    }
    
    const user = await this.userRepository.save({
      ...signUpDTO,
      createdAt: Date(),
      provider: provider ? provider : OAuthType.LOCAL,
    });

    return {
      userId: user.id,
      role: user.role,
    };
  }

  async signIn(payload: AuthPayload): Promise<TokenPayload> {
    const accessToken = this.tokenService.createAccessToken(payload);
    const refreshToken = this.tokenService.createRefreshToken(payload);

    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userRepository.update(payload.userId, { hashRefreshToken });

    return { accessToken, refreshToken };
  }

  async signOut(payload: AuthPayload, kakaoAccessToken: string, refreshToken: string) {
    const user = await this.tokenService.checkRefreshToken(payload.userId, refreshToken);

    if (user.provider === OAuthType.KAKAO) {
      await axios.post('https://kapi.kakao.com/v1/user/logout', null,
        {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`
          }
        }
      );
    }

    await this.userRepository.update(user.id, { hashRefreshToken: null });
  }

  async refreshToken(payload: AuthPayload, refreshToken: string): Promise<TokenPayload> {
    const user = await this.tokenService.checkRefreshToken(payload.userId, refreshToken);

    const newAccessToken = this.tokenService.createAccessToken({
      userId: user.id,
      role: user.role,
    });
    const newRefreshToken = this.tokenService.createRefreshToken({
      userId: user.id,
      role: user.role,
    });

    const hashRefreshToken = await argon2.hash(newRefreshToken);
    await this.userRepository.update(user.id, { hashRefreshToken });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}