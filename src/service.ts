import pbjs from 'pbjs';
import tls from 'tls';
import fs from 'fs';

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
  // socket.setEncoding('utf8');
  console.log(socket);
  const buffer = schema.encodeDemo({ x: 1, y: 3.13 });

  socket.on('data', (message: Buffer | string) => {

  });
  socket.write(buffer);
  socket.pipe(socket);
});

server.on('end', () => { });

server.listen(8000, () => {
  console.log('server bound');
});


