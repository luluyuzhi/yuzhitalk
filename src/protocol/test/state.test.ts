import "mocha";
import { expect } from "chai";
import { spy } from "sinon";
import { State1 } from "./state1.test";

describe("states 测试", function () {
  it("可以正常累加", function () {
    const s = new State1(1);
    // s.entryEndlong();
  });
});
