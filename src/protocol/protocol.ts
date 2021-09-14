import { createDecorator } from 'yuzhi/instantiation/common/instantiation';
import { Role } from '../core/server';
import {
    yuzhitalkproto as YuzhitalkProto, MessageType, TransfromText, TransfromFile,
    TransfromImage, TransfromVoice, decodeyuzhitalkproto, TransfromNotify, TransfromPosition, TransfromVideo, yuzhitalkproto, encodeMessageType
} from './normal';
import { IProtocolCollocationServer, MessageStatusTransformer } from './statemachines';

export interface IProtocolHock {
    readonly _serviceBrand: undefined;
    DecodeProto(yuzhitalkProto: YuzhitalkProto): YuzhitalkProto;
    HandleTextMessage(transfromtext?: TransfromText): IProtocolHock;
    HandleVoiceMessage(transfromvoice?: TransfromVoice): IProtocolHock;
    HandleImageMessage(transfromimage?: TransfromImage): IProtocolHock;
    HandleVideoMessage(transfromvideo?: TransfromVideo): IProtocolHock;
    HandlePositionMessage(transfromposition?: TransfromPosition): IProtocolHock;
    HandleFileMessage(transfromfile?: TransfromFile): IProtocolHock;
    HandleNotifyMessage(transfromnotify?: TransfromNotify): IProtocolHock;
}
export const IProtocolHock = createDecorator<IProtocolHock>('IProtocolHock');

export class ProtocolHockServer implements IProtocolHock {
    DecodeProto(yuzhitalkProto: YuzhitalkProto): YuzhitalkProto {
        return yuzhitalkProto;
    }
    HandleTextMessage(transfromtext?: TransfromText): IProtocolHock {
        if (transfromtext === undefined) {
            return this;
        }

        return this;
    }
    HandleVoiceMessage(transfromvoice?: TransfromVoice): IProtocolHock {
        if (transfromvoice === undefined) {
            return this;
        }

        return this;
    }
    HandleImageMessage(transfromimage?: TransfromImage): IProtocolHock {
        if (transfromimage === undefined) {
            return this;
        }

        return this;
    }
    HandleVideoMessage(transfromvideo?: TransfromVideo): IProtocolHock {
        if (transfromvideo === undefined) {
            return this;
        }

        return this;
    }
    HandlePositionMessage(transfromposition?: TransfromPosition): IProtocolHock {
        if (transfromposition === undefined) {
            return this;
        }

        return this;
    }
    HandleFileMessage(transfromfile?: TransfromFile): IProtocolHock {
        if (transfromfile === undefined) {
            return this;
        }

        return this;
    }
    HandleNotifyMessage(transfromnotify?: TransfromNotify): IProtocolHock {
        if (transfromnotify === undefined) {
            return this;
        }

        return this;
    }

    declare readonly _serviceBrand: undefined;
}

export interface IProtocol {
    readonly _serviceBrand: undefined;
    handleProtocol(content: Buffer, socket: Role): void;
}

export const IProtocol = createDecorator<IProtocol>('yuzhiProtocol');


export class Protocol implements IProtocol {
    declare _serviceBrand: undefined;

    constructor(
        @IProtocolHock private protocol: IProtocolHock,
        @IProtocolCollocationServer private collocationServer: IProtocolCollocationServer
    ) { }
    public handleProtocol(content: Buffer, socket: Role) {

        let yuzhiProtocol = this.decode(content);

        if (!yuzhiProtocol) {
            return;
        }


        this.collocationServer.handleSource(yuzhiProtocol);
    }

    private decode(content: Buffer): YuzhitalkProto | undefined {
        let yuzhiProtocol: YuzhitalkProto;
        try {
            yuzhiProtocol = this.protocol.DecodeProto(decodeyuzhitalkproto(content));
        } catch (e) {
            return undefined;
        }
        this.protocol
            .HandleTextMessage(yuzhiProtocol.transfromtext)
            .HandleFileMessage(yuzhiProtocol.transfromFile);
        return yuzhiProtocol;
    }
}