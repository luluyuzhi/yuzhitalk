import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { Session } from "yuzhi/session/Session";
import { IIdServer } from "yuzhi/id/idServer";
import { User } from "yuzhi/user/User";
import { ISubscriptionServer } from "yuzhi/subscription/SubscriptionServer";
import * as Long from "long";
import { Subscription } from "../subscription/Subscription";
import { SelfDictionary } from "yuzhi/utility/SelfDictionary";


export interface ISessionServer {
  readonly _serviceBrand: undefined;
  registerSession(session: Session): void;
  getSession(sessionId: Long): Session | undefined;
}

export const ISessionServer = createDecorator<ISessionServer>("ISessionServer");

export class SessionServer implements ISessionServer {
  declare readonly _serviceBrand: undefined;

  private selfDictionary: SelfDictionary<Long, Session> = new SelfDictionary();

  constructor(
    @IIdServer private idServer: IIdServer,
    @ISubscriptionServer private subscriptionServer: ISubscriptionServer
  ) { }

  registerSession(session: Session) {
    this.selfDictionary.set(session);
  }

  getSession(sessionId: Long): Session | undefined {
    return this.selfDictionary.get(sessionId);
  }

}
