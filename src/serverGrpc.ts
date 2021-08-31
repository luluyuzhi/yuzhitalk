import * as dapr from 'dapr-client';
import { credentials } from "grpc";

export class Dapr {
    
    private static instance?: dapr.dapr_grpc.DaprClient;
    public static readonly StateStoreName = `statestore`;
    public static Instance(): dapr.dapr_grpc.DaprClient {
        if (!this.instance) {
            const daprGrpcPort = process.env.DAPR_GRPC_PORT || 50001;
            this.instance = new dapr.dapr_grpc.DaprClient(
                `localhost:${daprGrpcPort}`, credentials.createInsecure());
        }
        return this.instance;
    }

    private constructor() { }
}