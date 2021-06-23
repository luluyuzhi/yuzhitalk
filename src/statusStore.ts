import {dapr_pb, common_pb} from 'dapr-client';


export function StatusStore(StateStoreName: string, key: string, value: unknown): dapr_pb.SaveStateRequest {

    const save = new dapr_pb.SaveStateRequest();
    save.setStoreName(StateStoreName);
    const state = new common_pb.StateItem();
    state.setKey(key);
    state.setValue(Buffer.from(JSON.stringify(value)));
    save.addStates(state);
    return save;
}


//TODO: unfinish
export function StatusParse() {

}

