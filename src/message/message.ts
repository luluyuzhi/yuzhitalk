import { IContent, IHead } from "yuzhi/protocol/statemachines";
import { User } from "../user/User";
import { IUnique } from "yuzhi/utility/SelfDictionary";
import { Emitter, Event } from "../common/event";

export interface MessageOptions {
  hasGlobalsId?: boolean;
}

export enum IStates {
  None,
  Ack,
  Notify,
}

export class Message implements IUnique<Long> {
  // 注册一个事件发射器
  private readonly _onDidMessageAckSuccess = new Emitter<Long>();
  // 将该发射器允许大家订阅的事件取出来
  public readonly onDidMessageAckSuccess: Event<Long> =
    this._onDidMessageAckSuccess.event;

  // 注册一个事件发射器
  private readonly _onDidMessageNotifySuccess = new Emitter<Long>();
  // 将该发射器允许大家订阅的事件取出来
  public readonly onDidMessageNotifySuccess: Event<Long> =
    this._onDidMessageNotifySuccess.event;

  private globalsId?: Long;

  constructor(
    private head: IHead,
    private content: IContent,
    private id: Long,
    private sender: User<number>,
    private receiver: Long,
    private status: IStates = IStates.None,
    private options?: MessageOptions
  ) { }

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

    this._onDidMessageAckSuccess.fire(this.Unique());
    yield this.status = IStates.Ack;

    this._onDidMessageNotifySuccess.fire(this.Unique());
    yield this.status = IStates.Notify;
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
