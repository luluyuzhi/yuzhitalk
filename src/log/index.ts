import * as log4js from "log4js";
import { createDecorator } from "yuzhi/instantiation/common/instantiation";

export interface ILogeServer extends log4js.Logger {
  readonly _serviceBrand: undefined;
}

export const ILogeServer =
  createDecorator<ILogeServer>("ILogeServer");


export function newLogger(name: string) {
  const logger = log4js.getLogger(name);
  logger.level = "DEBUG";
  return logger;
}

