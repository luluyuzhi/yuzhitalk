import { createDecorator } from "yuzhi/instantiation/common/instantiation";
import { Message } from 'yuzhi/message/message';
import { MessageStatus } from 'yuzhi/protocol/statemachines';

export interface IMessageServer {


    readonly _serviceBrand: undefined;
    generateMessage<T, U>(message: T, status: MessageStatus): Message<T, U>;
}

export const IMessageServer = createDecorator<IMessageServer>("IMessageServer");

export class MessageServer implements IMessageServer {
    declare readonly _serviceBrand: undefined;

    messages = new Map();
    constructor() { }

    generateMessage<T, U>(content: T, status: MessageStatus = MessageStatus.SendMsgRequest,): Message<T, U> {
        const message = new Message<T, U>(content, 1 as unknown as U, status);
        this.messages.set(message.Unique(), message);
        return message;
    }

    getMessage<U>(id: U) {
        return this.messages.get(id);
    }
}
