import { ROLE } from "../../../constants";

 export default interface IUser {
  id: number;
  uid: string;
  name: string;
  role: ROLE;
  email: string;
  password: string;
  twofactor: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
