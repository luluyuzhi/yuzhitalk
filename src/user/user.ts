import { Connector } from "../core/connector";
import { ISubscriptionServer } from "../subscription/SubscriptionServer";
import { UserSubscription } from "yuzhi/subscription/UserSubscription";
import { ICommonPropsHandler } from "./common";
import * as Long from "long";
import { Subscription } from "../subscription/Subscription";

export class User<T extends number> implements ICommonPropsHandler<T> {
  readonly type = "person";

  private sub = new UserSubscription(this, this.subscriptionServer);

  getSubscription(): Subscription {
    return this.sub;
  }

  constructor(
    private readonly userId: T,
    private connector: Connector,
    @ISubscriptionServer private subscriptionServer: ISubscriptionServer
  ) {}

  handle(buffer: Buffer): void {
    this.connector.send(buffer);
  }

  Unique(): T {
    return this.userId;
  }

  dispose(): void {
    this.connector.Disconnect();
  }
}
