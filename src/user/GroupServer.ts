import { ICommonProps } from "./common";
import {
  IUserManagerServerIDNumber,
  UserManagerServer,
} from "./UserManagerServer";

interface IGroupService extends ICommonProps {}

class GroupService implements IGroupService {
  constructor(
    @IUserManagerServerIDNumber
    private userManagerServer: UserManagerServer<number>
  ) {}

  sendMessage(id: number, message: string): void {
    throw new Error("Method not implemented.");
    // this.userManagerServer.getUser(id).sendMessage(message);
  }

  recallMessage(id: number): void {
    throw new Error("Method not implemented.");
    //this.userManagerServer.getUser(id).recallMessage();
  }
}

export = GroupService;
