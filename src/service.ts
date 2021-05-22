import * as pbjs from 'pbjs';
import tls from 'tls';
import fs from 'fs';
import dapr from 'dapr-client';
import { Dapr } from './grpc';
import { StatusStore } from './statusStore';

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

const server = tls.createServer(options, (socket) => {
  console.log('server connected',
    socket.authorized ? 'authorized' : 'unauthorized');
  
  socket.on('data', (message: Buffer | String) => {

    if (message instanceof String) {
      socket.end();
    }

    if (typeof message === 'string') {
      //error: only support buffer type
    }

    const ins = Dapr.Instance();
    const status = StatusStore(Dapr.StateStoreName, "order", { id: "curder", ip: "localhost", });
    ins.saveState(status, (err, state) => {  } );

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
