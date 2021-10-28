import * as tls from "tls";
import * as fs from "fs";
import * as pbjs from "pbjs";
import {
  encodeyuzhitalkproto,
  intToLong,
  MessageType,
  yuzhitalkproto,
  Long,
} from "./protocol/normal";

const schema = pbjs
  .parseSchema(
    `
  message Demo {
    optional int32 x = 1;
    optional float y = 2;
  }
`
  )
  .compile();

const options = {
  key: fs.readFileSync("./tlsCa/ryans-key.pem"),
  cert: fs.readFileSync("./tlsCa/ryans-cert.pem"),
  // This is necessary only if using the client certificate authentication.
  requestCert: false,
  strictSSL: false,
  rejectUnauthorized: false,
  // This is necessary only if the client uses the self-signed certificate.
  ca: [fs.readFileSync("./tlsCa/ryans-csr.pem")],
};

function filling(buffer: Buffer | Uint8Array) {
  let b = Buffer.from(buffer);
  let length = Buffer.from(new Uint8Array([b.length]));
  return Buffer.concat([length, b]);
}

const socket = tls.connect(8080, options, () => {
  console.log(
    "client connected",
    socket.authorized ? "authorized" : "unauthorized"
  );
  let test = {
    messageType: MessageType.Text,
    timestamp: intToLong(123),
    statustransfrom: intToLong(10010),
    statustransto: intToLong(18630977388),
    id: intToLong(1),
    transfromtext: {
      contents: "one word",
    },
  } as yuzhitalkproto;
  let buf = encodeyuzhitalkproto(test);

  socket.write(filling(buf));
  process.stdin.pipe(socket);
  process.stdin.resume();
});

// socket.setEncoding('utf8');
socket.on("data", (data) => {
  console.log(data);
});
socket.on("end", () => {
  console.log("server disconnect!");
});
