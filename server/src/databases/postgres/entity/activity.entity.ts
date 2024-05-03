import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import IActivity from "../model/activity.model";
import { ACTIVITY_TYPE } from "../../../constants";
import { UserEntity } from "./user.entity";

@Entity("activities")
export class ActivityEntity implements IActivity {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ length: 16 })
  @ManyToOne(() => UserEntity, (user) => user.uid, { onDelete: "CASCADE" })
  uid: string;
  @Column({ length: 16 })
  seed: string;
  @Column({ length: 16, enum: ACTIVITY_TYPE })
  action: ACTIVITY_TYPE;
  @Column({default: new Date() })
  timestamp: Date;
}
