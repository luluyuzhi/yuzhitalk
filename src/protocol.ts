
enum EVersion {
    yuzhitps = 'yuzhitps1.0',
}

enum EPackageType {

    text = 1,
    voice = 1 << 1,
    video = 1 << 2,
    file = 1 << 3,

    person =  2**8,
    group = 2**9,
}

interface IProtocolHeader {

    version: EVersion;
    PackageType: EPackageType;
}

interface IMiddleProtocol extends IProtocolHeader {

    package: Buffer;
}

type TranslationBuffer = Buffer;

function
    MiddleProtocol2TranslationBuffer(MiddleProtocol: IMiddleProtocol): TranslationBuffer {
    const buf = Buffer.alloc(MiddleProtocol.version.length + MiddleProtocol.PackageType.toString().length);
    buf.write(MiddleProtocol.version, 'ascii');
    buf.write(MiddleProtocol.PackageType.toString(), 'ascii');
    return Buffer.concat([buf, MiddleProtocol.package]);
}