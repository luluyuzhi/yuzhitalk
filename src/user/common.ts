import { User } from './user';


export interface ICommonProps {
  sendMessage(id: number, message: string): void;
  recallMessage(id: number): void;

  getUser(id: number): Promise<User<number>>;
}
