import { useState } from "react";

interface Props {
  items: string[];
  heading: string;
  // (item: string) => void
  onSelectItem: (item: string) => void;
}
//THIS IS UNUSED, SO YOU CAN RECYCLE THIS IF YOU WANT :]
//the names(items, heading), props made it dirty
function ListGroup({ items, heading, onSelectItem }: Props) {
  //Hook, tells react that a component has data that changes over time.
  const [selectedIndex, setSelectedIndex] = useState(-1);
  //code above this has an optional requirement of making variable and updater arrays
  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>Item does not exist</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
