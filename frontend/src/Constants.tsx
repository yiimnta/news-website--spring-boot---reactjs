export interface IROLES {
  [key: string]: string;
}

export const ROLES: IROLES = {
  ROLE_MOD: "MOD",
  ROLE_MEMBER: "MEMBER",
  ROLE_ADMIN: "ADMIN",
};

export type Role = {
  id?: number;
  name: string;
  color: string;
};

export type User = {
  id?: string;
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  avatar: string;
  roles: Role[];
  status: string;
};

export type AuthUser = {
  firstname: string;
  lastname: string;
  email: string;
  roles: Role[];
  accessToken: string;
  avatar: string;
};
