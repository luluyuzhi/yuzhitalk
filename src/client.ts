import * as  tls from 'tls';
import * as fs from 'fs';
import * as pbjs from 'pbjs';
import { encodeyuzhitalkproto, MessageType, yuzhitalkproto, Long } from 'yuzhi/protocol/normal';

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
  strictSSL: false,
  rejectUnauthorized: false,
  // This is necessary only if the client uses the self-signed certificate.
  ca: [fs.readFileSync('./tlsCa/ryans-csr.pem')]
};

const socket = tls.connect(8080, options, () => {
  console.log('client connected',
    socket.authorized ? 'authorized' : 'unauthorized');
  let test = {
    messageType: MessageType.Text,
    timestamp: { low: 1000, high: 1000, unsigned: true } as Long,
    statustransfrom: "/18630977999/17695926999",
    transfromtext: { contents: "你好" },
  } as yuzhitalkproto;
  let buf = encodeyuzhitalkproto(test);
  socket.write(Buffer.from(buf));
  process.stdin.pipe(socket);
  process.stdin.resume();
});

// socket.setEncoding('utf8');
socket.on('data', (data) => {
  const message = schema.decodeDemo(data);

  console.log(message);
});
socket.on('end', () => {

});