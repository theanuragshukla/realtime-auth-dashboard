import { UserEntity } from "./databases/postgres/entity/user.entity";

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

export const MAIL_SUBJECTS = (key: ACTIVITY_TYPE) => {
  switch (key) {
    case ACTIVITY_TYPE.LOGIN_SUCCESS:
      return "Login Successful";
    case ACTIVITY_TYPE.LOGIN_FAILED:
      return "Login Attempt Failed";
    case ACTIVITY_TYPE.LOGOUT:
      return "Logout Detected";
    case ACTIVITY_TYPE.REGISTER:
      return "Account Registration Successful";
    default:
      return "Activity Detected";
  }
};

export const MAIL_TEMPLATES = (key: ACTIVITY_TYPE, user: UserEntity) => {
  switch (key) {
    case ACTIVITY_TYPE.LOGIN_SUCCESS:
      return `
        <div style="text-align: center;">
          <h1>Login Successful</h1>
        </div>
        <p>Dear ${user.name},</p>
        <p>We are pleased to inform you that a successful login was detected on your account.</p>
        <p>If this activity wasn't authorized by you, please contact us immediately.</p>
      `;
    case ACTIVITY_TYPE.LOGIN_FAILED:
      return `
        <div style="text-align: center;">
          <h1>Login Attempt Failed</h1>
        </div>
        <p>Dear ${user.name},</p>
        <p>We regret to inform you that a failed login attempt was detected on your account.</p>
        <p>If you did not attempt this login, please secure your account and contact us.</p>
      `;
    case ACTIVITY_TYPE.LOGOUT:
      return `
        <div style="text-align: center;">
          <h1>Logout Detected</h1>
        </div>
        <p>Dear ${user.name},</p>
        <p>We want to notify you that a logout was detected on your account.</p>
        <p>If you did not initiate this logout, please review your account activity.</p>
      `;
    case ACTIVITY_TYPE.REGISTER:
      return `
        <div style="text-align: center;">
          <h1>Account Registration Successful</h1>
        </div>
        <p>Dear ${user.name},</p>
        <p>Congratulations! Your account registration was successful.</p>
        <p>Welcome to our community!</p>
      `;
    default:
      return "";
  }
};
