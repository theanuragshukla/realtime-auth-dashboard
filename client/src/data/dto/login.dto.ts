export type LoginDto = {
  email: string;
  password: string;
  device_details: Object;
};

export type SignUpDto = {
  email: string;
  password: string;
  name: string;
  twofactor: boolean;
  device_details: Object;
};

export type APIData = {
  status: boolean;
  msg: string;
  data?: Object | Array<any>;
  redirect?: string;
};

export type VerifyDto = {
  id: string;
  otp: string;
};
