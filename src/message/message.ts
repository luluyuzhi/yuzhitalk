import { MessageStatus } from "../protocol/statemachines";
import { IUnique } from "../utility/SelfDictionary";

class Message<T, U> implements IUnique<U> {
  constructor(private message: T /* @IIdserver idgenerator: IIdserver */) {
    this.Status = MessageStatus.SendMsgRequest;
  }
  Unique: () => U;
  public Status: MessageStatus;
}
