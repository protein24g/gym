import { RoleType } from "src/auth/roles/enums/role.type.enum";

export interface MyPageInfo {
  id: number;
  email: string;
  name: string;
  telNumber: string;
  birth: string;
  createAt: Date;
  role: RoleType;
  branchName: string | null;
  ptTrainerId?: number;
  profileImageUrl?: string | null;
}