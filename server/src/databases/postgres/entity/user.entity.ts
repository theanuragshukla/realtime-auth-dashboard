import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import IUser from "../model/user.model";
import { ROLE } from "../../../constants";

@Entity("users")
export class UserEntity implements IUser {
  @Column({ type: "int", generated: true })
  id: number;
  @Column({ primary: true, length: 16, unique: true })
  uid: string;
  @Column({ length: 255, default: "user" })
  name: string;
  @Column({
    default: ROLE.USER,
    enum: ROLE,
  })
  role: ROLE;
  @Column({ length: 255, unique: true })
  email: string;
  @Column({ length: 255 })
  password: string;
  @Column({
    default: false,
  })
  twofactor: boolean;
  @Column({
    default: false,
  })
  isVerified: boolean;
  @Column({
    default: new Date(),
  })
  createdAt: Date;
  @Column({
    default: new Date(),
  })
  updatedAt: Date;
}
