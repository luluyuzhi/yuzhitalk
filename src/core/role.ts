import { TLSSocket } from "tls";

export class Role {
  constructor(private socket: TLSSocket) {}

  isAuthed: boolean = false;

  get Authed() {
    return this.isAuthed;
  }

  auth() {}
}
