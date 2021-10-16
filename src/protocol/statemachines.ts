import {
  yuzhitalkproto,
  MessageType,
  intToLong,
  encodeyuzhitalkproto,
} from "./normal";
import { IDisposable } from "yuzhi/common/lifecycle";
import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { IInstantiationService } from "yuzhi/instantiation/common/instantiation";
import { IUnique, SelfDictionary } from "yuzhi/utility/SelfDictionary";
import { ServiceCollection } from "yuzhi/instantiation/common/serviceCollection";
import { SyncDescriptor } from "yuzhi/instantiation/common/descriptors";
import { Connector } from "yuzhi/core/connector";
import * as schedule from "node-schedule";
import { UriProtocolServerUserChat } from "yuzhi/uri";
import { Itransfromto } from "yuzhi/message/messageTranstoServer";

export enum MessageStatus {
  SendMsgRequest,
  SendMsgNotify,
  ReceiveMsgNotify,
  ReceiveMsgRequest,
  ReceiveMsgAcknowled,
  SendMsgAcknowled,
}

interface IStatusImpl {
  Gen: () => Generator<MessageStatus, void, unknown>;
  Status: () => MessageStatus;
}

interface IException {
  abort: () => void;
  disconnect: () => void;
}

interface IStatus extends IDisposable, IStatusImpl, IUnique<number> {
  target: number;
  package: any;
}

export class MessageStatusTransformer
  implements IStatusImpl, IException, IUnique<number>
{
  constructor(
    private content: yuzhitalkproto,
    private id: number,
    private connector: Connector,
    private messageType_: MessageType = content.messageType,
    private messageStatus: MessageStatus = MessageStatus.SendMsgRequest
  ) { }

  abort() { }
  disconnect() {
    this.connector.Disconnect();
  }

  Unique(): number {
    return this.id;
  }

  *Gen(): Generator<MessageStatus, void, unknown> {
    yield (this.messageStatus = MessageStatus.SendMsgNotify);
    yield (this.messageStatus = MessageStatus.ReceiveMsgNotify);
    yield (this.messageStatus = MessageStatus.ReceiveMsgRequest);
    yield (this.messageStatus = MessageStatus.ReceiveMsgAcknowled);
    yield (this.messageStatus = MessageStatus.SendMsgAcknowled);
  }

  Status() {
    return this.messageStatus;
  }
}
interface IStatusMachine {
  initStatus(status: IStatus, connector: Connector): IStatus;
  StatusHandler(
    status: IStatus,
    connector: Connector,
    messageStatus: MessageStatus
  ): void;
}

export interface IProtocolCollocationServer {
  handleSource(content: yuzhitalkproto, connector: Connector): any;
}

export const IProtocolCollocationServer =
  createDecorator<IProtocolCollocationServer>("protocolCollocationServer");

export class ProtocolCollocationServer implements IProtocolCollocationServer {
  declare readonly _serviceBrand: undefined;
  private selfDictionary = new SelfDictionary();
  private subInstantiationService = this.createServices();
  private messages = [];
  constructor(
    @IInstantiationService private InstantiationService: IInstantiationService
  ) {
    schedule.scheduleJob("50 * * * * *", () => {
      console.log("scheduleJob: messages clear");
      this.messages.forEach((item) => {
        if (item.time.getTime() + 1000 * 60 * 10 < new Date().getTime()) {
          item.dispose();
        }
      });
    });
  }

  private createServices(): IInstantiationService {
    let collection = new ServiceCollection();
    collection.set(
      IStatusMachine,
      new SyncDescriptor<IStatusMachine>(StateMachinesServer)
    );
    return this.InstantiationService.createChild(collection);
  }

  handleSource(content: yuzhitalkproto, connector: Connector) {
    this.subInstantiationService.invokeFunction((accessor) => {
      const statusMachine = accessor.get(IStatusMachine);
      if (
        ![MessageType.Ack, MessageType.Notify].includes(content.messageType)
      ) {
        const messageStatusTransformer = new MessageStatusTransformer(
          content,
          0,
          connector
        );

        const status = statusMachine.initStatus(
          {
            dispose: messageStatusTransformer.abort,
            Gen: messageStatusTransformer.Gen,
            Status: messageStatusTransformer.Status,
            Unique: messageStatusTransformer.Unique,
            target: content.statustransto.low,
            package: content,
          },
          connector
        );
        const dispose = this.selfDictionary.set(status);
        this.messages.push({ dispose: dispose.dispose, time: new Date() });
      } else {
        const status = this.selfDictionary.get(0) as IStatus;
        statusMachine.StatusHandler(status, connector, status.Status());
      }
    });
  }
}
export const IStatusMachine = createDecorator<IStatusMachine>("IStatusMachine");

// 与状态的 对应关系 ,
// 消息来了-> 构建状态 =》 状态转移 action
// 状态迁移 =》 继续处理
export class StateMachinesServer implements IStatusMachine {
  constructor(
    /* @INetServer netServer, */
    /* @ILogServer logServer */
    @IProtocolCollocationServer protocolCollocationServer,
    @Itransfromto private messageTransfromto: Itransfromto
  ) { }

  public initStatus(status: IStatus, connector: Connector, box = status.Gen()) {
    box.next();
    this.StatusHandler(status, connector);
    return status;
  }

  public StatusHandler(
    status: IStatus,
    connector: Connector,
    messageStatus: MessageStatus = status.Status()
  ) {
    switch (messageStatus) {
      case MessageStatus.SendMsgNotify: {
        const ack = {
          messageType: MessageType.Ack,
          timestamp: intToLong(Date.now().valueOf()),
          statustransfrom: intToLong(0),
          statustransto: intToLong(0),
        } as yuzhitalkproto;
        connector.send(Buffer.from(encodeyuzhitalkproto(ack)));
        //!!! 不需要服务器保证
        // 网络请求-》 通知用户 A 你的消息我已经接收到了
        // 调用 MessageStatusTransformer.next(); 进入下一状态
        // StatusHandler(继续处理);
      }
      case MessageStatus.ReceiveMsgNotify: {
        const uri = UriProtocolServerUserChat(status.target);
        this.messageTransfromto.transfromto(uri, status.package);
        //!!!
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
      case MessageStatus.SendMsgAcknowled: {
        // 不需要服务器保证
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
