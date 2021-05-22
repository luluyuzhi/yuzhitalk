import dapr from 'dapr-client';
import grpc from "grpc";

const daprGrpcPort = process.env.DAPR_GRPC_PORT || 50001;

const client = new dapr.dapr_grpc.DaprClient(
    `localhost:${daprGrpcPort}`, grpc.credentials.createInsecure());

client.invokeActor( new dapr.dapr_pb.InvokeActorRequest(), ()=>{})