import { TLSSocket } from "tls";

export class ServerImp {
  protected Buffer(socket: TLSSocket): Buffer | null {
    // 这里使用了 nodejs 的 stream 模块中未被暴露的api。
    // BufferList { head: [Object], tail: [Object], length: 1 }
    // head：{
    // data: <Buffer 00 2d 10 e8 87 80 80 80 7d 1a 18 2f 31 38 36 33 30 39 37 37 39 39 39 2f 31 37 36 39 35 39 32 36 39 39 39 22 08 0a 06 e4 bd a0 e5 a5 bd>,
    // next: null
    // }
    const readableBuffer = (socket as any).readableBuffer.head.data as Buffer;
    const message_head = readableBuffer.readUInt8();

    if (message_head <= 0 || readableBuffer.length < message_head) return null;

    const message = socket.read(message_head) as Buffer | null; // 这里传输的数据 包括 head 和 body
    return message;
  }
}
