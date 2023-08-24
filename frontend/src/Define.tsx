export interface IROLES {
  [key: string]: string;
}

export type Role = {
  id?: number;
  name: string;
  color: string;
};

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  avatar: string;
  roles: Role[];
  status: number;
  gender: string;
  name?: string;
};

export type AuthUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  roles: Role[];
  accessToken: string;
  avatar: string;
};

export type DeleteIds = {
  ids: number[];
};
