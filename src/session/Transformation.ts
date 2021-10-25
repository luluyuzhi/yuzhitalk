import * as Long from "long";
import { State } from 'yuzhi/protocol/state';
import { Emitter, Event } from 'yuzhi/common/event';
import { IExtreContext } from '../protocol/statemachine';
import { IUnique } from 'yuzhi/utility/SelfDictionary';


interface ITransformation {
    sender: Long,
    context: any,
}

export class Transformation extends State implements IUnique<Long> {

    private readonly _onDidEndlongRetry = new Emitter<ITransformation>();
    public readonly onDidEndlongRetry: Event<ITransformation> = this._onDidEndlongRetry.event;

    private readonly _onDidacrossRetry = new Emitter<ITransformation>();
    public readonly onDidacrossRetry: Event<ITransformation> = this._onDidacrossRetry.event;

    transformationId: Long;

    Unique() {
        return this.transformationId;
    }

    endlongRetry(context: IExtreContext, event: any): void {
        this._onDidEndlongRetry.fire({
            sender: this.sender,
            context
        });
    }

    acrossRetry(context: IExtreContext, event: any): void {
        this._onDidacrossRetry.fire({
            sender: this.sender,
            context
        });
    }

    constructor(id: Long, mess: any, private sender: Long, private receiver: Long) {
        super(context);
        this.transformationId = id;
    }
}