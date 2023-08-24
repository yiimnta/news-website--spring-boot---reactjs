import { IROLES } from "./Define";

export const ROLES: IROLES = {
  ROLE_MOD: "MOD",
  ROLE_MEMBER: "MEMBER",
  ROLE_ADMIN: "ADMIN",
};

export const USER_STATUS = {
  ACTIVE: 0, // active
  INACTIVE: 1, // inactive when the user has't actived their email yet
  BLOCK: 2,
};

export const USER_GENDER = {
  MALE: "M",
  FEMALE: "F",
  NEUTRAL: "N",
};

export const DEFAULT_USER_AVATAR =
  "https://firebasestorage.googleapis.com/v0/b/news-ae8fb.appspot.com/o/default-avatar.jpg?alt=media&token=272fa245-a638-4896-8d74-a6d2b44256cb";
