import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { IUserSessions } from "../model/sessions.model";
import { UserEntity } from "./user.entity";

@Entity("user_sessions")
export class UserSessionsEntity implements IUserSessions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16, unique: true })
  @OneToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "uid" })
  uid: string;

  @Column({
    type: "simple-array",
    default: [],
  })
  seeds: string[];
}
