import { ICommonProps } from './common';
import { IUserManagerServerIDNumber, UserManagerServer } from './UserManagerServer';

interface IUserService extends ICommonProps { }

class UserService implements IUserService {

    constructor(@IUserManagerServerIDNumber private userManageruserService: UserManagerServer<number>) { }

    sendMessage(id: number, message: string): void {
        throw new Error('Method not implemented.');
        // this.userManageruserService.getUser(id).sendMessage(message);
    }

    recallMessage(id: number): void {
        throw new Error('Method not implemented.');
        //this.userManageruserService.getUser(id).recallMessage();
    }
}

export = UserService;