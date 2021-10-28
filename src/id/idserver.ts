import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import * as Long from "long";

export interface IIdServer {
  readonly _serviceBrand: undefined;
  gen(): Long;
}
export const IIdServer = createDecorator<IIdServer>("IIdServer");
export class IdService implements IIdServer {
  _serviceBrand: undefined;

  constructor() {}

  gen() {
    return new Long(0);
  }
}
