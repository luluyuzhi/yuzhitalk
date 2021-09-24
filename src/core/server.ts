import {
  createDecorator,
  IInstantiationService,
} from "yuzhi/instantiation/common/instantiation";
import { TLSSocket, createServer, Server } from "tls";
import { IProtocol } from "yuzhi/protocol/protocol";
import * as assert from "assert";
import { Connector } from "./connector";
import { ServerImp } from "../common/serverimp";

export interface IServer {
  readonly _serviceBrand: undefined;
  Start(): void;
}

// 在 typescript 中也有一个 NodeFactory: createDecorator
export const IServer = createDecorator<IServer>("mainService");

export class NetService extends ServerImp implements IServer {
  declare readonly _serviceBrand: undefined;

  private server: Server;
  public constructor(
    private options: unknown,
    @IInstantiationService instantiationService: IInstantiationService,
    @IProtocol protocol: IProtocol
  ) {
    super();
    this.server = createServer(this.options, (socket: TLSSocket) => {
      const connector = instantiationService.createInstance(Connector, socket);

      socket.pause(); // 暂停接收 (nodejs default)
      console.log(
        "server connected",
        socket.authorized ? "authorized" : "unauthorized"
      );

      socket.on("readable", () => {
        assert.ok(!socket.readableEncoding, "无解码格式");
        assert.ok(!socket.readableFlowing);
        assert.ok(!socket.writableObjectMode);
        const message = this.Buffer(socket);
        if (message == null) return;

        console.log(
          "ip",
          socket.remoteAddress,
          "port",
          socket.remotePort,
          "server received",
          message
        );

        !connector.Authed
          ? protocol.handleProtocol(message.subarray(1), connector)
          : connector.auth().then((value) => {
              console.log(value);
            });
      });

      socket.on("error", function (e: Error) {
        console.log("ip ", socket.remoteAddress, "error ", e.message);
      });

      socket.on("end", (reason) => {
        console.log(reason);
      });
    });

    this.init();
  }

  private init() {
    this.server.on("end", () => {});
    this.server.on("error", function (e) {
      console.log(e);
    });
  }

  Start(): void {
    /* process.env["npm_package_config_port"] as unknown as number */
    this.server.listen(8080, () => {
      console.log("server bound", process.env["npm_package_config_port"]);
    });
  }
}
