import { TLSSocket } from "tls";
import { IInstantiationService } from "yuzhi/instantiation/common/instantiation";
import { IRemoteAuthServer } from "yuzhi/outlet/client";
import { User } from "yuzhi/user/User";
import { IUserService } from "yuzhi/user/server/UserServer";

export interface IConnector {
  auth(s: Buffer): Promise<boolean>;
  Disconnect(): void;
}

export class Connector implements IConnector {
  public constructor(
    private socket: TLSSocket,
    @IRemoteAuthServer private remoteAuthServer: IRemoteAuthServer,
    @IUserService private userService: IUserService,
    @IInstantiationService private instantiationService: IInstantiationService // @IAuthServer private authServer: IAuthServer // @IUserService userService
  ) { }

  public user?: User;

  get Authed() {
    return this.user != null;
  }

  send(s: Buffer) {
    this.socket.write(s);
    process.stdin.pipe(this.socket);
    process.stdin.resume();
  }

  async auth(s: Buffer): Promise<boolean> {
    try {
      const token = this.remoteAuthServer.decodeAuthToken(s);
      const authStatus = await this.remoteAuthServer.authAsync(token);
      if (authStatus.code.low == 0) {
        return true;
      }
      this.user = this.userService.createUser(6, this);
    } catch {
      this.socket.end();
      return false;
    }
    return true;
  }

  Disconnect() {
    this.socket.end();
  }
}
