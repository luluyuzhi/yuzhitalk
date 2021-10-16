import { ICommonProps } from "./common";
import { User } from './user';
import {
  IUserManagerServer,
} from "./UserManagerServer";

interface IGroupService extends ICommonProps { }

class GroupService implements IGroupService {
  constructor(
    @IUserManagerServer
    private userManagerServer: IUserManagerServer<number>
  ) { }
  getUser(id: number): Promise<User<number>> {
    throw new Error('Method not implemented.');
  }

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
