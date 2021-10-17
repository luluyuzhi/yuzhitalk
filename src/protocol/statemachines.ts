import * as Long from "long";
import {
  yuzhitalkproto,
  MessageType,
  TransfromAck,
  TransfromCustom,
  TransfromExist,
  TransfromFile,
  TransfromImage,
  TransfromNotify,
  TransfromPosition,
  TransfromSystem,
  TransfromText,
  TransfromVideo,
  TransfromVoice,
  Long as ILong,
  encodeyuzhitalkproto,
} from "./normal";
import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { IInstantiationService } from "yuzhi/instantiation/common/instantiation";
import { ServiceCollection } from "yuzhi/instantiation/common/serviceCollection";
import { Connector } from "yuzhi/core/connector";
import { IMessageServer } from "yuzhi/message/messageServer";

export function interToLong<T extends ILong>(e: T | undefined) {
  return e ? new Long(e.low, e.low, e.unsigned) : undefined;
}

export interface IHead {
  type: MessageType;
  timestamp: Long;
  statustransfrom: Long;
  statustransto: Long;
  id?: Long;
}

export interface IContent {
  transfromtext?: TransfromText;
  transfromVoice?: TransfromVoice;
  transfromImage?: TransfromImage;
  transfromVideo?: TransfromVideo;
  transfromPosition?: TransfromPosition;
  transfromFile?: TransfromFile;
  transfromExist?: TransfromExist;
  transfromAck?: TransfromAck;
  transfromNotify?: TransfromNotify;
  transfromSystem?: TransfromSystem;
  transfromCustom?: TransfromCustom;
}

export interface IProtocolCollocationServer {
  handleSource(content: yuzhitalkproto, connector: Connector): any;
}

export const IProtocolCollocationServer =
  createDecorator<IProtocolCollocationServer>("protocolCollocationServer");

export class ProtocolCollocationServer implements IProtocolCollocationServer {
  declare readonly _serviceBrand: undefined;

  private subInstantiationService = this.createServices();
  constructor(
    @IInstantiationService private InstantiationService: IInstantiationService,
    @IMessageServer private messageServer: IMessageServer
  ) {}

  private createServices(): IInstantiationService {
    let collection = new ServiceCollection();
    return this.InstantiationService.createChild(collection);
  }

  handleSource(source: yuzhitalkproto, connector: Connector) {
    this.subInstantiationService.invokeFunction((accessor) => {
      if (![MessageType.Ack, MessageType.Notify].includes(source.messageType)) {
        const de = this.dismantle(source);
        const message = this.messageServer.handle(
          de.head,
          de.content,
          connector.user
        );
        message.onDidMessageAckSuccess((id) => {
          const ack = {
            messageType: MessageType.Ack,
            timestamp: id,
            statustransfrom: de.head.statustransfrom,
            statustransto: de.head.statustransto,
            transfromAck: {
              ack: "a",
            },
          } as yuzhitalkproto;
          connector.send(Buffer.from(encodeyuzhitalkproto(ack)));
        });

        message.onDidMessageNotifySuccess((id) => {
          const Notify = {
            messageType: MessageType.Notify,
            timestamp: id,
            statustransfrom: de.head.statustransfrom,
            statustransto: de.head.statustransto,
          } as yuzhitalkproto;
          connector.send(Buffer.from(encodeyuzhitalkproto(Notify)));
        });
      }
    });
  }

  private dismantle(content: yuzhitalkproto): {
    head: IHead;
    content: IContent;
  } {
    const {
      messageType: type,
      timestamp,
      statustransfrom,
      statustransto,
      id,
    } = content;
    const {
      transfromtext,
      transfromVoice,
      transfromImage,
      transfromVideo,
      transfromPosition,
      transfromFile,
      transfromExist,
      transfromAck,
      transfromNotify,
      transfromSystem,
      transfromCustom,
    } = content;
    return {
      head: {
        type,
        timestamp: interToLong(timestamp),
        statustransfrom: interToLong(statustransfrom),
        statustransto: interToLong(statustransto),
        id: interToLong(id),
      },
      content: {
        transfromtext,
        transfromVoice,
        transfromImage,
        transfromVideo,
        transfromPosition,
        transfromFile,
        transfromExist,
        transfromAck,
        transfromNotify,
        transfromSystem,
        transfromCustom,
      },
    };
  }
}
