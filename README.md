# `react-simple-events`

![minzipped size](https://badgen.net/bundlephobia/minzip/react-simple-events)
![dependencies](https://badgen.net/bundlephobia/dependency-count/react-simple-events)
![tree shaking](https://badgen.net/bundlephobia/tree-shaking/react-simple-events)

`react-simple-events` is the simplest, smallest, easiest, most idiomatic, and
just plain great way to introduce events into your React application

# Getting Started

Install `react-simple-events`, and then write some code!

```shell
pnpm add react-simple-events
yarn add react-simple-events
npm i react-simple-events
```

```tsx
import React, { useState } from "react";
import { createNanoEvents, createUseEvent } from "react-simple-events";

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

updateEmitter.emit("notify", "Hello, world!");
```

# Why Events?

In React, how would you approach the following?

- Efficient and granular updates in a large tree of components
- Easily querying React state from outside React
- Two-way communication between global and React state

`react-simple-events` is the answer. Coming in at a small < 1000 byte footprint,
it can solve these problems and more using events:

- Emit events when something happens, and have your React components listen and
  only update on that event if they need to
- Write event handlers in React components that return values
- Use event emitting and RPC (a thin layer over events) to cross the boundaries

`react-simple-events` was born out of a need, and has solved real problems:

- [Smiley Face Game](https://github.com/SirJosh3917/smiley-face-game) uses React
  for UI and PixiJS for rendering a game. Events are the answer to every single
  question - from asking for user input, have UI pop up on user actions, React
  and global variables are in harmony thanks to events.
- Potentially you! Why not submit a PR if you're using `react-simple-events`?

# Features

- **Small in size** &mdash; under 1000 bytes minified + gzipped!
- **Simple in nature** &mdash; complexity is the enemy.
- **React.Context API** &mdash; usable from React Contexts if you don't like
  global variables.
- **Versatile** &mdash; the event-driven architecture has many uses!

# Examples

## Gallery: Efficient, granular updating

A good usage of events is for efficient, granular updating is when displaying a
large amount of items.

The following demo could have tons of items, with complex interactivity rules,
and only the bare minimum will need to be rendered thanks to the usage of
events.

[![Gallery](./assets/gallery.gif)](./examples/gallery.tsx)

[Click to view source!](./examples/gallery.tsx)

## Passcode: Querying State from React

Another good usage of events is for being able to query values from React, and
use them elsewhere. This functionality is useful for communication between two
far-away parts of your application. For example, a game that asks for the user
to enter a password upon entering a trigger zone by showing React UI.

In the following demo, the RPC functionality of `react-simple-events` is used to
showcase querying values from React UI while game logic that's completely
separate from React is happening.

[![Passcode](./assets/passcode.gif)](./examples/passcode.tsx)

[Click to view source!](./examples/passcode.tsx)
