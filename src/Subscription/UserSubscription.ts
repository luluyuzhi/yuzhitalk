import { ICommonPropsHandler } from "yuzhi/user/common";
import { Session } from "yuzhi/session/Session";
import {
  encodeyuzhitalkproto,
  MessageType,
  yuzhitalkproto,
} from "yuzhi/protocol/normal";
import { Subscription } from "./Subscription";
import { ISubscriptionServer } from "./SubscriptionServer";
import * as Long from "long";

export class UserSubscription extends Subscription {
  static readonly hint = `lulu://user:subscription@chat.yuzhi.com:`;

  constructor(
    private readonly owner: ICommonPropsHandler<number>,
    @ISubscriptionServer subscriptionServer: ISubscriptionServer
  ) {
    super(UserSubscription.hint + owner.Unique(), subscriptionServer);
  }

  transfrom(message: Session): void {
  }
}
