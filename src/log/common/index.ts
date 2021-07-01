import { configure, getLogger } from "log4js";
const logger = getLogger();
logger.level = "all";

// configure({
//     appenders: { cheese: { type: "file", filename: "cheese.log" } },
//     categories: { default: { appenders: ["cheese"], level: "error" } }
// });


// vs code 中 LogServer 并不是 对外的 一个核心接口
export function DTraceLog(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    logger.trace(`DTraceLog - function: ${propertyKey}`);
}

