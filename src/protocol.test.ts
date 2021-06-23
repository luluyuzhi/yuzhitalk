import { describe, it, } from 'mocha';
import { expect } from 'chai';
import { EPackageType, EVersion, MiddleProtocol2TranslationBuffer, TranslationBuffer2MiddleProtocol } from './protocol';


describe('protocol', () => {

    const buf = Buffer.alloc(1);
    buf.writeUInt8(64);
    const targe = Buffer.concat([Buffer.from('yuzhitps0.0.1', 'ascii'), buf, Buffer.from('yimin here')])
    
    const source = {
        version: EVersion.yuzhitps,
        PackageType: EPackageType.auth,
        package: Buffer.from('yimin here')
    };

    it('MiddleProtocol2TranslationBuffer', () => expect(MiddleProtocol2TranslationBuffer(source).equals(targe), 'MiddleProtocol2TranslationBuffer fail').to.be.eql(true))


    it('TranslationBuffer2MiddleProtocol', () => expect(TranslationBuffer2MiddleProtocol(targe), 'TranslationBuffer2MiddleProtocol fail').to.be.eql(source));
})
