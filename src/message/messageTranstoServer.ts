import { UriProtocolServer } from "yuzhi/uri";
import { createDecorator } from "yuzhi/instantiation/common/instantiation";

export interface Itransfromto {
  transfromto<T>(uri: string, _package: T): Promise<void> | void;
}

export const Itransfromto = createDecorator<Itransfromto>("Itransfromto");

export class MessageTranstoServer implements Itransfromto {
  transfromto<T>(uri: string, _package: T): void | Promise<void> {
    const uriComponents = UriProtocolServer.Parse(uri);
    console.log(uriComponents);
  }
}
