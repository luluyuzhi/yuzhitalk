import { EventObject, interpret, Interpreter } from "xstate";
import { Emitter, Event } from "../common/event";
import { manich, IExtreContext } from "./statemachine";

interface IState {
  entryEndlong(): void;
  retryEndlong(): void;
  retryAcross(): void;
}

export abstract class State implements IState {

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
        endlong_retry: this.endlongRetry.bind(this),
        across_retry: this.acrossRetry.bind(this),
        handle_notify: this.handleNotify.bind(this),
      },
    });

    this.yuStatesService = interpret(yuStates).onTransition((state, event) => {
      if (state.matches({ endlong: "handle" })) { }
    });
    this.yuStatesService.subscribe();
  }

  public notifyEndlog() {
    if (this.yuStatesService.state.matches({ endlong: "handle" })) {
      this.yuStatesService.send("notify");
      return;
    }
    console.log('ignore message');
  }

  start(): void {
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
  abstract handleNotify(context: IExtreContext, event: any): void;
}
