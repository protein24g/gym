import { RoleType } from "../roles/enums/role.type";

export interface AuthPayload {
  userId: string;
  role: RoleType;
}