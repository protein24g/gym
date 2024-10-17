import { RoleType } from "../roles/enums/role.type.enum";

export interface AuthPayload {
  userId: number;
  role: RoleType;
}