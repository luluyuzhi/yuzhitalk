import { Subscription } from "../subscription/Subscription";
import { ICommonPropsHandler } from "./common";
import { User } from "./User";

export class Group<T> implements ICommonPropsHandler<T> {
  readonly type = "group";
  private handlers: (ICommonPropsHandler<T> | T)[] = [];

  constructor(
    private readonly groupId: T,
    private readonly owner: ICommonPropsHandler<T>
  ) {}

  getSubscription(): Subscription {
    throw new Error("Method not implemented.");
  }

  Unique() {
    return this.groupId;
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }

  handle(buffer: Buffer): void {
    throw new Error("Method not implemented.");
  }
}
