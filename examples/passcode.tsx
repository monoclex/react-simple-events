import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { createNanoEvents, createUseEvent, createUseEventRpc, rpcEmit, Response } from "react-simple-events";
import { PromiseCompletionSource } from "promise-completion-source";

interface GameEvents {
  start(): void;
  message(message: string): void;
  passcode(resp: Response<Promise<string>>): void;
  correct(): void;
  incorrect(): void;
}

const gameEmitter = createNanoEvents<GameEvents>();
const useGameEvent = createUseEvent(gameEmitter);
const useGameEventRpc = createUseEventRpc(gameEmitter);

function App() {
  const [display, setDisplay] = useState(<span>Nothing has happened yet...</span>);

  useGameEvent("message", (message) => setDisplay(<h1>{message}</h1>));
  useGameEvent("correct", () => setDisplay(<h1 style={{ color: "lime" }}>Correct!</h1>));
  useGameEvent("incorrect", () => setDisplay(<h1 style={{ color: "red" }}>Incorrect!</h1>));

  return (
    <>
      <button onClick={gameThread}>Start</button>
      <div>
        <AskInput />
        {display}
      </div>
    </>
  );
}

function AskInput() {
  const [askHandle, setAskHandle] = useState<null | PromiseCompletionSource<string>>(null);
  const inputBox = useRef<HTMLInputElement>(null);

  useGameEventRpc("passcode", () => {
      const source = new PromiseCompletionSource<string>();
      setAskHandle(source);
      return source.promise;
    }, [setAskHandle]
  );

  if (askHandle == null) return null;

  const submit = () => askHandle.resolve(inputBox.current.value);
  return (
    <>
      <button type="button" onClick={submit}>Submit the passcode</button>
      <input ref={inputBox} type="text" />
    </>
  );
}

const sleep = (seconds: number) => new Promise((resolve) => setTimeout(() => resolve(undefined), seconds * 1000));

async function gameThread() {
  for (let i = 3; i >= 1; i--) {
    gameEmitter.emit("message", `${i}...`);
    await sleep(1);
  }

  gameEmitter.emit("message", "Enter the passcode...");
  const passcode = await rpcEmit(gameEmitter, "passcode");

  if (passcode === "hunter1") {
    gameEmitter.emit("correct");
  } else {
    gameEmitter.emit("incorrect");
    await sleep(2);
    await gameThread();
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
