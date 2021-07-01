import { IDisposable } from 'yuzhi/common/lifecycle';
import { Event, Emitter, } from 'yuzhi/common/event';
import { IUnique } from 'yuzhi/protocol/common/selfdictionary';

export interface IUserWatcher<T> extends IDisposable, IUnique<T> {
    // readonly onDidUserAdded: Event<T>;
    readonly onDidUserRemoved: Event<T>;
}

export class User implements IUserWatcher<string>{

    constructor(
        private readonly userId: string
    ) { }

    // private _onDidUserAddedEmitter = new Emitter<number>();
    // onDidUserAdded: Event<number> = this._onDidUserAddedEmitter.event;
    private _ononDidUserRemovedEmitter = new Emitter<string>();
    onDidUserRemoved: Event<string> = this._ononDidUserRemovedEmitter.event;

    Unique(): string {
        return this.userId;
    }

    dispose(): void {
        this.keepLive !== undefined && clearTimeout(this.keepLive);
        this._ononDidUserRemovedEmitter.fire(this.Unique());
    }

    private keepLive?: NodeJS.Timeout;
}

