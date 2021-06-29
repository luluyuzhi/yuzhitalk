// import { configure, getLogger } from "log4js";
// configure("./filename");
// const logger = getLogger();
// logger.level = "debug";
// logger.debug("Some debug messages");

// configure({
//     appenders: { cheese: { type: "file", filename: "cheese.log" } },
//     categories: { default: { appenders: ["cheese"], level: "error" } }
// });


function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(descriptor);
    };
}

class Mudo {

    @enumerable(false)
    cc() {
        console.log(1);
    }
}


let muduo = new Mudo;

muduo.cc();