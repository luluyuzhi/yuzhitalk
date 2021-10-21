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
  decodeyuzhitalkproto,
} from "./normal";
import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { IInstantiationService } from "yuzhi/instantiation/common/instantiation";
import { Connector } from "yuzhi/core/connector";
import { ISessionServer } from "yuzhi/session/SessionServer";

export function interToLong<T extends ILong>(e: T | undefined) {
  return e ? new Long(e.low, e.low, e.unsigned) : undefined;
}

export interface IProtocolCollocationServer {
  handleSource(content: yuzhitalkproto, connector: Connector): any;
}

export const IProtocolCollocationServer =
  createDecorator<IProtocolCollocationServer>("protocolCollocationServer");

export class ProtocolCollocationServer implements IProtocolCollocationServer {
  declare readonly _serviceBrand: undefined;

  constructor(
    @IInstantiationService private instantiationService: IInstantiationService,
    @ISessionServer private sessionServer: ISessionServer
  ) {}

  transmit(id: Long, source: yuzhitalkproto, connector: Connector) {
    [source.statustransfrom, source.statustransto] = [
      source.statustransto,
      source.statustransfrom,
    ];
    connector.send(Buffer.from(encodeyuzhitalkproto(source)));
  }

  handleSource(source: yuzhitalkproto, connector: Connector) {
    if (![MessageType.Ack, MessageType.Notify].includes(source.messageType)) {
      const session = this.sessionServer.generateSession(
        interToLong(source.timestamp),
        source,
        connector.user,
        interToLong(source.statustransto)
      );
    }
  }
}
