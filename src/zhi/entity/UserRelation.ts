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
@Index(["user", "friend"], { unique: true })
export class UserRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  friend: User;

  @Column()
  type: string;
}
