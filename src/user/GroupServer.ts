import { ICommonProps } from './common';
import { IUserManagerServerIDNumber, UserManagerServer } from './UserManagerServer';

interface IGroupService extends ICommonProps{

    
}

class GroupService implements IGroupService {

    constructor( @IUserManagerServerIDNumber private userManageruserService: UserManagerServer<number>) {}
    
    
    sendMessage(id: number, message: string): void {
        throw new Error('Method not implemented.');
        // this.userManageruserService.getUser(id).sendMessage(message);
    }
    
    recallMessage(id: number): void {
        throw new Error('Method not implemented.');
        //this.userManageruserService.getUser(id).recallMessage();
    }
}

export = GroupService;