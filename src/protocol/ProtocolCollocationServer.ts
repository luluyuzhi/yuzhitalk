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
import { User } from "yuzhi/user/User";
import { IUserService } from "yuzhi/user/server/UserServer";
import { ILogeServer } from "yuzhi/log";

export function $L<T extends ILong>(e: T | undefined) {
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
    @ISessionServer private sessionServer: ISessionServer,
    @IUserService private userService: IUserService,
    @ILogeServer private logeServer: ILogeServer,
  ) { }

  /**
   * 
   * @param id 接受者id
   * @param content 消息内容 
   * @param connector 发起者
   */
  transmit(id: Long, content: yuzhitalkproto, connector: Connector) {
    [content.statustransfrom, content.statustransto] = [
      content.statustransto,
      content.statustransfrom,
    ];
    const protobuf = encodeyuzhitalkproto(content);
    connector.user.getSubscription().handle(id, Buffer.from(protobuf));
  }

  /**
   * 
   * @param id  接受者id
   * @param timestamp 消息时间戳
   * @param connector 发起者
   * @param globalsId 消息全局 id，可选
   */
  notify(id: Long, timestamp: Long, connector: Connector, globalsId?: Long) {
    const notify = {
      messageType: MessageType.Notify,
      timestamp: timestamp,
      statustransfrom: { unsigned: false, low: 0, high: 0 },
      statustransto: { unsigned: false, low: 0, high: 0 },
      id: globalsId ?? { unsigned: false, low: 0, high: 0 },
      transfromNotify: {},
    } as yuzhitalkproto;
    connector.user.getSubscription().handle(id, notify);
  }

  notify1(timestamp: Long, connector: Connector, globalsId?: Long) {
    const notify = {
      messageType: MessageType.Notify,
      timestamp: timestamp,
      statustransfrom: { unsigned: false, low: 0, high: 0 },
      statustransto: { unsigned: false, low: 0, high: 0 },
      id: globalsId ?? { unsigned: false, low: 0, high: 0 },
      transfromNotify: {},
    } as yuzhitalkproto;
    const protobuf = encodeyuzhitalkproto(notify);
    connector.send(Buffer.from(protobuf));
  }

  ack(id: Long, timestamp: Long, connector: Connector, globalsId?: Long) {
    const ack = {
      messageType: MessageType.Ack,
      timestamp: timestamp,
      statustransfrom: { unsigned: false, low: 0, high: 0 },
      statustransto: { unsigned: false, low: 0, high: 0 },
      id: globalsId ?? { unsigned: false, low: 0, high: 0 },
      transfromAck: { ack: "ok" },
    } as yuzhitalkproto;
    const protobuf = encodeyuzhitalkproto(ack);
    connector.user.getSubscription().handle(id, protobuf);
  }

  ack1(timestamp: Long, connector: Connector, globalsId?: Long) {
    const ack = {
      messageType: MessageType.Ack,
      timestamp: timestamp,
      statustransfrom: { unsigned: false, low: 0, high: 0 },
      statustransto: { unsigned: false, low: 0, high: 0 },
      id: globalsId ?? { unsigned: false, low: 0, high: 0 },
      transfromAck: { ack: "ok" },
    } as yuzhitalkproto;
    const protobuf = encodeyuzhitalkproto(ack);
    connector.send(Buffer.from(protobuf));
  }

  handleSource(source: yuzhitalkproto, connector: Connector) {

    const loger = this.logeServer;

    loger.debug("message from", `${$L(source.statustransfrom)}`, "message to", `${$L(source.statustransto)}`, "message type is", source.messageType);

    //#region test
    connector.user = this.userService.createUser($L(source.statustransfrom), connector);
    //#endregion test

    const ids = [$L(source.statustransfrom), $L(source.statustransto)];
    const sessionId = this.sessionServer.generateSessionId(ids, 'singleChat');
    const transformationId = $L(source.timestamp);

    let session = this.sessionServer.getSession(sessionId);
    if (![MessageType.Ack, MessageType.Notify].includes(source.messageType)) {

      if (!session) {
        session = this.instantiationService.createInstance(SingleSession,
          connector.user, { Unique() { return $L(source.statustransto); } });
        this.sessionServer.registerSession(session);

      } else if (!!session?.has(transformationId)) {
        session.has(transformationId).notifyEndlog();
        return;
      }

      const transformation = new Transformation(transformationId, source, ids[0], ids[1]);
      this.transformationHandle(transformation, connector);
      session.registerTransition(transformation);
      transformation.start();
      return;
    }

    if (!session) return;
    const transformation = session.has(transformationId);
    if (source.messageType === MessageType.Ack) {
      transformation?.entryEndlong();
    }
  }

  private transformationHandle(t: Transformation, connector: Connector) {
    t.onDidEndlongRetry((data) => {
      this.transmit(data.sender, data.context.data, connector);
      this.ack1(data.context.data.timestamp, connector, data.context.data.id);
    });
    t.onDidacrossRetry((data) => {
      this.notify1(data.context.data.timestamp, connector, data.context.data.id);
      this.ack(data.context.data.statustransto, data.context.data.timestamp, connector, data.context.data.id);
    });

    t.onDidhandleNotify((data) => {
      this.ack1(data.context.data.timestamp, connector, data.context.data.id);
    });
  }
}
