import { EntityStatus } from "common/enums/EntityStatus";
import { RoleType } from "common/enums/RoleType";

export interface UserResponse {
  id: number,
  fullName: string;
  email: string;
  address: string;
  phone: string;
  status: EntityStatus;
  role: RoleType;
  image: string;
}

export interface UserRequest {
  id: number;
  fullName: string;
  email: string;
  address: string;
  phone: string;
  status: EntityStatus;
  image: string;
}