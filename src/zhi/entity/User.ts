import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Profile } from "./Profile";
import * as Long from "long";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: Long;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false })
  phone: string;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;
}
