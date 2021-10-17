import { ICommonPropsHandler } from "./common";

export class VirtualUser<T> implements ICommonPropsHandler<T> {
  readonly type = 'person';
  constructor(private readonly userId: T) {}

  dispose(): void {
    throw new Error("Method not implemented.");
  }

  handle(status: string): void {
    throw new Error("Method not implemented.");
  }

  Unique(): T {
    return this.userId;
  }

  private liveTag: NodeJS.Timeout = setTimeout(() => {
    this.dispose();
  }, 10000);
}