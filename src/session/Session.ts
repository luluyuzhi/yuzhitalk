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

export class Session implements IUnique<Long>, ISession {

  private transformations = new SelfDictionary<Long, Transformation>();

  constructor(
    private id: Long,
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
    return this.id;
  }
}

export class SingleSession extends Session {

  constructor(id: Long,
    private creater: User,
    private pointer: User | Long,  // IUnique<Long>,
    @ISessionServer sessionServer: ISessionServer,
    @IUserService private userService: IUserService
  ) {
    super(id, sessionServer, 'singleChat');
    const self = this;
    this.creater.getSubscription().registerChannel(
      new class implements IChannel {
        Unique() {
          if (self.pointer instanceof Long) {
            return self.pointer;
          }
          return self.pointer.Unique() as unknown as Long;
        }

        registerTransition(transformation: Transformation) {
          self.registerTransition(transformation);
        }

        inject(context: any) {
          if (self.pointer instanceof Long) {
            const user = self.userService.getUser(self.pointer as unknown as number);
            user.handle(context);
            return;
          }
          self.pointer.handle(context);
        }
      }
    );
  }
}

class SeriesSession extends Session {

  constructor(id: Long,
    @ISessionServer sessionServer: ISessionServer,) {
    super(id, sessionServer, 'groupChat');
  }
}