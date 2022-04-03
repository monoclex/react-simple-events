/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import React, { useState } from "react";
import { createNanoEvents, createUseEvent } from "../src";

interface UpdateEvents {
  notify(message: string): void;
}

const updateEmitter = createNanoEvents<UpdateEvents>();
const useUpdateEvent = createUseEvent(updateEmitter);

function Component() {
  const [message, setMessage] = useState("");
  useUpdateEvent("notify", (message) => setMessage(message));
  return <p>Message: {message}</p>;
}

it("updates text on event", () => {
  render(<Component />);

  const message = screen.getByText("Message: ", { normalizer: (x) => x });

  act(() => void updateEmitter.emit("notify", "Hello, world!"));
  expect(message).toHaveTextContent("Message: Hello, world!");
});
