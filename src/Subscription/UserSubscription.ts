import { ICommonPropsHandler } from "yuzhi/user/common";
import { Message } from "yuzhi/message/message";
import { encodeyuzhitalkproto, MessageType } from "yuzhi/protocol/normal";
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
    let test = {
      messageType: MessageType.Text,
      timestamp: message.Unique(),
      statustransfrom: Long.fromNumber(message.Sender.Unique()),
      statustransto: message.Receiver,
      id: message.GlobalsId,
      transfromtext: {
        contents: "one word",
      },
    };

    this.owner.handle(Buffer.from(encodeyuzhitalkproto(test)));
  }
}
