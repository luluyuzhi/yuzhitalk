import { _type, IContentStrategy } from "./ContentStrategy";

const StrategySingle = new Map<_type, IContentStrategy<any>>();

export function _registerStrategy<T>(strategy: IContentStrategy<T>) {
  StrategySingle.set(strategy.StrateType, strategy);
}

export function _getStrategy<T>(id: _type): IContentStrategy<T> {
  return StrategySingle.get(id);
}
