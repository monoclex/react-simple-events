/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import React, { useEffect, useState } from "react";
import { createEventContext, useContextEvent, createNanoEvents } from "../src";

interface UpdateEvents {
  notify(message: string): void;
}

const updateContext = createEventContext<UpdateEvents>();

function Component() {
  const [message, setMessage] = useState("");

  useContextEvent(
    updateContext,
    "notify",
    (message) => setMessage(message),
    []
  );

  return <p>Message: {message}</p>;
}

const updateEmitter = createNanoEvents<UpdateEvents>();

function App() {
  useEffect(() => {
    setTimeout(() => updateEmitter.emit("notify", "Hello, World!"), 1000);
  }, []);

  return (
    <updateContext.Provider value={updateEmitter}>
      <Component />
    </updateContext.Provider>
  );
}

it("updates displayed message after a second", async () => {
  render(<App />);

  const element = screen.getByText("Message: ", { normalizer: (x) => x });

  await act(() => new Promise((resolve) => setTimeout(resolve, 1000)));

  expect(element).toHaveTextContent("Message: Hello, World!");
});
