export const TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days
export const SALT_ROUNDS = 10;
export const EVENT_CHANNEL = "events";

export enum ROLE {
  USER = "user",
  ADMIN = "admin",
}

export enum ACTIVITY_TYPE {
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  REGISTER = "register",
  TFA_INIT = "2fa_init",
  TFA_VERIFIED = "2fa_verified",
  TFA_FAILED = "2fa_failed",
}

export type JWT_PAYLOAD = {
  uid: string;
  role: ROLE;
  seed: string;
};
