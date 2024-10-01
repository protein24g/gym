import { SetMetadata } from "@nestjs/common";
import { RoleType } from "../enums/role.type";

export const Roles = (...roles: RoleType[]): any => SetMetadata('roles', roles);