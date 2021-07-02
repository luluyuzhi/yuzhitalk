import { IdService, IIdServer } from './idserver';
import { createDecorator } from 'yuzhi/instantiation/common/instantiation';

export const IGlobalIdServer = createDecorator<IIdServer>("GlobalIdServer");
export class GlobalIdServer extends IdService {

    constructor() {
        super();
    }

    gen() {
        throw new Error('Method not implemented.');
    }
}