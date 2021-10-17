import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { ICommonProps } from "../common";
import { User } from "../User";
import {
  IUserManagerServer,
  // IUserManagerServerIDNumber,
} from "./UserManagerServer";

export interface IUserService extends ICommonProps {
  readonly _serviceBrand: undefined;
}

export const IUserService = createDecorator<IUserService>("IUserService");

export class UserService implements IUserService {
  declare readonly _serviceBrand: undefined;

  constructor(
    @IUserManagerServer
    private userManageruserService: IUserManagerServer<number>
  ) {}

  getUser(id: number): Promise<User<number>> {
    throw new Error("Method not implemented.");
  }

  sendMessage(id: number, message: string): void {
    throw new Error("Method not implemented.");
    // this.userManageruserService.getUser(id).sendMessage(message);
  }

  recallMessage(id: number): void {
    throw new Error("Method not implemented.");
    //this.userManageruserService.getUser(id).recallMessage();
  }
}
