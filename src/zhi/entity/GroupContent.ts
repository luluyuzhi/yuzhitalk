import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity()
export class GroupContent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group)
  groups: Group[];

  @ManyToOne(() => User)
  user: User[];

  @Column()
  role: string;

  @Column()
  createTime: Date;

  @Column()
  updateTime: Date;
}
