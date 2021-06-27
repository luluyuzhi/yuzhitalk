import { createDecorator } from 'yuzhi/instantiation/common/instantiation';
import {
    yuzhitalkproto as YuzhitalkProto, MessageType, TransfromText, TransfromFile,
    TransfromImage, TransfromVoice, decodeyuzhitalkproto, TransfromNotify, TransfromPosition, TransfromVideo
} from './normal';

export interface IProtocolHock {
    readonly _serviceBrand: undefined;
    DecodeProto(yuzhitalkProto: YuzhitalkProto): IProtocolHock;
    HandleTextMessage(transfromtext?: TransfromText): IProtocolHock;
    HandleVoiceMessage(transfromvoice?: TransfromVoice): IProtocolHock;
    HandleImageMessage(transfromimage?: TransfromImage): IProtocolHock;
    HandleVideoMessage(transfromvideo?: TransfromVideo): IProtocol;
    HandlePositionMessage(transfromposition?: TransfromPosition): IProtocolHock;
    HandleFileMessage(transfromfile?: TransfromFile): IProtocolHock;
    HandleNotifyMessage(transfromnotify?: TransfromNotify): IProtocolHock;
}
export const IProtocolHock = createDecorator<IProtocolHock>('IProtocolHock');

export class ProtocolHockServer implements IProtocolHock {
    DecodeProto(yuzhitalkProto: YuzhitalkProto): IProtocolHock {
        throw new Error('Method not implemented.');
    }
    HandleTextMessage(transfromtext?: TransfromText): IProtocolHock {
        if (transfromtext === undefined) {
            return this;
        }

        return this;
    }
    HandleVoiceMessage(transfromvoice?: TransfromVoice): IProtocolHock {
        throw new Error('Method not implemented.');
    }
    HandleImageMessage(transfromimage?: TransfromImage): IProtocolHock {
        throw new Error('Method not implemented.');
    }
    HandleVideoMessage(transfromvideo?: TransfromVideo): IProtocol {
        throw new Error('Method not implemented.');
    }
    HandlePositionMessage(transfromposition?: TransfromPosition): IProtocolHock {
        throw new Error('Method not implemented.');
    }
    HandleFileMessage(transfromfile?: TransfromFile): IProtocolHock {
        throw new Error('Method not implemented.');
    }
    HandleNotifyMessage(transfromnotify?: TransfromNotify): IProtocolHock {
        throw new Error('Method not implemented.');
    }
    declare readonly _serviceBrand: undefined;

}

export interface IProtocol {
    readonly _serviceBrand: undefined;
    handleProtocol(content: Buffer): void;
}

export const IProtocol = createDecorator<IProtocol>('yuzhiProtocol');

export class Protocol implements IProtocol {
    declare _serviceBrand: undefined;

    constructor(@IProtocolHock private protocol: IProtocolHock) { }
    public handleProtocol(content: Buffer): void {
        const yuzhiProtocol: YuzhitalkProto = decodeyuzhitalkproto(content);
        this.protocol.HandleTextMessage(yuzhiProtocol.transfromtext);
    }
}

