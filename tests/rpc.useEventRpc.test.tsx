/** @jest-environment jsdom */
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import React, { useState } from "react";
import { createNanoEvents, useEventRpc, rpcEmit, Response } from "../src";

interface UIEvents {
  getText(resp: Response<string>): void;
}

const uiEmitter = createNanoEvents<UIEvents>();
const getCurrentText = () => rpcEmit(uiEmitter, "getText");

function Component() {
  const [message, setMessage] = useState("");

  useEventRpc(uiEmitter, "getText", () => message, [message]);

  return (
    <input
      type="text"
      alt="Enter Message"
      onChange={(e) => setMessage(e.target.value)}
    />
  );
}

it("gets the current text", () => {
  render(<Component />);

  const text = screen.getByAltText("Enter Message");

  act(() => void fireEvent["change"](text, { target: { value: "Hello!" } }));

  expect(getCurrentText()).toBe("Hello!");
});
