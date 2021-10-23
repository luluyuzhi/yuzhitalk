import { EventObject, interpret, Interpreter } from "xstate";
import { Emitter, Event } from "../common/event";
import { manich, IExtreContext } from "./statemachine";

interface IState {
  entryEndlong(): void;
  retryEndlong(): void;
  retryAcross(): void;
}

export abstract class State implements IState {
  private readonly _onDidChangeZoomLevel = new Emitter<number>();
  public readonly onDidChangeZoomLevel: Event<number> =
    this._onDidChangeZoomLevel.event;

  private yuStatesService: Interpreter<
    Record<string, any>,
    any,
    EventObject,
    {
      value: any;
      context: Record<string, any>;
    }
  >;

  constructor(content: any) {
    let yuStates = manich();
    yuStates = yuStates.withContext({
      data: content,
      ...yuStates.context,
    });
    yuStates = yuStates.withConfig({
      actions: {
        endlong_retry: this.endlongRetry,
        across_retry: this.acrossRetry,
      },
    });

    this.yuStatesService = interpret(yuStates).onTransition((state, event) => {
      console.log(state);
    });
    this.yuStatesService.subscribe();
    this.yuStatesService.start();
    this.yuStatesService.send("idle");
  }

  public entryEndlong() {
    this.yuStatesService.send("continue");
  }

  public retryEndlong() {
    this.yuStatesService.send("NEXT");
  }

  public retryAcross() {
    this.yuStatesService.send("inter");
  }

  abstract endlongRetry(context: IExtreContext, event: any): void;
  abstract acrossRetry(context: IExtreContext, event: any): void;
}
