import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { UserService } from "src/user/user.service";

@Injectable()
export class TokenService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(payload: any) {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRE_IN'),
      },
    );
  }

  createRefreshToken(payload: any) {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_JWT_EXPIRE_IN'),
      },
    );
  }

  async checkRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException('유효하지 않은 사용자');
    }

    if (user.hashRefreshToken === null) {
      throw new UnauthorizedException('로그아웃 된 사용자');
    }

    const isValid = await argon2.verify(user.hashRefreshToken, refreshToken);
    if (!isValid) {
        throw new UnauthorizedException('비정상 리프레시 토큰');
    }

    return user;
  }
}