import { User } from "yuzhi/user/User";
import { IUserService } from "yuzhi/user/server/UserServer";
import { Emitter, Event } from "../common/event";
import * as URI from "uri-js";
import * as Long from "long";
import { IUnique, SelfDictionary } from "yuzhi/utility/SelfDictionary";
import { ISubscriptionServer } from "./SubscriptionServer";
import { IChannel, Session } from "../session/Session";
import { MaxPriorityQueue } from "datastructures-js";

// lulu://sendtype:group@yuzhi.com:{id}/
// lulu://sendtype:person@yuzhi.com:{id}/
export interface ISubscription extends IUnique<number> {
  readonly subscript: string;
  type(): string;
  handle(id: Long, context: any): void;
  registerChannel(channel: IChannel): void;
}

export abstract class Subscription implements ISubscription {
  private id: number;
  private readonly subscripturi: URI.URIComponents;

  private selfDictionary = new SelfDictionary<Long, IChannel>();
  public constructor(
    // lulu://group:subscription@chat.yuzhi.com:{id}/
    readonly subscript: string,
    // @IUserService private userService: IUserService
    @ISubscriptionServer protected subscriptionServer: ISubscriptionServer
  ) {
    this.subscripturi = URI.parse(subscript);
    this.id = Number(this.subscripturi.host);
    this.subscriptionServer.addSubscription(this);
  }

  registerChannel(channel: IChannel) {
    this.selfDictionary.set(channel);
  }

  private getChannels(id: Long): IChannel | undefined {
    return this.selfDictionary.get(id);
  }

  handle(id: Long, context: any): void {
    const channel = this.getChannels(id);
    channel.inject(context);
  }

  type(): string {
    return this.subscripturi.path;
  }

  Unique() {
    return this.id;
  }
}
