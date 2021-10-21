import { User } from "../user/User";
import { IUnique } from "yuzhi/utility/SelfDictionary";
import { Emitter, Event } from "../common/event";
import { Subscription } from "../subscription/Subscription";

export interface SessionOptions {
  hasGlobalsId?: boolean;
}

export enum IStates {
  None,
  Ack,
  Notify,
}

export class Session implements IUnique<Long> {
  private globalsId?: Long;

  constructor(
    private content: any,
    private id: Long,
    private sender: User<number>,
    private receiver: Long | User<number>,
    private subscription: Subscription,
    private status: IStates = IStates.None,
    private options?: SessionOptions
  ) {
    subscription.addMessage(this);
  }

  get Content() {
    return this.content;
  }

  get Sender() {
    return this.sender;
  }

  get Receiver() {
    return this.receiver;
  }

  set GlobalsId(val) {
    if (this.options?.hasGlobalsId) {
      this.globalsId = val;
    }
  }

  get GlobalsId(): Long | undefined {
    return this.globalsId;
  }

  private *gen() {
    yield (this.status = IStates.Ack);
    yield (this.status = IStates.Notify);
    return IStates.None;
  }

  private _g = this.gen();

  get Status() {
    return this._g.next().value;
  }

  Unique() {
    return this.id;
  }
}
