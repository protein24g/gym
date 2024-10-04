import { CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!(user && user.role && roles.includes(user.role))) {
      throw new ForbiddenException('권한이 없습니다');
    }

    if (user.userId === request.body.userId) {
      throw new ConflictException('자신의 권한은 변경할 수 없습니다');
    }

    return true;
  }
}