/** @jest-environment jsdom */
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

let renderCount = {
  App: 0,
  ChosenItem: 0,
  Item: 0,
};

function resetRenderCount() {
  renderCount.App = 0;
  renderCount.ChosenItem = 0;
  renderCount.Item = 0;
}

import React, { useEffect, useState } from "react";
import { createNanoEvents, createUseEvent } from "../src";

interface GalleryEvents {
  selected(item: string): void;
}

const galleryEmitter = createNanoEvents<GalleryEvents>();
const useGalleryEvent = createUseEvent(galleryEmitter);

const items = ["Apple", "Book", "Tree", "Sun", "Sky"];

function App() {
  useEffect(() => void renderCount.App++);
  return (
    <>
      <ChosenItem />
      {items.map((item, idx) => (
        <Item key={idx} item={item} />
      ))}
    </>
  );
}

function ChosenItem() {
  useEffect(() => void renderCount.ChosenItem++);
  const [item, setItem] = useState<null | string>(null);

  useGalleryEvent("selected", (item) => setItem(item), [setItem]);

  return item !== null ? (
    <p>You've selected: {item}</p>
  ) : (
    <p>Select an item!</p>
  );
}

function Item({ item }: { item: string }) {
  useEffect(() => void renderCount.Item++);
  const [selected, setSelected] = useState(false);

  useGalleryEvent(
    "selected",
    (selectedItem) => {
      const shouldBeSelected = item === selectedItem;

      if (selected !== shouldBeSelected) {
        setSelected(shouldBeSelected);
      }
    },
    [selected, setSelected]
  );

  const selectThisItem = () => {
    galleryEmitter.emit("selected", item);
  };

  return (
    <p onClick={selectThisItem}>
      {item} {selected && "(Selected)"}
    </p>
  );
}

it("application renders a minimum amount of times due to using events", () => {
  render(<App />);

  expect(renderCount.App).toBe(1);
  expect(renderCount.ChosenItem).toBe(1);
  expect(renderCount.Item).toBe(items.length);
  resetRenderCount();

  const tree = screen.getByText("Tree");
  act(() => void fireEvent["click"](tree));
  expect(renderCount.App).toBe(0);
  expect(renderCount.ChosenItem).toBe(1);
  expect(renderCount.Item).toBe(1);
  resetRenderCount();

  const apple = screen.getByText("Apple");
  act(() => void fireEvent["click"](apple));
  expect(renderCount.App).toBe(0);
  expect(renderCount.ChosenItem).toBe(1);
  expect(renderCount.Item).toBe(2);
  resetRenderCount();

  act(() => void fireEvent["click"](apple));
  expect(renderCount.App).toBe(0);
  expect(renderCount.ChosenItem).toBe(0);
  expect(renderCount.Item).toBe(0);
  resetRenderCount();
});
