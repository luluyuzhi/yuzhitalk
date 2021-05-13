import dapr from 'dapr-client';
import grpc from "grpc";

export class Dapr {

    private static instance?: dapr.dapr_grpc.DaprClient;
    public static readonly StateStoreName = `statestore`;
    public static Instance(): dapr.dapr_grpc.DaprClient {

        if (!this.instance) {
            const daprGrpcPort = process.env.DAPR_GRPC_PORT || 50001;

            this.instance = new dapr.dapr_grpc.DaprClient(
                `localhost:${daprGrpcPort}`, grpc.credentials.createInsecure());
        }
        return this.instance;
    }

    private constructor() { }
}