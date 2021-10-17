
import { ICommonPropsHandler } from '../user/common';
import { Subscription } from "./Subscription";
import { ISubscriptionServer } from "./SubscriptionServer";

export class GroupSubscription extends Subscription {
  static readonly hint = `lulu://group:subscription@chat.yuzhi.com:`;

  constructor(
    private readonly subId: number,
    private readonly owner: ICommonPropsHandler<number>,
    @ISubscriptionServer subscriptionServer: ISubscriptionServer
  ) {
    super(GroupSubscription.hint + subId, subscriptionServer);
  }

  override handle(message: Long): void {
    throw new Error("Method not implemented.");
  }
}