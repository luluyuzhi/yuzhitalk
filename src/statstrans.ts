import { yuzhitalkproto, MessageType, TransfromText } from './normal'

enum MessageStatus {
    SendMsgRequest,
    SendMsgNotify,
    ReceiveMsgNotify,
    ReceiveMsgRequest,
    ReceiveMsgAcknowled,
    SendMsgAcknowled,
}

interface IUnique<T> {
    unique: () => T;
}

interface IStatusImpl {
    Gen: () => Generator<MessageStatus, void, unknown>
    Status: () => MessageStatus
}

export class MessageStatusTransformer implements IUnique<number>, IStatusImpl {
    constructor(private content: yuzhitalkproto,
        private id: number,
        private messageType_: MessageType = content.messageType,
        private messageStatus: MessageStatus = MessageStatus.SendMsgRequest,) {
    }

    unique() { return this.id };

    *Gen(): Generator<MessageStatus, void, unknown> {
        yield this.messageStatus = MessageStatus.SendMsgNotify;
        yield this.messageStatus = MessageStatus.ReceiveMsgNotify;
        yield this.messageStatus = MessageStatus.ReceiveMsgRequest;
        yield this.messageStatus = MessageStatus.ReceiveMsgAcknowled;
        yield this.messageStatus = MessageStatus.SendMsgAcknowled;
    }

    Status() {
        return this.messageStatus;
    }
}

interface IDstory {
    Destory: () => void;
}

class IdMap<U, T extends IUnique<U>> {
    private map = new Map();
    public set(value: T): IDstory {
        this.map.set(value.unique(), value);
        return {
            Destory: () => {
                this.map.delete(value.unique());
            }
        };
    }

    public get(key: U) {
        return this.map.get(key);
    }
}

interface IStatus extends IDstory, IStatusImpl { }

// 消息来了-> 构建状态 =》 状态转移 action 
abstract class AAction {
    constructor(private status: IStatus,
        private box = status.Gen()) {
        box.next();
        StatusHandler(status.Status());
    }
    abstract StatusHandler(messageStatus: MessageStatus): void;
}

function StatusHandler(messageStatus: MessageStatus) {
    switch (messageStatus) {
        case MessageStatus.SendMsgNotify: { //!!! 不需要服务器保证
            // 网络请求-》 通知用户 A 你的消息我已经接收到了
            // 调用 MessageStatusTransformer.next(); 进入下一状态
            // StatusHandler(继续处理);
        }
        case MessageStatus.ReceiveMsgNotify: { //!!!
            // 把消息通知 到 B 
            // 调用 MessageStatusTransformer.next(); 进入下一状态
            // 定时器 保证 Notify 的可靠传输
            // 结束
            break;
        }
        case MessageStatus.ReceiveMsgRequest: {
            // 消息处理
            // StatusHandler(继续处理);
        }
        case MessageStatus.ReceiveMsgAcknowled: {
            // 告诉 B 我收到了
            // 调用 MessageStatusTransformer.next(); 进入下一状态
            // StatusHandler(继续处理);
        }
        case MessageStatus.SendMsgAcknowled: { // 不需要服务器保证
            // 告诉 a ,b 收到了
            // 结束
        }
    }
}