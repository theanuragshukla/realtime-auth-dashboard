export interface IUserSessions {
  id: number;
  uid: string;
  seeds: string[];
}

export interface ISession {
  id: number;
  seed: string;
  device_details: string,
  last_active: Date;
  status: boolean;
  failed_attempts: number;
}
