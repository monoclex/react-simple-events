export * from "nanoevents";
export * from "./eventsContext";
export * from "./events";
export * from "./rpc";

// in react 17, this type changes from `InputIdentityList` to `DependencyList`.
// let's not be reliant upon the `react` package for the right types
export type DependencyList = ReadonlyArray<any>;
