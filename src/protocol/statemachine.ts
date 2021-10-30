import {
  createMachine,
  send,
  assign,
  ActionObject,
  AnyEventObject,
  StateMachine,
} from "xstate";

export interface IExtreContext {
  data?: any;
}

interface IInterContext {
  _retry: number;
  _second_retry: number;
  _restore: number;
  _next_states: boolean;
}

interface IContext extends IExtreContext, IInterContext { }

function glassIsFull(context: IInterContext, _event: any) {
  return context._retry < 3;
}

function glassIsFull2(context: IInterContext, _event: any) {
  return context._second_retry < 3;
}

function restore(context: IInterContext, _event: any) {
  return context._next_states && context._restore < 3;
}

function nextStates(context: IInterContext, _event: any) {
  return !context._next_states;
}

const interDefaultState = {
  _retry: 1,
  _second_retry: 0,
  _restore: 0,
  _next_states: false,
} as IInterContext;

export const manich = () =>
  createMachine<IContext>(
    {
      id: "yustates",
      context: {
        ...interDefaultState,
      },
      states: {
        endlong: {
          initial: "idle",
          states: {
            idle: {
              always: {
                target: "handle",
              },
            },
            handle: {
              invoke: {
                id: "handle",
                src: (context, event) => (callback, onReceive) => {
                  callback('handle_notify');
                  const id = setInterval(() => callback("INC"), 1000);
                  return () => clearInterval(id);
                },
              },
              on: {
                notify: {
                  target: "handle",
                  actions:['handle_notify'],
                },
                continue: {
                  target: "#yustates.across.hist",
                  cond: "nextStates",
                },
                INC: {
                  cond: (context, event) => context._retry < 3,
                  actions: [
                    assign({ _retry: (context) => context._retry + 1 }),
                    "endlong_retry",
                  ],
                },
              },
              after: {
                0: { target: "#yustates.across.hist", cond: "restore" },
                YELLOW_LIGHT_DELAY: { target: "error" },
              },
            },
            error: {
              type: "final",
            },
          },
        },
        across: {
          initial: "yu",
          states: {
            critical: {
              entry: [
                assign({
                  _next_states: (context) => true,
                }),
              ],
              on: {
                recive: {
                  target: "error",
                },
              },
              after: {
                FINAL_DELAY: { target: "final" },
              },
            },
            yu: {
              entry: [send("reset", { delay: 10 })],
              on: {
                reset: {
                  target: "critical",
                  cond: "glassIsFull2",
                  actions: [
                    assign({
                      _second_retry: (context) => context._second_retry + 1,
                    }),
                    "across_retry",
                  ],
                },
                "*": "error",
              },
            },
            error: {
              type: "final",
            },
            hist: {
              type: "history",
            },
            final: {
              type: "final",
            },
          },
          on: {
            NEXT: {
              onEntry: [
                assign({
                  _restore: (context) => context._restore + 1,
                }),
              ],
              target: "endlong.handle",
              in: "across.critical",
            },
          },
        },
      },
      on: {
        inter: { target: "across.yu", in: "across.critical" },
        idle: { target: "endlong.idle" },
      },
    },
    {
      actions: {
        across_retry: (context, event) => {
          throw new Error("need implements across_retry");
        },
        endlong_retry: (context, event) => {
          throw new Error("need implements endlong_retry");
        },
        handle_notify: (context, event) => {
          throw new Error("need implements handle_notify");
        },
      },
      delays: {
        RETRY_DELAY: (context, event) => {
          return context._retry * 1000 + 500;
        },
        YELLOW_LIGHT_DELAY: (context, event) => {
          return 6000 - context._retry * 1000 - 500;
        }, // static value
        FINAL_DELAY: 15000,
        SECOND_RETRY_DELAY: 5000,
      },
      activities: {
        beeping: () => { },
      },
      guards: { glassIsFull, glassIsFull2, restore, nextStates },
    }
  ) as StateMachine<
    IContext,
    any,
    AnyEventObject,
    {
      value: any;
      context: IContext;
    },
    ActionObject<IContext, AnyEventObject>
  >;
