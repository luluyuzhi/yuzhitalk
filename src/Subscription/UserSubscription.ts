import { ICommonPropsHandler } from "yuzhi/user/common";
import { IStates, Message } from "yuzhi/message/message";
import { encodeyuzhitalkproto, MessageType, yuzhitalkproto } from "yuzhi/protocol/normal";
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

  transfrom(message: Message): void {
    let toB: yuzhitalkproto;
    switch (message.Status) {
      case IStates.Ack:
        toB = {
          messageType: MessageType.Text,
          timestamp: message.Unique(),
          statustransfrom: Long.fromNumber(message.Sender.Unique()),
          statustransto: message.Receiver,
          id: message.GlobalsId,
          ...message.Content
        };
        break;
      case IStates.Notify:
        toB = {
          messageType: MessageType.Notify,
          timestamp: message.Unique(),
          statustransfrom: Long.fromNumber(message.Sender.Unique()),
          statustransto: message.Receiver,
          id: message.GlobalsId,
        };
    }

    this.owner.handle(Buffer.from(encodeyuzhitalkproto(toB)));
  }
}
