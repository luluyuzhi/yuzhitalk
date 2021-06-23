import * as pbjs from 'pbjs';
import * as fs from 'fs';
import { Dapr } from './serverGrpc';
import { StatusStore } from './statusStore';
import { decodeyuzhitalkproto } from './normal'
import { TLSSocket, createServer } from 'tls';



const schema = pbjs.parseSchema(`
  message Demo {
    optional int32 x = 1;
    optional float y = 2;
  }
`).compile();

const options = {
  key: fs.readFileSync('./tlsCa/ryans-key.pem'),
  cert: fs.readFileSync('./tlsCa/ryans-cert.pem'),
  // This is necessary only if using the client certificate authentication.
  requestCert: false,
  // This is necessary only if the client uses the self-signed certificate.
  ca: [fs.readFileSync('./tlsCa/ryans-csr.pem')]
};

const server = createServer(options, (socket: TLSSocket) => {
  console.log('server connected',
    socket.authorized ? 'authorized' : 'unauthorized');

  socket.on('data', (message: Buffer | string | String) => {


    if (typeof message === 'string' || message instanceof String) {
      //error: only support buffer type
      socket.end();
      return;
    }

    const proto = decodeyuzhitalkproto(new Uint8Array(message.buffer));
    console.log(proto);
    const ins = Dapr.Instance()
    const status = StatusStore(Dapr.StateStoreName, "order", { id: "curder", ip: "localhost", });
    ins.saveState(status, (err: any, state: any) => { });

    const buffer = schema.encodeDemo({ x: 1, y: 3.13 });
    socket.write(buffer);

    // whats mean
    socket.pipe(socket);
  });
});

server.on('end', () => { });

server.listen(8000, () => {
  console.log('server bound');
});
