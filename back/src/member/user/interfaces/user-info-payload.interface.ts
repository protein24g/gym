import { RoleType } from "src/auth/roles/enums/role.type.enum";

export interface UserInfoPayload {
  id: number;
  email: string | null;
  name: string;
  telNumber: string;
  birth: string;
  createAt: Date;
  role: RoleType;
  branchId: number;
  branchName: string;
  profileImageUrl: string | null;
}