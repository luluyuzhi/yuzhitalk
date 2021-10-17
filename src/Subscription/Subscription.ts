import { User } from "yuzhi/user/User";
import { IUserService } from "yuzhi/user/server/UserServer";
import { Emitter, Event } from "../common/event";
import * as URI from "uri-js";
import { IUnique } from "yuzhi/utility/SelfDictionary";
import { ISubscriptionServer } from "./SubscriptionServer";
import { Message } from "../message/message";
import { MaxPriorityQueue } from "datastructures-js";

// lulu://sendtype:group@yuzhi.com:{id}/
// lulu://sendtype:person@yuzhi.com:{id}/
export interface ISubscription extends IUnique<number> {
  readonly subscript: string;
  type(): string;
  handle(id: Long): void;
  addMessage(message: Message): void;
}

export abstract class Subscription implements ISubscription {
  private id: number;
  private readonly subscripturi: URI.URIComponents;

  private messages: MaxPriorityQueue<Message>;
  private _m: Map<Long, Message> = new Map();
  public constructor(
    // lulu://group:subscription@chat.yuzhi.com:{id}/
    readonly subscript: string,
    // @IUserService private userService: IUserService
    @ISubscriptionServer protected subscriptionServer: ISubscriptionServer
  ) {
    this.subscripturi = URI.parse(subscript);
    this.id = Number(this.subscripturi.host);
    this.messages = new MaxPriorityQueue<Message>({
      compare: (a, b) => { return a.Unique().compare(b.Unique()); }
    });
    this.subscriptionServer.addSubscription(this);
  }

  addMessage(message: Message): void {
    this._m.set(message.Unique(), message);
    this.messages.enqueue(message);
  }

  handle(id: Long): void {
    const msg = this._m.get(id);
  }

  type(): string {
    return this.subscripturi.path;
  }

  Unique() {
    return this.id;
  }
}
