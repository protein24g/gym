import { RoleType } from "src/auth/roles/enums/role.type.enum";

export interface UserPayload {
  id: number;
  email: string | null;
  name: string;
  telNumber: string;
  birth: string;
  createAt: Date;
  role: RoleType;
}