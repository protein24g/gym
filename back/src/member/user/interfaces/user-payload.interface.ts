import { RoleType } from "src/auth/roles/enums/role.type.enum";

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  telNumber: string;
  birth: string;
  address: string;
  addressDetail: string;
  createAt: Date;
  role: RoleType;
}