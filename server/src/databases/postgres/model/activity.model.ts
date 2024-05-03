import { ACTIVITY_TYPE } from "../../../constants";

export default interface IActivity {
  id: number;
  uid: string;
  seed: string;
  action: ACTIVITY_TYPE;
  timestamp: Date;
}
