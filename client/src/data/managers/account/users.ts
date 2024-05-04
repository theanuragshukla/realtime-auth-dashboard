import { getClient } from "@/data/client";
import { reqModal } from "../auth";

export const getAllUsers = (page?: number) => {
  return reqModal(() => getClient().get("/users/all", { params: { page } }));
};

export const getUserByUid = (uid: string) => {
  return reqModal(() => getClient().get(`/users/${uid}`));
};

export const deleteUserByUid = (uid: string) => {
  return reqModal(() => getClient().delete(`/users/${uid}`));
};
