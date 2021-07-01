import { IUnique } from './common/selfdictionary';
import { yuzhitalkproto, MessageType } from './normal';
import { SelfDictionary } from './common/selfdictionary';
import { IDisposable } from '../common/lifecycle';
import { createDecorator } from 'yuzhi/instantiation/common/instantiation';
import { IInstantiationService } from 'yuzhi/instantiation/common/instantiation';

enum MessageStatus {
    SendMsgRequest,
    SendMsgNotify,
    ReceiveMsgNotify,
    ReceiveMsgRequest,
    ReceiveMsgAcknowled,
    SendMsgAcknowled,
}

interface IStatusImpl {
    Gen: () => Generator<MessageStatus, void, unknown>
    Status: () => MessageStatus
}

interface IStatus extends IDisposable, IStatusImpl { }

export class MessageStatusTransformer implements IUnique<number>, IStatusImpl {
    constructor(private content: yuzhitalkproto,
        private id: number,
        private messageType_: MessageType = content.messageType,
        private messageStatus: MessageStatus = MessageStatus.SendMsgRequest,) {
    }

    Unique() { return this.id };

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

export interface IProtocolCollocationServer {
    handleSource(content: yuzhitalkproto): any;
}

export const IProtocolCollocationServer = createDecorator<IProtocolCollocationServer>('protocolCollocationServer');

export class ProtocolCollocationServer implements IProtocolCollocationServer {
    private selfDictionary = new SelfDictionary();
    constructor(
        @IInstantiationService InstantiationService: IInstantiationService
    ) { }
    handleSource(content: yuzhitalkproto) {
        //1. 查表， 如果在的话就 继续处理
        //2. 不在就加入
        let messageStatusTransformer = new MessageStatusTransformer(content, 0);
        let dispose = this.selfDictionary.set(messageStatusTransformer);
        let stateMachines = new StateMachines({ ...dispose, Gen: messageStatusTransformer.Gen, Status: messageStatusTransformer.Status });
    }
}

// 与状态的 对应关系 , 
// 消息来了-> 构建状态 =》 状态转移 action 
// 状态迁移 =》 继续处理
export class StateMachines {
    constructor(readonly status: IStatus,
        /* @INetServer netServer, */
        /* @ILogServer logServer */
        /* @IProtocolCollocationServer protocolCollocationServer*/
        private box = status.Gen()) {
        box.next();
        // protocolCollocationServer.push(status);
        this.StatusHandler(status.Status());
    }

    StatusHandler(messageStatus: MessageStatus) {
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
}

// 谈谈接口的作用 
// 1. 复用   大家都集成他 ， 然后只要 别的类 签名 没有改变 就可以了。n-1 ，n 个 服务 对 一个 服务 
// 2. 透明 只要关心 我们需要关心的。 需求明确
// 3. vscode  1 - 1 