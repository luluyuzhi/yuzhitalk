import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  avatar: string;

  @Column()
  birthday: Date;

  @Column()
  age: number;

  @Column()
  password: string;

  @Column()
  photo: string;
}
