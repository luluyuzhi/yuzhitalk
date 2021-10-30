import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { ICommonPropsHandler } from "../common";

type unique_type = Long;
type key_type = string;

export interface ICommonPropsHandlerCollection {
  readonly _serviceBrand: undefined;

  registerCommonPropsHandler(
    key: key_type,
    handler: ICommonPropsHandler<unique_type>
  ): Error;
  getCommonPropsHandler(
    key: key_type
  ): ICommonPropsHandler<unique_type> | undefined;
}

export const ICommonPropsHandlerCollection =
  createDecorator<ICommonPropsHandlerCollection>( "ICommonPropsHandlerCollection");

export class ICommonPropsHandlerCollectionServer
  implements ICommonPropsHandlerCollection
{
  declare readonly _serviceBrand: undefined;

  core = new Map<key_type, ICommonPropsHandler<unique_type>>();

  registerCommonPropsHandler(
    key: key_type,
    handler: ICommonPropsHandler<unique_type>
  ): Error {
    if (!this.core.has(key)) {
      this.core.set(key, handler);
      return undefined;
    }
    return new Error("key already exists");
  }

  getCommonPropsHandler(
    key: key_type
  ): ICommonPropsHandler<unique_type> | undefined {
    return this.core.get(key);
  }
}
