import { MessageStatus } from "yuzhi/protocol/statemachines";
import { User } from '../user/user';
import { IUnique } from "yuzhi/utility/SelfDictionary";
import { Emitter, Event } from '../common/event';

export class Message<T, U> implements IUnique<U> {

  // 注册一个事件发射器
  private readonly _onDidMessageSendSuccess = new Emitter<U>();
  // 将该发射器允许大家订阅的事件取出来
  public readonly onDidMessageSendSuccess: Event<U> = this._onDidMessageSendSuccess.event;

  public constructor(
    private content: T,
    private id: U,
    private status: MessageStatus = MessageStatus.SendMsgRequest,
  ) { }

  set Status(value: MessageStatus) {
    if (value == MessageStatus.SendMsgAcknowled) {
      this._onDidMessageSendSuccess.fire(this.Unique());
    }
    this.status = value;
  }

  Unique() { return this.id; };

}


