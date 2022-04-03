import type { DependencyList } from "./index";
import { useEffect } from "react";
import type { EventsMap, DefaultEvents, Emitter } from "nanoevents";

/**
 * Returns a `useEvent` hook that only needs the event, callback function, and dependencies.
 *
 * # Example
 *
 * ```ts
 * import React, { useState } from "react";
 * import { createNanoEvents, createUseEvent } from "react-simple-events";
 *
 * interface UpdateEvents {
 *     notify(message: string): void;
 * }
 *
 * const updateEmitter = createNanoEvents<UpdateEvents>();
 * const useUpdateEvent = createUseEvent(updateEmitter);
 *
 * function Component() {
 *     const [message, setMessage] = useState("");
 *
 *     useUpdateEvent("notify", (message) => setMessage(message));
 *
 *     return <p>Message: {message}</p>;
 * }
 * ```
 *
 * # Method Docs
 *
 * @param emitter The event emitter to create a useEvent hook for
 * @returns A hook that can be called to use a given event.
 */
export let createUseEvent =
  <Events extends EventsMap = DefaultEvents>(emitter: Emitter<Events>) =>
  <K extends keyof Events>(
    event: K,
    callback: Events[K],
    deps?: DependencyList
  ) =>
    // `size-limit` reports that this is smaller than calling useEvent
    useEffect(() => emitter.on(event, callback), deps);

/**
 * A hook that will run the callback when the event for the given event emitter
 * receives the specified event.
 *
 * # Example
 *
 * ```ts
 * import React, { useState } from "react";
 * import { createNanoEvents, useEvent } from "react-simple-events";
 *
 * interface UpdateEvents {
 *     notify(message: string): void;
 * }
 *
 * const updateEmitter = createNanoEvents<UpdateEvents>();
 *
 * function Component() {
 *     const [message, setMessage] = useState("");
 *
 *     useEvent(updateEmitter, "notify", (message) => setMessage(message));
 *
 *     return <p>Message: {message}</p>;
 * }
 * ```
 *
 * # Method Docs
 *
 * @param emitter The event emitter to listen for events on
 * @param event The event to listen for
 * @param callback The function to run when the event is emitted
 * @param deps Same behavior as useEffect
 */
export let useEvent = <
  K extends keyof Events,
  Events extends EventsMap = DefaultEvents
>(
  emitter: Emitter<Events>,
  event: K,
  callback: Events[K],
  deps?: DependencyList
) => useEffect(() => emitter.on(event, callback), deps);
