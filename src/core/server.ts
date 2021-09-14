import { createDecorator } from 'yuzhi/instantiation/common/instantiation';
import { TLSSocket, createServer, Server } from 'tls';
import { IProtocol } from 'yuzhi/protocol/protocol';
import * as assert from "assert";

export class Role {

    constructor(private socket: TLSSocket) {

    }

    isAuthed: boolean = false;

    get Authed() {
        return this.isAuthed;
    }


    auth() {

    }
}

export interface IServer {
    readonly _serviceBrand: undefined;
    Start(): void;
}

// 在 typescript 中也有一个 NodeFactory: createDecorator
export const IServer = createDecorator<IServer>('mainService');

export class NetService implements IServer {
    declare readonly _serviceBrand: undefined;

    private server: Server;
    public constructor(private options: unknown, @IProtocol protocol: IProtocol) {
        this.server = createServer(this.options, (socket: TLSSocket) => {


            const role = new Role(socket.ref());

            socket.pause(); // 暂停接收 (nodejs default)
            console.log('server connected',
                socket.authorized ? 'authorized' : 'unauthorized');

            socket.on('readable', () => {
                assert.ok(!socket.readableEncoding, "无解码格式");
                assert.ok(!socket.readableFlowing);
                assert.ok(!socket.writableObjectMode);

                // 这里使用了 nodejs 的 stream 模块中未被暴露的api。
                // BufferList { head: [Object], tail: [Object], length: 1 }
                // head：{
                // data: <Buffer 00 2d 10 e8 87 80 80 80 7d 1a 18 2f 31 38 36 33 30 39 37 37 39 39 39 2f 31 37 36 39 35 39 32 36 39 39 39 22 08 0a 06 e4 bd a0 e5 a5 bd>,
                // next: null
                // }
                const readableBuffer = (socket as any).readableBuffer.head.data as Buffer;
                const message_head = readableBuffer.readUInt8();

                if (message_head <= 0 || readableBuffer.length < message_head) return;

                const message = socket.read(message_head) as (Buffer | null); // 这里传输的数据 包括 head 和 body

                console.log(
                    'ip', socket.remoteAddress, 'port', socket.remotePort,
                    'server received', message);

                role.Authed ? protocol.handleProtocol(message.subarray(1), role) : role.auth();
            });

            socket.on("error", function (e: Error) {
                console.log(
                    'ip ', socket.remoteAddress,
                    'error ', e.message
                );
            });

            socket.on('end', (reason) => {
                console.log(reason);
            });
        });

        this.init();
    }

    private init() {
        this.server.on("end", () => { });
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