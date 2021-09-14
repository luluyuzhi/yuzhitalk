export const enum MessageType {
  Text = "Text",
  Voice = "Voice",
  Image = "Image",
  Video = "Video",
  Position = "Position",
  File = "File",
  Notify = "Notify",
  Ack = "Ack",
  Exist = "Exist",
  System = "System",
  Custom = "Custom",
}

export const encodeMessageType: { [key: string]: number } = {
  Text: 0,
  Voice: 1,
  Image: 2,
  Video: 3,
  Position: 4,
  File: 5,
  Notify: 10,
  Ack: 11,
  Exist: 12,
  System: 99,
  Custom: 100,
};

export const decodeMessageType: { [key: number]: MessageType } = {
  0: MessageType.Text,
  1: MessageType.Voice,
  2: MessageType.Image,
  3: MessageType.Video,
  4: MessageType.Position,
  5: MessageType.File,
  10: MessageType.Notify,
  11: MessageType.Ack,
  12: MessageType.Exist,
  99: MessageType.System,
  100: MessageType.Custom,
};

export interface TransfromText {
  contents: string;
}

export function encodeTransfromText(message: TransfromText): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromText(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromText(message: TransfromText, bb: ByteBuffer): void {
  // required string contents = 1;
  let $contents = message.contents;
  if ($contents !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $contents);
  }
}

export function decodeTransfromText(binary: Uint8Array): TransfromText {
  return _decodeTransfromText(wrapByteBuffer(binary));
}

function _decodeTransfromText(bb: ByteBuffer): TransfromText {
  let message: TransfromText = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string contents = 1;
      case 1: {
        message.contents = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.contents === undefined)
    throw new Error("Missing required field: contents");

  return message;
}

export interface TransfromVoice {
  duration: Long;
  md5: string;
  url: string;
  ext: string;
  size: Long;
}

export function encodeTransfromVoice(message: TransfromVoice): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromVoice(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromVoice(message: TransfromVoice, bb: ByteBuffer): void {
  // required int64 duration = 1;
  let $duration = message.duration;
  if ($duration !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $duration);
  }

  // required string md5 = 2;
  let $md5 = message.md5;
  if ($md5 !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $md5);
  }

  // required string url = 3;
  let $url = message.url;
  if ($url !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $url);
  }

  // required string ext = 4;
  let $ext = message.ext;
  if ($ext !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $ext);
  }

  // required int64 size = 5;
  let $size = message.size;
  if ($size !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, $size);
  }
}

export function decodeTransfromVoice(binary: Uint8Array): TransfromVoice {
  return _decodeTransfromVoice(wrapByteBuffer(binary));
}

function _decodeTransfromVoice(bb: ByteBuffer): TransfromVoice {
  let message: TransfromVoice = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required int64 duration = 1;
      case 1: {
        message.duration = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required string md5 = 2;
      case 2: {
        message.md5 = readString(bb, readVarint32(bb));
        break;
      }

      // required string url = 3;
      case 3: {
        message.url = readString(bb, readVarint32(bb));
        break;
      }

      // required string ext = 4;
      case 4: {
        message.ext = readString(bb, readVarint32(bb));
        break;
      }

      // required int64 size = 5;
      case 5: {
        message.size = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.duration === undefined)
    throw new Error("Missing required field: duration");

  if (message.md5 === undefined)
    throw new Error("Missing required field: md5");

  if (message.url === undefined)
    throw new Error("Missing required field: url");

  if (message.ext === undefined)
    throw new Error("Missing required field: ext");

  if (message.size === undefined)
    throw new Error("Missing required field: size");

  return message;
}

export interface TransfromImage {
  name: string;
  md5: string;
  url: string;
  ext: string;
  w: Long;
  h: Long;
  size: Long;
}

export function encodeTransfromImage(message: TransfromImage): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromImage(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromImage(message: TransfromImage, bb: ByteBuffer): void {
  // required string name = 1;
  let $name = message.name;
  if ($name !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $name);
  }

  // required string md5 = 2;
  let $md5 = message.md5;
  if ($md5 !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $md5);
  }

  // required string url = 3;
  let $url = message.url;
  if ($url !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $url);
  }

  // required string ext = 4;
  let $ext = message.ext;
  if ($ext !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $ext);
  }

  // required int64 w = 5;
  let $w = message.w;
  if ($w !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, $w);
  }

  // required int64 h = 6;
  let $h = message.h;
  if ($h !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, $h);
  }

  // required int64 size = 7;
  let $size = message.size;
  if ($size !== undefined) {
    writeVarint32(bb, 56);
    writeVarint64(bb, $size);
  }
}

