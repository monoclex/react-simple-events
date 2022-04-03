import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createNanoEvents, createUseEvent } from "react-simple-events";

interface GalleryEvents {
  selected(item: string): void;
}

const galleryEmitter = createNanoEvents<GalleryEvents>();
const useGalleryEvent = createUseEvent(galleryEmitter);

const items = ["Apple", "Book", "Tree", "Sun", "Sky"];

function App() {
  return (
    <>
      <ChosenItem />
      {items.map((item, idx) => <Item key={idx} item={item} />)}
    </>
  );
}

function ChosenItem() {
  const [item, setItem] = useState<null | string>(null);

  useGalleryEvent("selected", (item) => setItem(item), [setItem]);

  return item !== null ? <p>You've selected: {item}</p> : <p>Select an item!</p>;
}

function Item({ item }: { item: string }) {
  const [selected, setSelected] = useState(false);

  useGalleryEvent("selected", (selectedItem) => {
      const shouldBeSelected = item === selectedItem;

      if (selected !== shouldBeSelected) {
        setSelected(shouldBeSelected);
      }
    }, [selected, setSelected]
  );

  const selectThisItem = () => galleryEmitter.emit("selected", item);

  return <p onClick={selectThisItem}>{item} {selected && "(Selected)"}</p>;
}

ReactDOM.render(<App />, document.getElementById("root"));
