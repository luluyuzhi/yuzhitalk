import { SelfDictionary } from "yuzhi/utility/SelfDictionary";
import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { ICommonPropsHandler, VirtualUser } from "./user";

interface IUserManagerServer<T> {
  getUser(target: T): Promise<ICommonPropsHandler<T>>;

  registerSelf(self: ICommonPropsHandler<T>): void;
}

export const IUserManagerServerIDNumber = createDecorator<
  IUserManagerServer<number>
>("UserManagerServerIDNumber");
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
export class UserManagerServer<T> implements IUserManagerServer<T> {
  core: SelfDictionary<T, ICommonPropsHandler<T>> = new SelfDictionary<
    T,
    ICommonPropsHandler<T>
  >();
  constructor() {}

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
