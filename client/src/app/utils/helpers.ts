import { ACTIVITY_TYPE } from "./types";

export const reduceIpv6 = (ip: string) => {
  if (!ip.includes(":")) return ip;
  return ip.substr(0, 9) + "..." + ip.substr(ip.length - 9, 9);
};

export const pick = (obj: any, keys: string[]) => {
  const ret: {
    [key: string]: string;
  } = {};
  return keys.reduce((acc, key) => {
    if (obj && obj[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, ret);
};

export const camelToTitle = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

export const parseDate = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")} ${d
    .getDate()
    .toString()
    .padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

export const getMessageFromAction = (action: ACTIVITY_TYPE) => {
  switch (action) {
    case ACTIVITY_TYPE.LOGIN_SUCCESS:
      return "Login successful";
    case ACTIVITY_TYPE.LOGIN_FAILED:
      return "Login failed";
    case ACTIVITY_TYPE.LOGOUT:
      return "Logged out";
    case ACTIVITY_TYPE.REGISTER:
      return "Registered";
    case ACTIVITY_TYPE.TFA_INIT:
      return "2FA initiated";
    case ACTIVITY_TYPE.TFA_VERIFIED:
      return "2FA verified";
    case ACTIVITY_TYPE.TFA_FAILED:
      return "2FA failed";
    default:
      return "Unknown activity";
  }
};

export const getColorFromAction = (action: ACTIVITY_TYPE) => {
  switch (action) {
    case ACTIVITY_TYPE.LOGIN_SUCCESS:
      return "green";
    case ACTIVITY_TYPE.LOGIN_FAILED:
      return "red";
    case ACTIVITY_TYPE.LOGOUT:
      return "blue";
    case ACTIVITY_TYPE.REGISTER:
      return "purple";
    case ACTIVITY_TYPE.TFA_INIT:
      return "yellow";
    case ACTIVITY_TYPE.TFA_VERIFIED:
      return "green";
    case ACTIVITY_TYPE.TFA_FAILED:
      return "red";
    default:
      return "gray";
  }
};
