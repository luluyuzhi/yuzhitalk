import { IUnique, SelfDictionary } from 'yuzhi/utility/SelfDictionary';
import { createDecorator } from 'yuzhi/instantiation/common/instantiation';
import { User } from './user';


interface IUserManagerServer<T> {

    getUser(target: T): Promise<User<T>>;

    registerSelf(self :User<T>): void;
}

export const IUserManagerServerIDNumber = createDecorator<IUserManagerServer<number>>('UserManagerServerIDNumber');
export const IUserManagerServerIDString = createDecorator<IUserManagerServer<string>>('UserManagerServerIDString');
export const IUserManagerServerIDObject = createDecorator<IUserManagerServer<object>>('UserManagerServerIDObject');

// User Manager 服务
// 维持所有的用户信息
// 1. 创建虚拟 user
// 2. 承担着数据的维护
export class UserManagerServer<T> implements IUserManagerServer<T> {

    users: SelfDictionary<T, User<T>> = new SelfDictionary<T, User<T>>();
    virtualUsers: SelfDictionary<T, User<T>> = new SelfDictionary<T, User<T>>();
    constructor() { }

    registerSelf(user: User<T>): void {
        if (this.users.has1(user)) {
            throw new Error('User already exists.');
        }
        this.users.set(user);
    }

    getUser(target: T): Promise<User<T>> {
        if (this.users.has(target)) {
            return Promise.resolve(this.users.get(target));
        }
        else {
            return this.createVirtualUser(target);
        }
    }

    private createVirtualUser(self: T): Promise<User<T>> {
        let virtualUser = new User<T>(self);
        this.virtualUsers.set(virtualUser);
        return Promise.resolve(virtualUser);
    }
}