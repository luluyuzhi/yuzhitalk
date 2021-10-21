import { Subscription } from "../subscription/Subscription";
import { ICommonPropsHandler } from "./common";

export class VirtualUser<T> implements ICommonPropsHandler<T> {
  readonly type = "person";
  constructor(private readonly userId: T) {}

  getSubscription(): Subscription {
    throw new Error("Method not implemented.");
  }

  dispose(): void {
    throw new Error("Method not implemented.");
  }

  handle(buffer: Buffer): void {
    throw new Error("Method not implemented.");
  }

  Unique(): T {
    return this.userId;
  }

  private liveTag: NodeJS.Timeout = setTimeout(() => {
    this.dispose();
  }, 10000);
}
