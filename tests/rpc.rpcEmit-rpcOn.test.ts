import { createNanoEvents, rpcEmit, rpcOn, Response } from "../src";

interface CalculatorEvents {
  add(resp: Response<number>, a: number, b: number): void;
}

const calculatorEmitter = createNanoEvents<CalculatorEvents>();
rpcOn(calculatorEmitter, "add", (a, b) => a + b);
const sum = rpcEmit(calculatorEmitter, "add", 1, 2);

it("has added the number", () => expect(sum).toBe(3));
