import { User } from "../user/User";
import { IUnique, SelfDictionary } from "yuzhi/utility/SelfDictionary";
import { Subscription } from "../subscription/Subscription";
import { Transformation } from './Transformation';
import Long = require("long");
import { ISessionServer } from "./SessionServer";
import { IUserService } from "yuzhi/user/server/UserServer";


interface ISession {
  registerTransition(transformation: Transformation): void;
  undockTransition(transformation: Transformation): void;
  has(id: Long): Transformation | undefined;
}

export interface IChannel extends IUnique<Long> {

  registerTransition(transformation: Transformation);
  inject(context: any);
}

export class Session implements IUnique<string>, ISession {

  private transformations = new SelfDictionary<Long, Transformation>();

  constructor(
    private ids: Long[],
    @ISessionServer private sessionServer: ISessionServer,
    private sessionType: "singleChat" | "groupChat" = 'singleChat',
  ) {
    sessionServer.registerSession(this);
  }

  undockTransition(transformation: Transformation): void {
    throw new Error("Method not implemented.");
  }

  registerTransition(transformation: Transformation) {
    if (!this.transformations.has1(transformation)) {
      this.transformations.set(transformation);
      return;
    }
    throw new Error("transformation repetition");
  }

  has(id: Long): Transformation | undefined {
    return this.transformations.get(id);
  }

  Unique() {
    return this.sessionServer.generateSessionId(this.ids, this.sessionType);
  }
}

export class SingleSession extends Session {

  constructor(
    private creater: User,
    private pointer: User | IUnique<Long>,
    @ISessionServer sessionServer: ISessionServer,
    @IUserService private userService: IUserService
  ) {
    super([creater.Unique(), pointer.Unique()], sessionServer, 'singleChat');
    const self = this;
    this.creater.getSubscription().registerChannel(
      new class implements IChannel {
        Unique() {
          if (self.pointer instanceof Long) {
            return self.pointer;
          }
          return self.pointer.Unique();
        }

        registerTransition(transformation: Transformation) {
          self.registerTransition(transformation);
        }

        inject(context: any) {
          if (self.pointer instanceof User) {
            self.pointer.handle(context);
            return;
          }
          const user = self.userService.getUser(self.pointer.Unique());
          user.handle(context);
        }
      }
    );
  }
}

class SeriesSession extends Session {

  constructor(id: Long,
    @ISessionServer sessionServer: ISessionServer,) {
    super([id], sessionServer, 'groupChat');
  }
};