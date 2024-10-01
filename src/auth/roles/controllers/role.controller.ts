import { Body, Controller, Patch, UseGuards } from "@nestjs/common";
import { RoleType } from "../enums/role.type";
import { AuthGuard } from "@nestjs/passport";
import { RoleService } from "../services/role.service";
import { Roles } from "../decorators/role.decorator";
import { RoleGuard } from "../guards/role.guard";

@Controller('api/auth/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Patch()
  @Roles(RoleType.OWNER, RoleType.MANAGER)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  async update(@Body() body: { userId: string, role: RoleType }) {
    return await this.roleService.update(body.userId, body.role);
  }
}