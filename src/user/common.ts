import { ICycleElem } from "yuzhi/utility/cycle";
import { IUnique } from "yuzhi/utility/SelfDictionary";
import { User } from "./User";

export interface ICommonProps {
  sendMessage(id: number, message: string): void;
  recallMessage(id: number): void;

  getUser(id: number): Promise<User<number>>;
}

interface IContentHandler {
  handle(status: string): void;
}

export interface ICommonPropsHandler<T>
  extends IUnique<T>,
  IContentHandler,
  ICycleElem<T> {
  readonly type: "person" | "group";
}
