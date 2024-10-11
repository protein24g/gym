import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { AuthPayload } from "../interfaces/auth-payload.interface";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.cookies['refreshToken'];
        if (!token) {
          throw new UnauthorizedException('리프레시 토큰 누락');
        }
        
        return token;
      },
      secretOrKey: process.env.REFRESH_JWT_SECRET,
    });
  }

  async validate(payload: AuthPayload): Promise<AuthPayload> {
    const user = await this.userService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저');
    }

    return {
      userId: user.id,
      role: user.role,
    };
  }
}