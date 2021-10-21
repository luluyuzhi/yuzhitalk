import { MessageType } from "../../normal";
import { _registerStrategy } from "./StrategySingle";

export type _type = `${keyof typeof MessageType}Strategy`;

export interface IContentStrategy<T> {
  readonly _stratetype: _type;
  get StrateType(): _type;
  handle(buffer: Buffer): { result: T; error: Error | undefined };
}

abstract class ABSContentStrategy implements IContentStrategy<any> {
  get StrateType(): _type {
    return this._stratetype;
  }

  abstract readonly _stratetype: _type;
  abstract handle(buffer: Buffer): { result: any; error: Error | undefined };
}

export class TextContentStrategy extends ABSContentStrategy {
  override readonly _stratetype: _type = "TextStrategy";
  handle(buffer: Buffer): { result: string; error: Error | undefined } {
    return { result: buffer.toString(), error: undefined };
  }
}

export class ImageContentStrategy extends ABSContentStrategy {
  override readonly _stratetype: _type = "ImageStrategy";
  handle(buffer: Buffer): { result: Buffer; error: Error | undefined } {
    return { result: buffer, error: undefined };
  }
}

_registerStrategy(new TextContentStrategy());
_registerStrategy(new ImageContentStrategy());
