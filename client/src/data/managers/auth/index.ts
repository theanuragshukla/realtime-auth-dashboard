import { APIData, LoginDto, SignUpDto, VerifyDto } from "@/data/dto/login.dto";
import { getClient } from "../../client";

export const reqModal = async (func: Function) => {
  try {
    const {
      status,
      data,
    }: {
      status: number;
      data: any;
    } = await func();
    if (status <= 499 && status >= 200) {
      return data as APIData;
    } else {
      return {
        status: false,
        msg: `request failed with code ${status}`,
      } as APIData;
    }
  } catch (e) {
    return {
      status: false,
      msg: "Something Unexpected happened",
    } as APIData;
  }
};

export const signup = (values: SignUpDto) => {
  return reqModal(() => getClient().post("/auth/register", values));
};

export const login = (values: LoginDto) => {
  return reqModal(() => getClient().post("/auth/login", values));
};

export const verifyOtp = (values: VerifyDto) => {
  return reqModal(() => getClient().post("/auth/verify", values));
};

export const logout = () => {
  return reqModal(() => getClient().get("/auth/logout"));
};