export function decodeTransfromImage(binary: Uint8Array): TransfromImage {
  return _decodeTransfromImage(wrapByteBuffer(binary));
}

function _decodeTransfromImage(bb: ByteBuffer): TransfromImage {
  let message: TransfromImage = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string name = 1;
      case 1: {
        message.name = readString(bb, readVarint32(bb));
        break;
      }

      // required string md5 = 2;
      case 2: {
        message.md5 = readString(bb, readVarint32(bb));
        break;
      }

      // required string url = 3;
      case 3: {
        message.url = readString(bb, readVarint32(bb));
        break;
      }

      // required string ext = 4;
      case 4: {
        message.ext = readString(bb, readVarint32(bb));
        break;
      }

      // required int64 w = 5;
      case 5: {
        message.w = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required int64 h = 6;
      case 6: {
        message.h = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required int64 size = 7;
      case 7: {
        message.size = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.name === undefined)
    throw new Error("Missing required field: name");

  if (message.md5 === undefined)
    throw new Error("Missing required field: md5");

  if (message.url === undefined)
    throw new Error("Missing required field: url");

  if (message.ext === undefined)
    throw new Error("Missing required field: ext");

  if (message.w === undefined)
    throw new Error("Missing required field: w");

  if (message.h === undefined)
    throw new Error("Missing required field: h");

  if (message.size === undefined)
    throw new Error("Missing required field: size");

  return message;
}

export interface TransfromVideo {
  duration: Long;
  md5: string;
  url: string;
  ext: string;
  w: Long;
  h: Long;
  size: Long;
}

export function encodeTransfromVideo(message: TransfromVideo): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromVideo(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromVideo(message: TransfromVideo, bb: ByteBuffer): void {
  // required int64 duration = 1;
  let $duration = message.duration;
  if ($duration !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $duration);
  }

  // required string md5 = 2;
  let $md5 = message.md5;
  if ($md5 !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $md5);
  }

  // required string url = 3;
  let $url = message.url;
  if ($url !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $url);
  }

  // required string ext = 4;
  let $ext = message.ext;
  if ($ext !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $ext);
  }

  // required int64 w = 5;
  let $w = message.w;
  if ($w !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, $w);
  }

  // required int64 h = 6;
  let $h = message.h;
  if ($h !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, $h);
  }

  // required int64 size = 7;
  let $size = message.size;
  if ($size !== undefined) {
    writeVarint32(bb, 56);
    writeVarint64(bb, $size);
  }
}

export function decodeTransfromVideo(binary: Uint8Array): TransfromVideo {
  return _decodeTransfromVideo(wrapByteBuffer(binary));
}

