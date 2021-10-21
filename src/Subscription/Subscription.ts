import { User } from "yuzhi/user/User";
import { IUserService } from "yuzhi/user/server/UserServer";
import { Emitter, Event } from "../common/event";
import * as URI from "uri-js";
import * as Long from "long";
import { IUnique } from "yuzhi/utility/SelfDictionary";
import { ISubscriptionServer } from "./SubscriptionServer";
import { Session } from "../session/Session";
import { MaxPriorityQueue } from "datastructures-js";

// lulu://sendtype:group@yuzhi.com:{id}/
// lulu://sendtype:person@yuzhi.com:{id}/
export interface ISubscription extends IUnique<number> {
  readonly subscript: string;
  type(): string;
  handle(id: Session): void;
  handle(id: Long): void;
  addMessage(message: Session): void;
}

export abstract class Subscription implements ISubscription {
  private id: number;
  private readonly subscripturi: URI.URIComponents;

  private messages: MaxPriorityQueue<Session>;
  private _m: Map<Long, Session> = new Map();
  public constructor(
    // lulu://group:subscription@chat.yuzhi.com:{id}/
    readonly subscript: string,
    // @IUserService private userService: IUserService
    @ISubscriptionServer protected subscriptionServer: ISubscriptionServer
  ) {
    this.subscripturi = URI.parse(subscript);
    this.id = Number(this.subscripturi.host);
    this.messages = new MaxPriorityQueue<Session>({
      compare: (a, b) => {
        return a.Unique().compare(b.Unique());
      },
    });
    this.subscriptionServer.addSubscription(this);
  }

  addMessage(message: Session): void {
    this._m.set(message.Unique(), message);
    this.messages.enqueue(message);
    this.handle(message);
  }

  handle(id: Long | Session): void {
    if (Long.isLong(id)) {
      const msg = this._m.get(id);
      this.transfrom(msg);
      return;
    }
    const message = id as Session;
    this.transfrom(message);
  }

  abstract transfrom(message: Session): void;

  type(): string {
    return this.subscripturi.path;
  }

  Unique() {
    return this.id;
  }
}
