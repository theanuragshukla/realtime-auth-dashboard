import { SessionsEntity } from "../../databases/postgres/entity/sessions.entity";

declare global {
  namespace Express {
    interface Request {
      user: SessionsEntity;
      uid?: string;
      deviceId: string;
    }
  }
}
