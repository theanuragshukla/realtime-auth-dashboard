import { getClient } from "../../client";
import { reqModal } from "../auth";

export const getRecentDevices = (page:Number) => {
  return reqModal(() => getClient().get("/account/recent-devices", { params: { page } } ));
};

export const getRecentActivities = (page:Number = 1) => {
  return reqModal(() => getClient().get("/account/recent-activities", { params: { page } } ));
};

export const logoutDevice = (id:string) => {
  return reqModal(() => getClient().get(`/account/logout-device/${id}`));
};

export const getDeviceDetail = (id:string) => {
  return reqModal(() => getClient().get(`/account/device/${id}`));
  }
