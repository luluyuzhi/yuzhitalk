import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { ILogeServer } from "yuzhi/log";
import { Connector } from "../core/connector";
import {
  yuzhitalkproto as YuzhitalkProto,
  decodeyuzhitalkproto,
} from "./normal";
import { IProtocolCollocationServer } from "./ProtocolCollocationServer";

export interface IProtocol {
  readonly _serviceBrand: undefined;
  handleProtocol(content: Buffer, socket: Connector): void;
}

export const IProtocol = createDecorator<IProtocol>("yuzhiProtocol");

export class Protocol implements IProtocol {
  declare readonly _serviceBrand: undefined;

  constructor(
    @IProtocolCollocationServer private collocationServer: IProtocolCollocationServer,
    @ILogeServer private logeServer: ILogeServer
  ) { }

  public handleProtocol(content: Buffer, connector: Connector) {
    const yuzhiProtocol = this.decode(content);
    if (!yuzhiProtocol) {
      return;
    }
    this.collocationServer.handleSource(yuzhiProtocol, connector);
  }

  private decode(content: Buffer): YuzhitalkProto | undefined {
    let yuzhiProtocol: YuzhitalkProto;
    try {
      yuzhiProtocol = decodeyuzhitalkproto(content);
    } catch (e) {
      this.logeServer
        .new(() => { }, __filename)
        .warn(`decode yuzhitalkproto error: ${e}`);
      return undefined;
    }
    return yuzhiProtocol;
  }
}
