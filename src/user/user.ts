import { Connector } from "../core/connector";
import { ISubscriptionServer } from "../subscription/SubscriptionServer";
import { UserSubscription } from "yuzhi/subscription/UserSubscription";
import { ICommonPropsHandler } from "./common";
import * as Long from "long";
import { Subscription } from "../subscription/Subscription";

type unique_type = number;

export abstract class User implements ICommonPropsHandler<unique_type> {
  readonly type = "person";

  private sub = new UserSubscription(this, this.subscriptionServer);

  constructor(
    private readonly userId: unique_type,
    @ISubscriptionServer protected subscriptionServer: ISubscriptionServer
  ) {}

  getSubscription(): Subscription {
    return this.sub;
  }

  Unique(): unique_type {
    return this.userId;
  }

  abstract handle(buffer: Buffer): void;
  abstract dispose(): void;
}

export class OnlionUser extends User {
  constructor(
    userId: unique_type,
    private connector: Connector,
    @ISubscriptionServer subscriptionServer: ISubscriptionServer
  ) {
    super(userId, subscriptionServer);
  }

  handle(buffer: Buffer): void {
    this.connector.send(buffer);
  }

  dispose(): void {
    this.connector.Disconnect();
  }
}

export class VirtualUser extends User {
  constructor(
    userId: unique_type,
    @ISubscriptionServer subscriptionServer: ISubscriptionServer
  ) {
    super(userId, subscriptionServer);
  }

  override handle(buffer: Buffer): void {}
  override dispose(): void {}
}
