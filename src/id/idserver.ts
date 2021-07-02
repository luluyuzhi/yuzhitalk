
export interface IIdServer {

    gen();
}

export abstract class IdService implements IIdServer {

    constructor() { }

    abstract gen();
}