import {
  createDecorator,
  IInstantiationService,
} from "yuzhi/instantiation/common/instantiation";
import { Connector } from "../../core/connector";
import { ICommonProps } from "../common";
import { OnlionUser, User, VirtualUser } from "../User";
import { ICommonPropsHandlerCollection } from "./CommonPropsHandlerServer";

export interface IUserService extends ICommonProps {
  readonly _serviceBrand: undefined;
  createUser(userId: Long, connector: Connector): User;
  getUser(userId: Long): User;
}

export const IUserService = createDecorator<IUserService>("IUserService");

export class UserService implements IUserService {
  declare readonly _serviceBrand: undefined;

  constructor(
    @ICommonPropsHandlerCollection
    private commonPropsHandlerCollection: ICommonPropsHandlerCollection,
    @IInstantiationService private instantiationService: IInstantiationService
  ) {}

  createUser(userId: Long, connector: Connector) {
    const user = this.instantiationService.createInstance(
      OnlionUser,
      userId,
      connector
    );
    const key = `yuzhi://user:yu@.com:${userId}`;
    this.commonPropsHandlerCollection.registerCommonPropsHandler(key, user);
    return user;
  }

  getUser(userId: Long) {
    const user = this.commonPropsHandlerCollection.getCommonPropsHandler(
      `yuzhi://user:yu@.com:${userId}`
    ) as User | undefined;
    return user ?? this.createVirtualUser(userId);
  }

  private createVirtualUser(userId: Long) {
    const user = this.instantiationService.createInstance(VirtualUser, userId);
    this.commonPropsHandlerCollection.registerCommonPropsHandler(
      `yuzhi://user:yu@.com:${userId}`,
      user
    );
    return user;
  }
}
