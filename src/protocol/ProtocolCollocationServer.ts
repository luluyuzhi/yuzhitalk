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
import { Session, SingleSession } from "yuzhi/session/Session";
import { Transformation } from "yuzhi/session/Transformation";

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
  ) { }

  transmit(id: Long, source: yuzhitalkproto, connector: Connector) {
    [source.statustransfrom, source.statustransto] = [
      source.statustransto,
      source.statustransfrom,
    ];
    connector.send(Buffer.from(encodeyuzhitalkproto(source)));
  }

  notify(id: Long, connector: Connector) {
    const notify = {
      messageType: MessageType.Notify,
      timestamp: { unsigned: false, low: 0, high: 0 },
      statustransfrom: { unsigned: false, low: 0, high: 0 },
      statustransto: { unsigned: false, low: 0, high: 0 },
      id: { unsigned: false, low: 0, high: 0 },
      transfromNotify: {},
    } as yuzhitalkproto;
    connector.user.getSubscription().handle(id, notify);
  }

  acks(id: Long, connector: Connector) {
    const ack = {
      messageType: MessageType.Ack,
      timestamp: { unsigned: false, low: 0, high: 0 },
      statustransfrom: { unsigned: false, low: 0, high: 0 },
      statustransto: { unsigned: false, low: 0, high: 0 },
      id: { unsigned: false, low: 0, high: 0 },
      transfromAck: { ack: "ok" },
    } as yuzhitalkproto;
    connector.user.getSubscription().handle(id, ack);
  }

  handleSource(source: yuzhitalkproto, connector: Connector) {
    if (![MessageType.Ack, MessageType.Notify].includes(source.messageType)) {

      let session: Session = this.sessionServer.getSession(new Long(1));

      if (!session) {
        session = this.instantiationService.createInstance(SingleSession, new Long(1), connector.user, interToLong(source.statustransto));
      }
      const transformation = new Transformation(new Long(1), source, interToLong(source.statustransfrom), interToLong(source.statustransto));

      transformation.onDidEndlongRetry((data) => {
        this.transmit(Long.fromNumber(1), data.context, connector);
      });
      transformation.onDidacrossRetry((data) => {
        this.transmit(Long.fromNumber(1), data.context, connector);
      });

      session.registerTransition(transformation);
      transformation.start();
      return;
    }

    if (source.messageType === MessageType.Ack) {

    }
  }
}
