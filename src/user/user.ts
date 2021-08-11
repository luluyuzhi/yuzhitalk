import { IDisposable } from 'yuzhi/common/lifecycle';
import { Event, Emitter, } from 'yuzhi/common/event';
import { IUnique } from 'yuzhi/utility/SelfDictionary';

interface IContentHandler {
    handle(status: string): void;
}

// export interface IUserWatcher<T> extends IDisposable,  {
//     // readonly onDidUserAdded: Event<T>;
//     readonly onDidUserRemoved: Event<T>;
// }


// 1. 通过 userId 自初始化， user 处于业务层， 它与数据库隔离。
// 2. 通过 userId / group 找到 user / group 甚至其他的 key 能找到 类似 user group的服务
// 3. user 不一定与 当前在线用户 一一对应 ，可以是一个离线用户，也可以是一个在线用户。 因此 它有可能具有临时状态。
export class User<T> implements IUnique<T>, IContentHandler {

    constructor(
        private readonly userId: T
    ) { }


    handle(status: string): void {
        throw new Error('Method not implemented.');
    }

    // // private _onDidUserAddedEmitter = new Emitter<number>();
    // // onDidUserAdded: Event<number> = this._onDidUserAddedEmitter.event;
    // private _ononDidUserRemovedEmitter = new Emitter<string>();
    // onDidUserRemoved: Event<string> = this._ononDidUserRemovedEmitter.event;

    Unique(): T {
        return this.userId;
    }

    // dispose(): void {
    //     this.keepLive !== undefined && clearTimeout(this.keepLive);
    //     this._ononDidUserRemovedEmitter.fire(this.Unique());
    // }

    // private keepLive?: NodeJS.Timeout;
}


export class Group<T> implements IContentHandler {

    private users: User<T>[] = [];

    handle(status: string): void {
        throw new Error('Method not implemented.');
    }
}