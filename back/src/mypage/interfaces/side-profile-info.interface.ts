import { RoleType } from "src/auth/roles/enums/role.type.enum";

export interface SideProfileInfo {
  name: string;
  role: RoleType;
  branchName: string;
  profileImageUrl?: string | null;
}