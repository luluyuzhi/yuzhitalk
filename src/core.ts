import { User } from "./user";


function auth(auths: string) {

    return true;
}


interface IHere {

    MessageType: string;
}

class Core {

    constructor(private socket: NodeJS.Socket) {

    }

    user?: User

    ProcessMessage(here: IHere) {

        if (here.MessageType !== "auth" && !this.user) {
            this.socket.end();
        }
    }
}