import { getClient } from "../../client";
import { reqModal } from "../auth";

export const getRecentDevices = ({
  page,
  uid,
}: {
  page?: number;
  uid?: string;
}) => {
  return reqModal(() =>
    getClient().get(`/account/recent-devices?forUid=${uid || ""}`, {
      params: { page: page || 1 },
    })
  );
};

export const getAllActivities = ({ page }: { page?: number }) => {
  return reqModal(() =>
    getClient().get(`/account/all-activities`, {
      params: { page: page || 1 },
    })
  );
};
export const getRecentActivities = ({
  page,
  uid,
}: {
  page?: number;
  uid?: string;
}) => {
  return reqModal(() =>
    getClient().get(`/account/recent-activities?forUid=${uid || ""}`, {
      params: { page: page || 1 },
    })
  );
};

export const logoutDevice = ({ id, uid }: { id: string; uid?: string }) => {
  return reqModal(() =>
    getClient().get(`/account/logout-device/${id}?forUid=${uid || ""}`)
  );
};

export const getDeviceDetail = ({ id, uid }: { id: string; uid?: string }) => {
  return reqModal(() =>
    getClient().get(`/account/device/${id}?forUid=${uid || ""}`)
  );
};

export const upgradeAccount = () => {
  return reqModal(() => getClient().get(`/account/upgrade`));
};
