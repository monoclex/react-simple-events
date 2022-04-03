import type { DependencyList } from "./index";
import { useEffect } from "react";
import type { EventsMap, DefaultEvents, Emitter } from "nanoevents";

export type Response<R> = { res?: R };

/**
 * `rpcEmit` allows you to emit events, but also expect a result back by having
 * the first argument of an event be an object that's intended to be mutated.
 *
 * This function wraps around `emitter.emit`, to handle passing along the object
 * for you.
 *
 * # Examples
 *
 * ```
 * import { createNanoEvents, rpcEmit, rpcOn, Response } from "react-simple-events";
 *
 * interface CalculatorEvents {
 *     add(resp: Response<number>, a: number, b: number): void;
 * }
 *
 * const calculatorEmitter = createNanoEvents<CalculatorEvents>();
 * rpcOn(calculatorEmitter, "add", (a, b) => a + b);
 * const sum = rpcEmit(calculatorEmitter, "add", 1, 2);
 * ```
 */
export let rpcEmit = <
  K extends keyof Events & string,
  Events extends EventsMap = DefaultEvents
>(
  emitter: Emitter<Events>,
  event: K,
  ...args: OmitFirstArg<Parameters<Events[K]>>
) => {
  let r: Response<PickResp<K, Events>> = {};
  //@ts-expect-error lol do i even try
  emitter.emit(event, r, ...args);
  return r.res;
};

/**
 * `rpcOn` allows you to receive events that expect a return value. The way it
 * returns values, is by having the first argument be an object that holds the
 * return value.
 *
 * This function wraps around `emitter.on`, to handle returning the return value
 * of the callback to the caller.
 *
 * # Examples
 *
 * ```
 * import { createNanoEvents, rpcEmit, rpcOn, Response } from "react-simple-events";
 *
 * interface CalculatorEvents {
 *     add(resp: Response<number>, a: number, b: number): void;
 * }
 *
 * const calculatorEmitter = createNanoEvents<CalculatorEvents>();
 * rpcOn(calculatorEmitter, "add", (a, b) => a + b);
 * const sum = rpcEmit(calculatorEmitter, "add", 1, 1);
 * ```
 */
export let rpcOn = <
  K extends keyof Events,
  Events extends EventsMap = DefaultEvents
>(
  emitter: Emitter<Events>,
  event: K,
  callback: (
    ...args: OmitFirstArg<Parameters<Events[K]>>
  ) => PickResp<K, Events>
) => {
  return emitter.on(
    event,
    //@ts-expect-error lol do i even try
    (
      response: Response<PickResp<K, Events>>,
      ...args: OmitFirstArg<Parameters<Events[K]>>
    ) => {
      response.res = callback(...args);
    }
  );
};

type OmitFirstArg<Args> = Args extends [
  first: Response<any>,
  ...rest: infer Rest
]
  ? Rest
  : never;

type FirstParam<
  K extends keyof Events,
  Events extends EventsMap = DefaultEvents
> = Parameters<Events[K]>[0];

type PickResp<
  K extends keyof Events,
  Events extends EventsMap = DefaultEvents
> = FirstParam<K, Events> extends Response<infer R> ? R : never;

/**
 * Returns a `useEventRpc` hook that only needs the event, callback function, and dependencies.
 *
 * # Example
 *
 * ```ts
 * import React, { useState } from "react";
 * import { createNanoEvents, createUseEventRpc, rpcEmit, Response } from "react-simple-events";
 *
 * interface UIEvents {
 *     getText(resp: Response<string>): void;
 * }
 *
 * const uiEmitter = createNanoEvents<UIEvents>();
 * const useUIEvent = createUseEventRpc(uiEmitter);
 * const getCurrentText = () => rpcEmit(uiEmitter, "getText");
 *
 * function Component() {
 *     const [message, setMessage] = useState("");
 *
 *     useUIEvent("getText", () => message, [message]);
 *
 *     return <input type="text" alt="Enter Message" onChange={(e) => setMessage(e.target.value)} />;
 * }
 * ```
 */
export let createUseEventRpc =
  <Events extends EventsMap = DefaultEvents>(emitter: Emitter<Events>) =>
  <K extends keyof Events>(
    event: K,
    callback: (
      ...args: OmitFirstArg<Parameters<Events[K]>>
    ) => PickResp<K, Events>,
    deps?: DependencyList
  ) =>
    useEffect(() => rpcOn(emitter, event, callback), deps);

/**
 * A hook that will run the callback when the event for the given event emitter
 * receives the specified event.
 *
 * # Example
 *
 * ```ts
 * import React, { useState } from "react";
 * import { createNanoEvents, useEventRpc, rpcEmit, Response } from "react-simple-events";
 *
 * interface UIEvents {
 *     getText(resp: Response<string>): void;
 * }
 *
 * const uiEmitter = createNanoEvents<UIEvents>();
 * const getCurrentText = () => rpcEmit(uiEmitter, "getText");
 *
 * function Component() {
 *     const [message, setMessage] = useState("");
 *
 *     useEventRpc(uiEmitter, "getText", () => message, [message]);
 *
 *     return <input type="text" alt="Enter Message" onChange={(e) => setMessage(e.target.value)} />;
 * }
 * ```
 */
export let useEventRpc = <
  K extends keyof Events,
  Events extends EventsMap = DefaultEvents
>(
  emitter: Emitter<Events>,
  event: K,
  callback: (
    ...args: OmitFirstArg<Parameters<Events[K]>>
  ) => PickResp<K, Events>,
  deps?: DependencyList
) => useEffect(() => rpcOn(emitter, event, callback), deps);
