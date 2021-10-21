import {
  IContentStrategy,
  TextContentStrategy,
  ImageContentStrategy,
  _type,
} from "./ContentStrategy";
import { _getStrategy } from "./StrategySingle";

export interface IContentStrategyFactory {
  create(type: _type): IContentStrategy<any>;
}

export class ContentStrategyFactory implements IContentStrategyFactory {
  create(type: _type): IContentStrategy<any> {
    return _getStrategy(type);
  }
}
