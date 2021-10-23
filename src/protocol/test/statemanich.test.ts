import "mocha";
import { expect } from "chai";
import { spy } from "sinon";
import { manich } from "../statemachine";
import { interpret } from "xstate";

// describe('testFunc 测试', function () {
//     it('可以正常累加', function () {
//         yuStates;
//         const yuStatesService = interpret(yuStates);

//         yuStatesService.start();

//         const state = yuStatesService.send('idle');

//         expect(state.value["first"]).to.equal('idle');
//     });
// });
