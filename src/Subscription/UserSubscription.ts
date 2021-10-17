import { ICommonPropsHandler } from 'yuzhi/user/common';
import { Subscription } from "./Subscription";
import { ISubscriptionServer } from "./SubscriptionServer";

export class UserSubscription extends Subscription {
  static readonly hint = `lulu://user:subscription@chat.yuzhi.com:`;

  constructor(
    private readonly owner: ICommonPropsHandler<number>,
    @ISubscriptionServer subscriptionServer: ISubscriptionServer
  ) {
    super(UserSubscription.hint + owner.Unique(), subscriptionServer);
  }

  override handle(message: Long): void { }
}
