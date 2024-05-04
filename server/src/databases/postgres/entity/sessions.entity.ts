import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ISession } from "../model/sessions.model";
import { UserSessionsEntity } from "./userSessions.entity";
import { UserEntity } from "./user.entity";

@Entity("sessions")
export class SessionsEntity implements ISession {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: "int",
  })
  @Column({ length: 16, unique: true })
  seed: string;
  

  @ManyToOne(() => UserEntity, (user) => user.uid, {
    onDelete: "CASCADE",
  })
  @Column({ length: 16 })
  uid: string;

  @Column({
    type: "json",
    default: {},
  })
  device_details: string;
  @Column({
    default: new Date(),
  })
  last_active: Date;
  @Column({
    default: true,
  })
  status: boolean;

  @Column({
    default: 0,
  })
  failed_attempts: number;
}
