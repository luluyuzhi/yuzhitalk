
import { State } from '../state';
import { IExtreContext } from '../statemanich';

export class State1 extends State {
    endlongRetry(context: IExtreContext, event: any): void {
        console.log(context);
    }
    acrossRetry(context: IExtreContext, event: any): void {
        console.log(context);
    }
    constructor(content: any) {
        super(content);
    }
}