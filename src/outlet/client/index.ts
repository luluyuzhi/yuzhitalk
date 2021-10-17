//https://zhuanlan.zhihu.com/p/163705754
import { GrpcObject, loadPackageDefinition, credentials } from "@grpc/grpc-js";
import {
  AuthStatus as IAuthStatus,
  AuthToken as IAuthToken,
  decodeAuthToken,
} from "../../protocol/auth";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import { ServiceClientConstructor } from "@grpc/grpc-js/build/src/make-client";
import { createDecorator } from "yuzhi/instantiation/common/instantiation";
export interface IRemoteAuthServer {
  readonly _serviceBrand: undefined;
  auth(authToken: IAuthToken): IAuthStatus;
  authAsync(authToken: IAuthToken): Promise<IAuthStatus>;
  decodeAuthToken(authToken: Uint8Array): IAuthToken;
}

export const IRemoteAuthServer =
  createDecorator<IRemoteAuthServer>("RemoteAuthServer");
export class RemoteAuthServer implements IRemoteAuthServer {
  declare readonly _serviceBrand: undefined;
  private static readonly PROTO_PATH = path.join(__dirname, "auth.proto");
  private static packageDefinition = protoLoader.loadSync(
    RemoteAuthServer.PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );
  private protoDescriptor = loadPackageDefinition(
    RemoteAuthServer.packageDefinition
  ).Auth;

  private client = new ((this.protoDescriptor as GrpcObject)[
    "Cat"
  ] as ServiceClientConstructor)(
    `${process.env.REMOTE_AUTH_SERVER_IP}:${process.env.REMOTE_AUTH_SERVER_PROT}`,
    credentials.createInsecure()
  );

  public authAsync(authToken: IAuthToken): Promise<IAuthStatus> {
    return new Promise((resolve, reject) => {
      this.client.Auth(authToken, (err: any, status: IAuthStatus) => {
        if (err) {
          reject(err);
        } else {
          resolve(status);
        }
      });
    });
  }

  public auth(authToken: IAuthToken): IAuthStatus {
    throw new Error("Method not implemented.");
  }

  public decodeAuthToken(authToken: Uint8Array): IAuthToken {
    return decodeAuthToken(authToken);
  }
}
