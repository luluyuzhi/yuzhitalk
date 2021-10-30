import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { Session } from "yuzhi/session/Session";
import { IIdServer } from "yuzhi/id/idServer";
import { User } from "yuzhi/user/User";
import { ISubscriptionServer } from "yuzhi/subscription/SubscriptionServer";
import { Long } from "long";
import { Subscription } from "../subscription/Subscription";
import { SelfDictionary } from "yuzhi/utility/SelfDictionary";



export interface ISessionServer {
  readonly _serviceBrand: undefined;
  registerSession(session: Session): void;
  getSession(sessionId: string): Session | undefined;
  generateSessionId(ids: Long[], sessionType: string): string;
}

export const ISessionServer = createDecorator<ISessionServer>("ISessionServer");

export class SessionServer implements ISessionServer {
  declare readonly _serviceBrand: undefined;

  private selfDictionary: SelfDictionary<String, Session> = new SelfDictionary();

  constructor(
    @IIdServer private idServer: IIdServer,
    @ISubscriptionServer private subscriptionServer: ISubscriptionServer
  ) { }

  generateSessionId(ids: Long[], sessionType: string): string {
    let hind = `yuzhi://session.com/${sessionType}/`;
    for (const id of ids) {
      hind += `${id}/`;
    }
    return hind;
  }

  registerSession(session: Session) {
    this.selfDictionary.set(session);
  }

  getSession(sessionId: string): Session | undefined {
    return this.selfDictionary.get(sessionId);
  }

}
