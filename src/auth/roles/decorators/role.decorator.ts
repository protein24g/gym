import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { RoleType } from "../enums/role.type";

export const Roles = (...roles: RoleType[]): CustomDecorator => SetMetadata('roles', roles);