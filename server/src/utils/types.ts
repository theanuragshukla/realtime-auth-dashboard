import { ACTIVITY_TYPE } from "../constants";
import { UserEntity } from "../databases/postgres/entity/user.entity";
import { ISession } from "../databases/postgres/model/sessions.model";
export interface UserSession extends ISession {
  role?: string;
}

export type CreateMail = {
  to: string;
  user: UserEntity, 
  action: ACTIVITY_TYPE;
};
