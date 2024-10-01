import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req) => {
        const token = req.cookies['refreshToken'];
        if (!token) {
          throw new UnauthorizedException('리프레시 토큰 누락');
        }
        
        return token;
      },
      secretOrKey: process.env.REFRESH_JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByUserId(payload.userId);
    if (!user) {
      throw new UnauthorizedException('비정상 리프레시 토큰');
    }
    return { userId: user.userId };
  }
}