import { IDisposable } from 'yuzhi/common/lifecycle';
import { Event, Emitter, } from 'yuzhi/common/event';
import { IUnique } from 'yuzhi/utility/SelfDictionary';
import { Socket } from 'net';
import { ICycleElem } from '../utility/cycle';

interface IContentHandler {
    handle(status: string): void;
}

export interface ICommonPropsHandler<T> extends IUnique<T>, IContentHandler, ICycleElem<T> {

}

// 1. 通过 userId 自初始化， user 处于业务层， 它与数据库隔离。
// 2. 通过 userId / group 找到 user / group 甚至其他的 key 能找到 类似 user group的服务
// 3. user 不一定与 当前在线用户 一一对应 ，可以是一个离线用户，也可以是一个在线用户。 因此 它有可能具有临时状态。
// 4. user 属于谁， user 属于 userServer
export class User<T> implements ICommonPropsHandler<T> {

    constructor(
        private readonly userId: T,
        private socket: Socket,
    ) { }

    handle(status: string): void {
        throw new Error('Method not implemented.');
    }

    Unique(): T {
        return this.userId;
    }

    dispose(): void {
        this.socket.end();
    }
}

export class VirtualUser<T> implements ICommonPropsHandler<T> {
    constructor(
        private readonly userId: T,
    ) { }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    handle(status: string): void {
        throw new Error('Method not implemented.');
    }

    Unique(): T {
        return this.userId;
    }

    private liveTag: NodeJS.Timeout = setTimeout(() => {
        this.dispose();
    }, 10000);
}

export class Group<T> implements ICommonPropsHandler<T> {

    private handlers: (ICommonPropsHandler<T> | T)[] = [];

    constructor(
        private readonly groupId: T,
    ) { }

    Unique() { return this.groupId; };

    dispose(): void {
        throw new Error('Method not implemented.');
    }

    handle(status: string): void {
        throw new Error('Method not implemented.');
    }
}