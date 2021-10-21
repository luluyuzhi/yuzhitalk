import { createDecorator } from "yuzhi/instantiation/common/instantiation";
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
    @IProtocolCollocationServer
    private collocationServer: IProtocolCollocationServer
  ) {}

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
      return undefined;
    }
    return yuzhiProtocol;
  }
}
