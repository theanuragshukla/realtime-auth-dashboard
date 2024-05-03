import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ISession } from "../model/sessions.model";
import { UserSessionsEntity } from "./userSessions.entity";

@Entity("sessions")
export class SessionsEntity implements ISession {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: "int",
  })
  @ManyToOne(() => UserSessionsEntity, (sessions) => sessions.id, {
    onDelete: "CASCADE",
  })
  session_id: number;
  @Column({ length: 16, unique: true })
  seed: string;
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
