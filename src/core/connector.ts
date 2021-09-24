import { TLSSocket } from "tls";
import { IInstantiationService } from "yuzhi/instantiation/common/instantiation";
import { IRemoteAuthServer } from "yuzhi/outlet/client";
import { User } from "yuzhi/user/user";

export interface IConnector {
  auth(): Promise<boolean>;
  Disconnect(): void;
}

export class Connector implements IConnector {
  public constructor(
    private socket: TLSSocket,
    @IRemoteAuthServer private remoteAuthServer: IRemoteAuthServer,
    @IInstantiationService private instantiationService: IInstantiationService // @IAuthServer private authServer: IAuthServer // @IUserService userService
  ) {}

  public user?: User<number>;

  get Authed() {
    return this.user != null;
  }

  send(s: Buffer) {
    this.socket.write(s, (e) => {
      if (e) {
        console.log("socket send fail, connect break");
        this.Disconnect();
      }
    });
  }

  async auth(): Promise<boolean> {
    try {
      const t = await this.remoteAuthServer.authAsync({ token: "123" });
      this.user = new User(6, this);
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
