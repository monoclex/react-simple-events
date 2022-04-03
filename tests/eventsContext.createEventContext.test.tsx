/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import React, { useContext, useEffect } from "react";
import { createEventContext, createNanoEvents } from "../src";

interface UpdateEvents {
  notify(message: string): void;
}

const updateContext = createEventContext<UpdateEvents>();

function Component() {
  const updateEmitter = useContext(updateContext);

  useEffect(() => updateEmitter.emit("notify", "Hello, world!"), []);

  return null;
}

const updateEmitter = createNanoEvents<UpdateEvents>();

function App() {
  return (
    <updateContext.Provider value={updateEmitter}>
      <Component />
    </updateContext.Provider>
  );
}

it("updates displayed message after a second", async () => {
  let receiverResolve!: (value: string) => void;
  let receiverPromise = new Promise<string>(
    (resolve) => (receiverResolve = resolve)
  );

  updateEmitter.on("notify", receiverResolve);

  render(<App />);

  const message = await receiverPromise;

  expect(message).toBe("Hello, world!");
});
