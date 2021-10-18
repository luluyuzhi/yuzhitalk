import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { Message } from "yuzhi/session/message";
import { IIdServer } from "yuzhi/id/idServer";
import { User } from "yuzhi/user/User";
import { ISubscriptionServer } from "yuzhi/subscription/SubscriptionServer";
import { IContent, IHead } from "yuzhi/protocol/statemachines";

export interface ISessionServer {
  readonly _serviceBrand: undefined;
  handle(head: IHead, content: IContent, user: User<number>): Message;
}

export const ISessionServer = createDecorator<ISessionServer>("ISessionServer");

export class SessionServer implements ISessionServer {
  declare readonly _serviceBrand: undefined;

  constructor(
    @IIdServer private idServer: IIdServer,
    @ISubscriptionServer private subscriptionServer: ISubscriptionServer
  ) { }

  handle(head: IHead, content: IContent, user: User<number>) {
    const message = new Message(
      head,
      content,
      head.timestamp,
      user,
      head.statustransto
    );
    message.GlobalsId = this.idServer.gen();
    const sub = this.subscriptionServer.getSubscription(head.statustransto);
    sub.addMessage(message);
    return message;
  }
}
