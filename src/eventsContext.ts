import type { DependencyList } from "./index";
import type { Context } from "react";
import { createContext, useContext } from "react";
import type { EventsMap, DefaultEvents, Emitter } from "nanoevents";
import { createNanoEvents } from "nanoevents";
import { useEvent } from "./events";

/**
 * Creates a `React.Context` object that's used to idiomatically pass around a
 * reference to a nanoevents `Emitter` throughout the component tree.
 *
 * # Example
 *
 * ```ts
 * import React, { useContext, useEffect } from "react";
 * import { createEventContext, createNanoEvents } from "react-simple-events";
 *
 * interface UpdateEvents {
 *     notify(message: string): void;
 * }
 *
 * const updateContext = createEventContext<UpdateEvents>();
 *
 * function Component() {
 *     const updateEmitter = useContext(updateContext);
 *
 *     useEffect(() => updateEmitter.emit("notify", "Hello, world!"), []);
 *
 *     return null;
 * }
 *
 * const updateEmitter = createNanoEvents<UpdateEvents>();
 *
 * function App() {
 *     return (
 *         <updateContext.Provider value={updateEmitter}>
 *             <Component />
 *         </updateContext.Provider>
 *     );
 * }
 * ```
 *
 * # Method Docs
 *
 * @param emitter The optional event emitter to specify.
 *
 * The event emitter passed into this method is passed directly to `createContext`,
 * and if no event emitter is passed, one is created.
 *
 * @returns A `React.Context` object that contains the event emitter.
 */
export let createEventContext = <Events extends EventsMap = DefaultEvents>(
  emitter?: Emitter<Events>
) => createContext<Emitter<Events>>(emitter || createNanoEvents<Events>());

/**
 * Creates a `useEvent` hook that will use the event emitter specified from the
 * context.
 *
 * # Example
 *
 * ```ts
 * import React, { useEffect, useState } from "react";
 * import { createEventContext, createUseContextEvent, createNanoEvents } from "react-simple-events";
 *
 * interface UpdateEvents {
 *     notify(message: string): void;
 * }
 *
 * const updateContext = createEventContext<UpdateEvents>();
 * const useUpdateEvent = createUseContextEvent(updateContext);
 *
 * function Component() {
 *     const [message, setMessage] = useState("");
 *
 *     useUpdateEvent("notify", (message) => setMessage(message), [setMessage]);
 *
 *     return <p>Message: {message}</p>;
 * }
 *
 * const updateEmitter = createNanoEvents<UpdateEvents>();
 *
 * function App() {
 *     useEffect(() => {
 *         setTimeout(() => updateEmitter.emit("notify", "Hello, World!"), 1000);
 *     }, []);
 *
 *     return (
 *         <updateContext.Provider value={updateEmitter}>
 *             <Component />
 *         </updateContext.Provider>
 *     );
 * }
 * ```
 *
 * # Method Docs
 *
 * @param context The React.Context containing the event emitter to use
 * @returns A useEvent hook that can be called from components
 */
export let createUseContextEvent =
  <Events extends EventsMap = DefaultEvents>(
    context: Context<Emitter<Events>>
  ) =>
  <K extends keyof Events>(
    event: K,
    callback: Events[K],
    deps?: DependencyList
  ) =>
    useEvent(useContext(context), event, callback, deps);

/**
 * A hook that will run the callback when the event for the given React.Context
 * containing an event emitter receives the specified event.
 *
 * # Example
 *
 * ```ts
 * import React, { useEffect, useState } from "react";
 * import { createEventContext, useContextEvent, createNanoEvents } from "react-simple-events";
 *
 * interface UpdateEvents {
 *     notify(message: string): void;
 * }
 *
 * const updateContext = createEventContext<UpdateEvents>();
 *
 * function Component() {
 *     const [message, setMessage] = useState("");
 *
 *     useContextEvent(updateContext, "notify", (message) => setMessage(message), []);
 *
 *     return <p>Message: {message}</p>;
 * }
 *
 * const updateEmitter = createNanoEvents<UpdateEvents>();
 *
 * function App() {
 *     useEffect(() => {
 *         setTimeout(() => updateEmitter.emit("notify", "Hello, World!"), 1000);
 *     }, []);
 *
 *     return (
 *         <updateContext.Provider value={updateEmitter}>
 *             <Component />
 *         </updateContext.Provider>
 *     );
 * }
 * ```
 */
export let useContextEvent = <
  K extends keyof Events,
  Events extends EventsMap = DefaultEvents
>(
  context: Context<Emitter<Events>>,
  event: K,
  callback: Events[K],
  deps?: DependencyList
) => useEvent(useContext(context), event, callback, deps);
