import { createDecorator } from 'yuzhi/instantiation/common/instantiation';
import { TLSSocket, createServer, Server } from 'tls';
import { IProtocol } from 'yuzhi/protocol/protocol';

export interface IServer {
    readonly _serviceBrand: undefined;
    Start(): void;
}

// 在 typescript 中也有一个 NodeFactory: createDecorator
export const IServer = createDecorator<IServer>('mainService');

export class NetService implements IServer {
    declare readonly _serviceBrand: undefined;

    private server!: Server;
    public constructor(private options: unknown, @IProtocol protocol: IProtocol) {
        this.server = createServer(options, (socket: TLSSocket) => {
            console.log('server connected',
                socket.authorized ? 'authorized' : 'unauthorized');
            socket.on('data', (message: Buffer | string | String) => {
                if (typeof message === 'string' || message instanceof String) {
                    //error: only support buffer type
                    socket.end();
                    return;
                }
                const body = protocol.handleProtocol(message);
                
                socket.write(message);
                // whats mean？
                socket.pipe(socket);
            });
        });

        this.init();
    }

    private init() {
        this.server.on("end", () => { });
    }

    Start(): void {
        /* process.env["npm_package_config_port"] as unknown as number */
        this.server.listen(8080, () => {
            console.log("server bound", process.env["npm_package_config_port"]);
        });
    }
}