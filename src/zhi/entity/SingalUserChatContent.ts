import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Index,
} from "typeorm";
import { User } from "./User";

@Entity()
export class SingleUserChatContent {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => User)
  @JoinColumn()
  friend: User;

  @Column()
  contentType: string;

  @Column()
  content: string;

  @Column()
  time: Date;

  @Column()
  isReaded: boolean;

  @Column()
  isDeleted: boolean;

  @Column()
  isSendSucceeded: boolean;
}
