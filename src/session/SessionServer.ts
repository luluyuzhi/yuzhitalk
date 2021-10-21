import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { Session } from "yuzhi/session/Session";
import { IIdServer } from "yuzhi/id/idServer";
import { User } from "yuzhi/user/User";
import { ISubscriptionServer } from "yuzhi/subscription/SubscriptionServer";
import * as Long from "long";
import { Subscription } from "../subscription/Subscription";

// interface IIner

export interface ISessionServer {
  readonly _serviceBrand: undefined;
  generateSession(
    timestamp: Long,
    content: any,
    sender: User<number>,
    receiver: Long | User<number>
  ): Session;
}

export const ISessionServer = createDecorator<ISessionServer>("ISessionServer");

export class SessionServer implements ISessionServer {
  declare readonly _serviceBrand: undefined;

  constructor(
    @IIdServer private idServer: IIdServer,
    @ISubscriptionServer private subscriptionServer: ISubscriptionServer
  ) {}

  generateSession(
    timestamp: Long,
    content: any,
    sender: User<number>,
    receiver: Long | User<number>
  ) {
    let sub: Subscription;
    if (receiver instanceof Long) {
      sub = this.subscriptionServer.getSubscription(receiver);
    } else {
      sub = receiver.getSubscription();
    }
    const session = new Session(
      content,
      timestamp,
      sender, // sender
      receiver, // receiver
      sub
    );
    session.GlobalsId = this.idServer.gen();
    return session;
  }
}
