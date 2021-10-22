import { interpret } from 'xstate';
import { Emitter, Event } from '../common/event';
import { manich, IExtreContext } from './statemanich';

export abstract class State {

    private readonly _onDidChangeZoomLevel = new Emitter<number>();
    public readonly onDidChangeZoomLevel: Event<number> = this._onDidChangeZoomLevel.event;

    private yuStatesService;
    constructor(content: any) {
        let yuStates = manich();
        yuStates = yuStates.withContext(
            {
                data: content,
                ...yuStates.context
            }
        );
        yuStates = yuStates.withConfig(
            {
                actions: {
                    endlong_retry: this.endlongRetry,
                    across_retry: this.acrossRetry,
                },

            }
        );
        
        this.yuStatesService = interpret(yuStates).onTransition((state, event) => {
            console.log(state.value, event.type);
        });

        this.yuStatesService.start();
        this.yuStatesService.send('idle');
    }

    public entryEndlong() {
        this.yuStatesService.send(
            'continue'
        );
    }
    abstract endlongRetry(context: IExtreContext, event: any): void;
    abstract acrossRetry(context: IExtreContext, event: any): void;
}