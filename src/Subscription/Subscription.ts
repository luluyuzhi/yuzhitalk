import { User } from 'yuzhi/user/user';
import { IUserService } from 'yuzhi/user/UserServer';
import { Emitter, Event } from '../common/event';

export interface ISubscription {

    addUser(user: number | User<number>);
    removeUser(user: number);
    sendMessage(message: string);

}

export class Subscription implements ISubscription {

    declare readonly _serviceBrand: undefined;

  c

    public constructor(
        private id: number,
        @IUserService private userService: IUserService
    ) { }

    private users: (number | User<number>)[] = [];

    addUser(user: number | User<number>) {
        this.users.push(user);
    }

    removeUser(user: number) {
        this.users = this.users.splice(this.users.indexOf(user), 1);
    }

    sendMessage(message: string) {
        this.users.forEach(async user => {
            if (user instanceof User) {
                user.handle(message);
            } else {
                const userObj = await this.userService.getUser(<number><unknown>user);
                this.users.splice(this.users.indexOf(user), 1);
                this.users.push(userObj);
                userObj.handle(message);
            }
        });
    }
}
