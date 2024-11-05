import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { AuthPayload } from "../interfaces/auth-payload.interface";
import { UserService } from "src/member/user/user.service";
import { User } from "src/member/user/entities/user.entity";
import { OAuthPayload } from "../interfaces/oauth-payload.interface";

@Injectable()
export class TokenService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createOAuthAccessToken(payload: OAuthPayload): string {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get<string>('KAKAO_JWT_SECRET'),
        expiresIn: this.configService.get<string>('KAKAO_JWT_EXPIRE_IN'),
      },
    );
  }

  createAccessToken(payload: AuthPayload): string {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRE_IN'),
      },
    );
  }

  createRefreshToken(payload: AuthPayload): string {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_JWT_EXPIRE_IN'),
      },
    );
  }

  async checkRefreshToken(userId: number, refreshToken: string): Promise<User> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('유효하지 않은 사용자');
    }

    if (user.hashRefreshToken === null || !(await argon2.verify(user.hashRefreshToken, refreshToken))) {
      throw new UnauthorizedException('비정상 리프레시 토큰');
    }

    return user;
  }

  checkOAuthAccessToken(accessToken: string): void {
    if (!accessToken) {
      throw new UnauthorizedException('잘못된 토큰입니다');
    }

    try {
      this.jwtService.verify(accessToken, {secret: this.configService.get<string>('KAKAO_JWT_SECRET')});
    } catch (error) {
      throw new UnauthorizedException('잘못된 토큰입니다');
    }
  }
}