import { Socket } from "socket.io-client";

export type DeviceDetails = {
  isCurrent: boolean;
  seed: string;
  last_active: string;
  device_details: {
    ipAddress?: string;
    countryName?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    cityLatLong?: string;
    browser?: string;
    browserVersion?: string;
    deviceBrand?: string;
    deviceModel?: string;
    deviceFamily?: string;
    os?: string;
    osVersion?: string;
  };
  status: boolean;
};

export enum ACTIVITY_TYPE {
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  REGISTER = "register",
  TFA_INIT = "2fa_init",
  TFA_VERIFIED = "2fa_verified",
  TFA_FAILED = "2fa_failed",
}
export type Log = {
  action: ACTIVITY_TYPE;
  timestamp: string;
  seed: string;
};

export type RTM = {
  status: boolean;
  socket?: Socket;
};
