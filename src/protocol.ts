import { StringDecoder } from "string_decoder";

export enum EVersion {
    yuzhitps = 'yuzhitps0.0.1',
}

export enum EPackageType {
    extends = 0,
    text = 1,
    voice = 1 << 1,
    video = 1 << 2,
    file = 1 << 3,
    person = 1 << 4,
    group = 1 << 5,
    auth = 1 << 6
}

export interface IProtocolHeader {

    version: EVersion;
    PackageType: EPackageType;
}

export interface IMiddleProtocol extends IProtocolHeader {

    package: Buffer;
}

type TranslationBuffer = Buffer;

export function
    MiddleProtocol2TranslationBuffer(MiddleProtocol: IMiddleProtocol): TranslationBuffer {
    const buf = Buffer.alloc(MiddleProtocol.version.length + 1);
    buf.write(MiddleProtocol.version, 'ascii');
    buf.writeUInt8(MiddleProtocol.PackageType, MiddleProtocol.version.length);
    return Buffer.concat([buf, MiddleProtocol.package]);
}

export function
    TranslationBuffer2MiddleProtocol(translationBuffer: TranslationBuffer): IMiddleProtocol {

    const version = (new StringDecoder('ascii')).write(translationBuffer.slice(0, 13)) as EVersion;
    const PackageType = translationBuffer.slice(13, 14).readInt8();

    return {
        version,
        PackageType,
        package: translationBuffer.slice(14)
    }
}