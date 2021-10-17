import { IContent, IHead, MessageStatus } from "yuzhi/protocol/statemachines";
import { User } from "../user/User";
import { IUnique } from "yuzhi/utility/SelfDictionary";
import { Emitter, Event } from "../common/event";

export interface MessageOptions {
  hasGlobalsId?: boolean;
}

export class Message implements IUnique<Long> {
  // 注册一个事件发射器
  private readonly _onDidMessageSendSuccess = new Emitter<Long>();
  // 将该发射器允许大家订阅的事件取出来
  public readonly onDidMessageSendSuccess: Event<Long> =
    this._onDidMessageSendSuccess.event;

  private globalsId?: Long;

  constructor(
    private head: IHead,
    private content: IContent,
    private id: Long,
    private sender: User<number>,
    private receiver: Long,
    private status: MessageStatus = MessageStatus.SendMsgRequest,
    private options?: MessageOptions
  ) { }

  set GlobalsId(val) {
    if (this.options?.hasGlobalsId) {
      this.globalsId = val;
    }
  }

  get GlobalsId(): Long | undefined {
    return this.globalsId;
  }

  set Status(value: MessageStatus) {
    if (value == MessageStatus.SendMsgAcknowled) {
      this._onDidMessageSendSuccess.fire(this.Unique());
    }
    this.status = value;
  }

  Unique() {
    return this.id;
  }
}