function _decodeTransfromVideo(bb: ByteBuffer): TransfromVideo {
  let message: TransfromVideo = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required int64 duration = 1;
      case 1: {
        message.duration = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required string md5 = 2;
      case 2: {
        message.md5 = readString(bb, readVarint32(bb));
        break;
      }

      // required string url = 3;
      case 3: {
        message.url = readString(bb, readVarint32(bb));
        break;
      }

      // required string ext = 4;
      case 4: {
        message.ext = readString(bb, readVarint32(bb));
        break;
      }

      // required int64 w = 5;
      case 5: {
        message.w = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required int64 h = 6;
      case 6: {
        message.h = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required int64 size = 7;
      case 7: {
        message.size = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.duration === undefined)
    throw new Error("Missing required field: duration");

  if (message.md5 === undefined)
    throw new Error("Missing required field: md5");

  if (message.url === undefined)
    throw new Error("Missing required field: url");

  if (message.ext === undefined)
    throw new Error("Missing required field: ext");

  if (message.w === undefined)
    throw new Error("Missing required field: w");

  if (message.h === undefined)
    throw new Error("Missing required field: h");

  if (message.size === undefined)
    throw new Error("Missing required field: size");

  return message;
}

export interface TransfromPosition {
  title: string;
  lng: Long;
  lat: Long;
}

export function encodeTransfromPosition(message: TransfromPosition): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromPosition(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromPosition(message: TransfromPosition, bb: ByteBuffer): void {
  // required string title = 1;
  let $title = message.title;
  if ($title !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $title);
  }

  // required int64 lng = 1;
  let $lng = message.lng;
  if ($lng !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $lng);
  }

  // required int64 lat = 1;
  let $lat = message.lat;
  if ($lat !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $lat);
  }
}

export function decodeTransfromPosition(binary: Uint8Array): TransfromPosition {
  return _decodeTransfromPosition(wrapByteBuffer(binary));
}

function _decodeTransfromPosition(bb: ByteBuffer): TransfromPosition {
  let message: TransfromPosition = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string title = 1;
      case 1: {
        message.title = readString(bb, readVarint32(bb));
        break;
      }

      // required int64 lng = 1;
      case 1: {
        message.lng = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required int64 lat = 1;
      case 1: {
        message.lat = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.title === undefined)
    throw new Error("Missing required field: title");

  if (message.lng === undefined)
    throw new Error("Missing required field: lng");

  if (message.lat === undefined)
    throw new Error("Missing required field: lat");

  return message;
}

export interface TransfromFile {
  name: string;
  md5: string;
  url: string;
  ext: string;
  size: Long;
}

export function encodeTransfromFile(message: TransfromFile): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromFile(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromFile(message: TransfromFile, bb: ByteBuffer): void {
  // required string name = 1;
  let $name = message.name;
  if ($name !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $name);
  }

  // required string md5 = 2;
  let $md5 = message.md5;
  if ($md5 !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $md5);
  }

  // required string url = 3;
  let $url = message.url;
  if ($url !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $url);
  }

  // required string ext = 4;
  let $ext = message.ext;
  if ($ext !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $ext);
  }

  // required int64 size = 5;
  let $size = message.size;
  if ($size !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, $size);
  }
}

export function decodeTransfromFile(binary: Uint8Array): TransfromFile {
  return _decodeTransfromFile(wrapByteBuffer(binary));
}

function _decodeTransfromFile(bb: ByteBuffer): TransfromFile {
  let message: TransfromFile = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string name = 1;
      case 1: {
        message.name = readString(bb, readVarint32(bb));
        break;
      }

      // required string md5 = 2;
      case 2: {
        message.md5 = readString(bb, readVarint32(bb));
        break;
      }

      // required string url = 3;
      case 3: {
        message.url = readString(bb, readVarint32(bb));
        break;
      }

      // required string ext = 4;
      case 4: {
        message.ext = readString(bb, readVarint32(bb));
        break;
      }

      // required int64 size = 5;
      case 5: {
        message.size = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.name === undefined)
    throw new Error("Missing required field: name");

  if (message.md5 === undefined)
    throw new Error("Missing required field: md5");

  if (message.url === undefined)
    throw new Error("Missing required field: url");

  if (message.ext === undefined)
    throw new Error("Missing required field: ext");

  if (message.size === undefined)
    throw new Error("Missing required field: size");

  return message;
}

export interface InternNotify {
  code: Long;
  message: string;
}

export function encodeInternNotify(message: InternNotify): Uint8Array {
  let bb = popByteBuffer();
  _encodeInternNotify(message, bb);
  return toUint8Array(bb);
}

function _encodeInternNotify(message: InternNotify, bb: ByteBuffer): void {
  // required int64 code = 1;
  let $code = message.code;
  if ($code !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $code);
  }

  // required string message = 2;
  let $message = message.message;
  if ($message !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $message);
  }
}

export function decodeInternNotify(binary: Uint8Array): InternNotify {
  return _decodeInternNotify(wrapByteBuffer(binary));
}

