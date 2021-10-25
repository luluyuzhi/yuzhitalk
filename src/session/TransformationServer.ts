import Long = require("long");
import { IIdServer } from "yuzhi/id/idServer";
import { Subscription } from "yuzhi/subscription/Subscription";
import { ISubscriptionServer } from "yuzhi/subscription/SubscriptionServer";
import { User } from "yuzhi/user/User";
import { Session } from "./Session";
import { ISessionServer } from "./SessionServer";
import { Transformation } from "./Transformation";

export interface ITransformationServer {
    readonly _serviceBrand: undefined;
    generateTransformation(
        timestamp: Long,
        content: any,
        sender: User,
        receiver: Long | User
    ): Transformation;
}

export class TransformationServer implements ITransformationServer {

    declare _serviceBrand: undefined;
    constructor(@ISessionServer sessionServer: ISessionServer,
        @IIdServer private idServer: IIdServer,
        @ISubscriptionServer private subscriptionServer: ISubscriptionServer
    ) { }

    generateTransformation(
        timestamp: Long,
        content: any,
        sender: User,
        receiver: Long | User
    ) {
        const transformation = new Transformation(this.idServer.gen(), content, sender.Unique() as unknown as Long,
            receiver as Long);
            
        return transformation;
    }
}