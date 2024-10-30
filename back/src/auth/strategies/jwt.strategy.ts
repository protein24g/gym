import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AuthPayload } from "../interfaces/auth-payload.interface";
import { Request } from "express";
import { UserService } from "src/member/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.cookies['accessToken'];
        if (!token) {
          throw new UnauthorizedException('로그인 후 이용하세요');
        }
        
        return token;
      },
      secretOrKey: process.env.JWT_SECRET,
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