function _decodeInternNotify(bb: ByteBuffer): InternNotify {
  let message: InternNotify = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required int64 code = 1;
      case 1: {
        message.code = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required string message = 2;
      case 2: {
        message.message = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.code === undefined)
    throw new Error("Missing required field: code");

  if (message.message === undefined)
    throw new Error("Missing required field: message");

  return message;
}

export interface TransfromNotify {
  internalNotify?: InternNotify;
}

export function encodeTransfromNotify(message: TransfromNotify): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromNotify(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromNotify(message: TransfromNotify, bb: ByteBuffer): void {
  // optional InternNotify internalNotify = 1;
  let $internalNotify = message.internalNotify;
  if ($internalNotify !== undefined) {
    writeVarint32(bb, 10);
    let nested = popByteBuffer();
    _encodeInternNotify($internalNotify, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeTransfromNotify(binary: Uint8Array): TransfromNotify {
  return _decodeTransfromNotify(wrapByteBuffer(binary));
}

function _decodeTransfromNotify(bb: ByteBuffer): TransfromNotify {
  let message: TransfromNotify = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional InternNotify internalNotify = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.internalNotify = _decodeInternNotify(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface TransfromAck {
  ack: string;
}

export function encodeTransfromAck(message: TransfromAck): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromAck(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromAck(message: TransfromAck, bb: ByteBuffer): void {
  // required string ack = 1;
  let $ack = message.ack;
  if ($ack !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $ack);
  }
}

export function decodeTransfromAck(binary: Uint8Array): TransfromAck {
  return _decodeTransfromAck(wrapByteBuffer(binary));
}

function _decodeTransfromAck(bb: ByteBuffer): TransfromAck {
  let message: TransfromAck = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string ack = 1;
      case 1: {
        message.ack = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.ack === undefined)
    throw new Error("Missing required field: ack");

  return message;
}

export interface TransfromExist {
  internalNotify?: InternNotify;
}

export function encodeTransfromExist(message: TransfromExist): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromExist(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromExist(message: TransfromExist, bb: ByteBuffer): void {
  // optional InternNotify internalNotify = 1;
  let $internalNotify = message.internalNotify;
  if ($internalNotify !== undefined) {
    writeVarint32(bb, 10);
    let nested = popByteBuffer();
    _encodeInternNotify($internalNotify, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeTransfromExist(binary: Uint8Array): TransfromExist {
  return _decodeTransfromExist(wrapByteBuffer(binary));
}

function _decodeTransfromExist(bb: ByteBuffer): TransfromExist {
  let message: TransfromExist = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional InternNotify internalNotify = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.internalNotify = _decodeInternNotify(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface TransfromSystem {
  code: Long;
  contents: string;
}

export function encodeTransfromSystem(message: TransfromSystem): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromSystem(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromSystem(message: TransfromSystem, bb: ByteBuffer): void {
  // required int64 code = 1;
  let $code = message.code;
  if ($code !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $code);
  }

  // required string contents = 2;
  let $contents = message.contents;
  if ($contents !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $contents);
  }
}

export function decodeTransfromSystem(binary: Uint8Array): TransfromSystem {
  return _decodeTransfromSystem(wrapByteBuffer(binary));
}

function _decodeTransfromSystem(bb: ByteBuffer): TransfromSystem {
  let message: TransfromSystem = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required int64 code = 1;
      case 1: {
        message.code = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required string contents = 2;
      case 2: {
        message.contents = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.code === undefined)
    throw new Error("Missing required field: code");

  if (message.contents === undefined)
    throw new Error("Missing required field: contents");

  return message;
}

export interface TransfromCustom {
  option?: { [key: string]: string };
  server?: { [key: string]: string };
}

export function encodeTransfromCustom(message: TransfromCustom): Uint8Array {
  let bb = popByteBuffer();
  _encodeTransfromCustom(message, bb);
  return toUint8Array(bb);
}

function _encodeTransfromCustom(message: TransfromCustom, bb: ByteBuffer): void {
  // optional map<string, string> option = 1;
  let map$option = message.option;
  if (map$option !== undefined) {
    for (let key in map$option) {
      let nested = popByteBuffer();
      let value = map$option[key];
      writeVarint32(nested, 10);
      writeString(nested, key);
      writeVarint32(nested, 18);
      writeString(nested, value);
      writeVarint32(bb, 10);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<string, string> server = 2;
  let map$server = message.server;
  if (map$server !== undefined) {
    for (let key in map$server) {
      let nested = popByteBuffer();
      let value = map$server[key];
      writeVarint32(nested, 10);
      writeString(nested, key);
      writeVarint32(nested, 18);
      writeString(nested, value);
      writeVarint32(bb, 18);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeTransfromCustom(binary: Uint8Array): TransfromCustom {
  return _decodeTransfromCustom(wrapByteBuffer(binary));
}

function _decodeTransfromCustom(bb: ByteBuffer): TransfromCustom {
  let message: TransfromCustom = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional map<string, string> option = 1;
      case 1: {
        let values = message.option || (message.option = {});
        let outerLimit = pushTemporaryLength(bb);
        let key: string | undefined;
        let value: string | undefined;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readString(bb, readVarint32(bb));
              break;
            }
            case 2: {
              value = readString(bb, readVarint32(bb));
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: option");
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<string, string> server = 2;
      case 2: {
        let values = message.server || (message.server = {});
        let outerLimit = pushTemporaryLength(bb);
        let key: string | undefined;
        let value: string | undefined;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readString(bb, readVarint32(bb));
              break;
            }
            case 2: {
              value = readString(bb, readVarint32(bb));
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: server");
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface yuzhitalkproto {
  messageType: MessageType;
  timestamp: Long;
  statustransfrom: Long;
  statustransto: Long;
  id?: Long;
  transfromtext?: TransfromText;
  transfromVoice?: TransfromVoice;
  transfromImage?: TransfromImage;
  transfromVideo?: TransfromVideo;
  transfromPosition?: TransfromPosition;
  transfromFile?: TransfromFile;
  transfromExist?: TransfromExist;
  transfromAck?: TransfromAck;
  transfromNotify?: TransfromNotify;
  transfromSystem?: TransfromSystem;
  transfromCustom?: TransfromCustom;
}

export function encodeyuzhitalkproto(message: yuzhitalkproto): Uint8Array {
  let bb = popByteBuffer();
  _encodeyuzhitalkproto(message, bb);
  return toUint8Array(bb);
}

function _encodeyuzhitalkproto(message: yuzhitalkproto, bb: ByteBuffer): void {
  // required MessageType messageType = 1;
  let $messageType = message.messageType;
  if ($messageType !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, encodeMessageType[$messageType]);
  }

  // required int64 timestamp = 2;
  let $timestamp = message.timestamp;
  if ($timestamp !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $timestamp);
  }

  // required int64 statustransfrom = 3;
  let $statustransfrom = message.statustransfrom;
  if ($statustransfrom !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $statustransfrom);
  }

  // required int64 statustransto = 4;
  let $statustransto = message.statustransto;
  if ($statustransto !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, $statustransto);
  }

  // optional int64 id = 5;
  let $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, $id);
  }

  // optional TransfromText transfromtext = 6;
  let $transfromtext = message.transfromtext;
  if ($transfromtext !== undefined) {
    writeVarint32(bb, 50);
    let nested = popByteBuffer();
    _encodeTransfromText($transfromtext, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromVoice transfromVoice = 7;
  let $transfromVoice = message.transfromVoice;
  if ($transfromVoice !== undefined) {
    writeVarint32(bb, 58);
    let nested = popByteBuffer();
    _encodeTransfromVoice($transfromVoice, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromImage transfromImage = 8;
  let $transfromImage = message.transfromImage;
  if ($transfromImage !== undefined) {
    writeVarint32(bb, 66);
    let nested = popByteBuffer();
    _encodeTransfromImage($transfromImage, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromVideo transfromVideo = 9;
  let $transfromVideo = message.transfromVideo;
  if ($transfromVideo !== undefined) {
    writeVarint32(bb, 74);
    let nested = popByteBuffer();
    _encodeTransfromVideo($transfromVideo, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromPosition transfromPosition = 10;
  let $transfromPosition = message.transfromPosition;
  if ($transfromPosition !== undefined) {
    writeVarint32(bb, 82);
    let nested = popByteBuffer();
    _encodeTransfromPosition($transfromPosition, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromFile transfromFile = 11;
  let $transfromFile = message.transfromFile;
  if ($transfromFile !== undefined) {
    writeVarint32(bb, 90);
    let nested = popByteBuffer();
    _encodeTransfromFile($transfromFile, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromExist transfromExist = 12;
  let $transfromExist = message.transfromExist;
  if ($transfromExist !== undefined) {
    writeVarint32(bb, 98);
    let nested = popByteBuffer();
    _encodeTransfromExist($transfromExist, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromAck transfromAck = 13;
  let $transfromAck = message.transfromAck;
  if ($transfromAck !== undefined) {
    writeVarint32(bb, 106);
    let nested = popByteBuffer();
    _encodeTransfromAck($transfromAck, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromNotify transfromNotify = 14;
  let $transfromNotify = message.transfromNotify;
  if ($transfromNotify !== undefined) {
    writeVarint32(bb, 114);
    let nested = popByteBuffer();
    _encodeTransfromNotify($transfromNotify, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromSystem transfromSystem = 15;
  let $transfromSystem = message.transfromSystem;
  if ($transfromSystem !== undefined) {
    writeVarint32(bb, 122);
    let nested = popByteBuffer();
    _encodeTransfromSystem($transfromSystem, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional TransfromCustom transfromCustom = 16;
  let $transfromCustom = message.transfromCustom;
  if ($transfromCustom !== undefined) {
    writeVarint32(bb, 130);
    let nested = popByteBuffer();
    _encodeTransfromCustom($transfromCustom, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeyuzhitalkproto(binary: Uint8Array): yuzhitalkproto {
  return _decodeyuzhitalkproto(wrapByteBuffer(binary));
}

function _decodeyuzhitalkproto(bb: ByteBuffer): yuzhitalkproto {
  let message: yuzhitalkproto = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required MessageType messageType = 1;
      case 1: {
        message.messageType = decodeMessageType[readVarint32(bb)];
        break;
      }

      // required int64 timestamp = 2;
      case 2: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required int64 statustransfrom = 3;
      case 3: {
        message.statustransfrom = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // required int64 statustransto = 4;
      case 4: {
        message.statustransto = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 id = 5;
      case 5: {
        message.id = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional TransfromText transfromtext = 6;
      case 6: {
        let limit = pushTemporaryLength(bb);
        message.transfromtext = _decodeTransfromText(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromVoice transfromVoice = 7;
      case 7: {
        let limit = pushTemporaryLength(bb);
        message.transfromVoice = _decodeTransfromVoice(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromImage transfromImage = 8;
      case 8: {
        let limit = pushTemporaryLength(bb);
        message.transfromImage = _decodeTransfromImage(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromVideo transfromVideo = 9;
      case 9: {
        let limit = pushTemporaryLength(bb);
        message.transfromVideo = _decodeTransfromVideo(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromPosition transfromPosition = 10;
      case 10: {
        let limit = pushTemporaryLength(bb);
        message.transfromPosition = _decodeTransfromPosition(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromFile transfromFile = 11;
      case 11: {
        let limit = pushTemporaryLength(bb);
        message.transfromFile = _decodeTransfromFile(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromExist transfromExist = 12;
      case 12: {
        let limit = pushTemporaryLength(bb);
        message.transfromExist = _decodeTransfromExist(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromAck transfromAck = 13;
      case 13: {
        let limit = pushTemporaryLength(bb);
        message.transfromAck = _decodeTransfromAck(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromNotify transfromNotify = 14;
      case 14: {
        let limit = pushTemporaryLength(bb);
        message.transfromNotify = _decodeTransfromNotify(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromSystem transfromSystem = 15;
      case 15: {
        let limit = pushTemporaryLength(bb);
        message.transfromSystem = _decodeTransfromSystem(bb);
        bb.limit = limit;
        break;
      }

      // optional TransfromCustom transfromCustom = 16;
      case 16: {
        let limit = pushTemporaryLength(bb);
        message.transfromCustom = _decodeTransfromCustom(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.messageType === undefined)
    throw new Error("Missing required field: messageType");

  if (message.timestamp === undefined)
    throw new Error("Missing required field: timestamp");

  if (message.statustransfrom === undefined)
    throw new Error("Missing required field: statustransfrom");

  if (message.statustransto === undefined)
    throw new Error("Missing required field: statustransto");

  return message;
}

export interface Long {
  low: number;
  high: number;
  unsigned: boolean;
}

interface ByteBuffer {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value: Long): string {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

export function intToLong(value: number): Long {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack: ByteBuffer[] = [];

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit;
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2: number, c3: number, c4: number, c: number;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0;
  let value = 0;
  let b: number;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b: number;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
