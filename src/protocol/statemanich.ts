import { createMachine, interpret, send, assign } from "xstate";
interface IExtreContext {
  main: any;
}

interface IContext extends IExtreContext {
  retry: number;
  notify: number;
  second_retry: number;
}

function glassIsFull(context: IContext, _event: any) {
  return context.retry < 3;
}

function glassIsFull2(context: IContext, _event: any) {
  return context.second_retry < 3;
}

export const yuStates = createMachine<IContext>(
  {
    id: "yustates",
    context: {
      main: "",
      retry: 1,
      notify: 0,
      second_retry: 0,
    },
    states: {
      first: {
        initial: "idle",
        states: {
          idle: {
            on: {
              click: "handle",
            },
          },
          zhi: {
            activities: ["beeping"],
            entry: [send("reset", { delay: 10 })],
            on: {
              reset: "handle",
            },
            onExit: [
              "retry",
              assign({ retry: (context) => context.retry + 1 }),
            ],
          },

          handle: {
            on: {
              POWER: { target: "#yustates.second.hist" },
            },
            after: {
              RETRY_DELAY: { target: "zhi", cond: "glassIsFull" },
              YELLOW_LIGHT_DELAY: { target: "error" },
            },
          },
          error: {
            type: "final",
          },
        },
      },
      second: {
        initial: "critical",
        states: {
          critical: {
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
                    second_retry: (context) => context.second_retry + 1,
                  }),
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
          NEXT: { target: "first.handle", in: "second.critical" },
        },
      },
    },
    on: {
      inter: { target: "second.yu", in: "second.critical" },
      idle: { target: "first.idle" },
    },
  },
  {
    actions: {
      retry: (context, event) => {},
    },
    // String delays configured here
    delays: {
      RETRY_DELAY: (context, event) => {
        return context.retry * 1000 + 500;
      },
      YELLOW_LIGHT_DELAY: (context, event) => {
        return 6000 - context.retry * 1000 - 500;
      }, // static value
      FINAL_DELAY: 15000,
      SECOND_RETRY_DELAY: 5000,
    },
    activities: {
      beeping: () => {
        const interval = setTimeout(
          () => yuStates.transition("zhi", { type: "reset" }),
          5000
        );
        return () => clearTimeout(interval);
      },
    },
    guards: { glassIsFull, glassIsFull2 },
  }
);

// 在第二阶段的时候，如果接受到发送方的第一个报文，进入 next 阶段， 仅仅进入第一阶段一次。 自动回到第二阶段
//  critical 用于等待 接收方的 ack 报文，如果接收多次 进入 error 结束
