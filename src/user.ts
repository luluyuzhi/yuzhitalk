

export class User {

    constructor() {


    }


    private keepLive?: NodeJS.Timeout;


    Destory() {
        if (this.keepLive) {
            clearTimeout(this.keepLive)
        }
    }
}

