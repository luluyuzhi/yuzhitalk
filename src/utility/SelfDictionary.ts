import { IDisposable } from "yuzhi/common/lifecycle";

export interface IUnique<T> {
  Unique: () => T;
}

export class SelfDictionary<U, T extends IUnique<U>> {
  private map = new Map();
  public set(value: T): IDisposable {
    this.map.set(value.Unique(), value);
    return {
      dispose: () => {
        this.map.delete(value.Unique());
      },
    };
  }

  public has(key: U): boolean {
    return this.map.has(key);
  }

  public has1(key: T): boolean {
    return this.map.has(key.Unique());
  }

  public get(key: U) {
    return this.map.get(key);
  }
}
