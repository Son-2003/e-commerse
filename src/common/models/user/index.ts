import { EntityStatus } from "common/enums/EntityStatus";
import { RoleType } from "common/enums/RoleType";

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  status: EntityStatus;
  role: RoleType;
  image: string;
}