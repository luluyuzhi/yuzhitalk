import { SelfDictionary } from "yuzhi/utility/SelfDictionary";
import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { ICommonPropsHandler } from "../common";
import { VirtualUser } from "../VirtualUser";

export interface IUserManagerServer<T> {
  readonly _serviceBrand: undefined;
  getUser(target: T): Promise<ICommonPropsHandler<T>>;
  registerSelf(self: ICommonPropsHandler<T>): void;
}

export const IUserManagerServer = createDecorator<IUserManagerServer<number>>(
  "UserManagerServerIDNumber"
);
export const IUserManagerServerIDString = createDecorator<
  IUserManagerServer<string>
>("UserManagerServerIDString");
export const IUserManagerServerIDObject = createDecorator<
  IUserManagerServer<object>
>("UserManagerServerIDObject");

// User Manager 服务
// 维持所有的用户信息
// 1. 创建虚拟 user
// 2. 承担着数据的维护
export class UserManagerServer<T = number> implements IUserManagerServer<T> {
  declare readonly _serviceBrand: undefined;

  core: SelfDictionary<T, ICommonPropsHandler<T>> = new SelfDictionary<
    T,
    ICommonPropsHandler<T>
  >();

  registerSelf(user: ICommonPropsHandler<T>): void {
    if (this.core.has1(user)) {
      throw new Error("User already exists.");
    }
    this.core.set(user);
  }

  getUser(target: T): Promise<ICommonPropsHandler<T>> {
    if (this.core.has(target)) {
      return Promise.resolve(this.core.get(target));
    } else {
      return this.createVirtualUser(target);
    }
  }

  private createVirtualUser(self: T): Promise<ICommonPropsHandler<T>> {
    let virtualUser = new VirtualUser<T>(self);
    this.core.set(virtualUser);
    return Promise.resolve(virtualUser);
  }
}
