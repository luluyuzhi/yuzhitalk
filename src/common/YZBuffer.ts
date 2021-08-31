
// +-------------------+------------------+------------------+
// | discardable bytes |  readable bytes  |  writable bytes  |
// |                   |     (CONTENT)    |                  |
// +-------------------+------------------+------------------+
// |                   |                  |                  |
// 0      <=      readerIndex   <=   writerIndex    <=    capacity

export class YZBuffer {
    
    private _readerIndex: number;
    private _writerIndex: number;
    private _capacity: number;
    private _content: Uint8Array;

    constructor(capacity: number) {
        this._capacity = capacity;
        this._content = new Uint8Array(capacity);
        this._readerIndex = 0;
        this._writerIndex = 0;
    }

    get readerIndex(): number {
        return this._readerIndex;
    }

    get writerIndex(): number {
        return this._writerIndex;
    }

    get capacity(): number {
        return this._capacity;
    }

    get content(): Uint8Array {
        return this._content;
    }

    get length(): number {
        return this._writerIndex - this._readerIndex;
    }

    get discardableBytes(): number {
        return this._capacity - this.length;
    }

    get readableBytes(): number {
        return this.length;
    }

    get writableBytes(): number {
        return this._capacity - this.length;
    }

    getByte(index: number): number {
        return this._content[index];
    }

    getInt16(index: number): number {
        return this._content[index] | this._content[index + 1] << 8;
    }

    getInt32(index: number): number {
        return this._content[index] | this._content[index + 1] << 8 | this._content[index + 2] << 16 | this._content[index + 3] << 24;
    }

    getInt64(index: number): number {
        return this._content[index] | this._content[index + 1] << 8 | this._content[index + 2] << 16 | this._content[index + 3] << 24 | this._content[index + 4] << 32 | this._content[index + 5] << 40 | this._content[index + 6] << 48 | this._content[index + 7] << 56;
    }

    getFloat32(index: number): number {
        return this._content[index] | this._content[index + 1] << 8 | this._content[index + 2] << 16 | this._content[index + 3] << 24;
    }

    getFloat64(index: number): number {
        return this._content[index] | this._content[index + 1] << 8 | this._content[index + 2] << 16 | this._content[index + 3] << 24 | this._content[index + 4] << 32 | this._content[index + 5] << 40 | this._content[index + 6] << 48 | this._content[index + 7] << 56;
    }

    putByte(index: number, value: number): void {
        this._content[index] = value;
    }

    putInt16(index: number, value: number): void {
        this._content[index] = value;
        this._content[index + 1] = value >> 8;
    }

    putInt32(index: number, value: number): void {
        this._content[index] = value;
        this._content[index + 1] = value >> 8;
        this._content[index + 2] = value >> 16;
        this._content[index + 3] = value >> 24;
    }

    putInt64(index: number, value: number): void {
        this._content[index] = value;
        this._content[index + 1] = value >> 8;
        this._content[index + 2] = value >> 16;
        this._content[index + 3] = value >> 24;
        this._content[index + 4] = value >> 32;
        this._content[index + 5] = value >> 40;
    }

    putFloat32(index: number, value: number): void {
        this._content[index] = value;
        this._content[index + 1] = value >> 8;
        this._content[index + 2] = value >> 16;
        this._content[index + 3] = value >> 24;
    }

    putFloat64(index: number, value: number): void {
        this._content[index] = value;
        this._content[index + 1] = value >> 8;
        this._content[index + 2] = value >> 16;
        this._content[index + 3] = value >> 24;
        this._content[index + 4] = value >> 32;
        this._content[index + 5] = value >> 40;
        this._content[index + 6] = value >> 48;
        this._content[index + 7] = value >> 56;
    }

    put(index: number, value: Uint8Array): void {
        this._content.set(value, index);
    }

    putString(index: number, value: string): void {
        this._content.set(Buffer.from(value), index);
    }

    putBuffer(index: number, value: YZBuffer): void {
        this._content.set(value.content, index);
    }

}