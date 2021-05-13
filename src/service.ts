import pbjs from 'pbjs';
import tls from 'tls';
import fs from 'fs';
import dapr from 'dapr-client';
import { Dapr } from './grpc';


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
  const buffer = schema.encodeDemo({ x: 1, y: 3.13 });

  socket.on('data', (message: Buffer) => {

    if (message instanceof String) {
      socket.end();
    }

    if (typeof message === 'string') {

      // error // only support buffer type
    }

    const save = new dapr.dapr_pb.SaveStateRequest();
    save.setStoreName(Dapr.StateStoreName);
    const state = new dapr.common_pb.StateItem();
    state.setKey("order");
    state.setValue(Buffer.from(JSON.stringify({ id: "curder", ip: "localhost", })));
    save.addStates(state);

    const ins = Dapr.Instance();

    const savePromise = new Promise((resolve, reject) => {
      ins.saveState(save, (err, state) => { err ? reject(err) : resolve(void 0); } );
    });

    savePromise.catch((err) => { });
    socket.write(buffer);
    socket.pipe(socket);
  });
});

server.on('end', () => { });

server.listen(8000, () => {
  console.log('server bound');
});
server.on('end', () => {

});
server.listen(8000, () => {
  console.log('server bound');
});
