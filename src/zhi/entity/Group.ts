import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./User";

@Entity()
@Index(["owner"])
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @OneToOne((_type) => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  owner: User;

  @Column()
  description: string;

  @Column()
  type: string;

  // @Column()
  // isDeleted: boolean;

  // @Column()
  // isPublic: boolean;

  // @Column()
  // isSystem: boolean;

  // @Column()
  // isDisabled: boolean;

  // @Column()
  // isLocked: boolean;

  // @Column()
  // isDefault: boolean;

  // @Column()
  // isExpanded: boolean;

  // @Column()
  // isCollapsed: boolean;

  // @Column()
  // isHidden: boolean;

  // @Column()
  // isReadOnly: boolean;

  // @Column()
  // isAutoExpand: boolean;
}
