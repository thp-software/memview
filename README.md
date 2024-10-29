<p align="center">
  <img src="https://raw.githubusercontent.com/thp-software/memview/refs/heads/master/assets/logo_test.png#center">
</p>

<img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square" alt="License">

<h3 align="center">🚧 Prototype version — breaking changes may occur until 1.0.0. 🚧</h3>

<h3 align="center"><i>Clean documentation coming later.</i></h3>

## What is MemView ?

> MemView is a web interface for Node.JS that allows quick debugging and visualization of arrays.

<p align="center">
  <img src="https://raw.githubusercontent.com/thp-software/memview/refs/heads/master/assets/diagram.svg#center">
</p>

## Installation

`npm i memview`

## Simple Example

Simple exemple with render mapping and output mapping.

```ts
import {
  MemView,
  MemViewMapper,
  MemViewMapperOutput,
  Vector2,
  Anchor,
} from "memview";

(async () => {
  // Instanciate MemView
  const mem = new MemView();

  // Start it
  await mem.start({
    // Wait for interface to be opened
    waitForTab: true,
    // Automatically open interface at start
    openNewTab: true,
  });

  // Define how to render each cell of the array
  const customMapper: MemViewMapper = {
    cellBackgroundColor: (el: any) => {
      // If the value of cell is > 0.9, cell background will be red, else it will be green.
      return el > 0.9 ? "#a55" : "#5a5";
    },
    cellText: (el: any) => {
      // Show the value of the cell at the center of itself.
      return [
        {
          text: `${el.toFixed(2)}`,
          color: "#ccc",
          anchor: Anchor.Center,
          fontSize: 14,
        },
      ];
    },
    cellAtlasIndex: (el: any) => {
      // If you want to map a texture from an Atlas to your cell.
      // Not used here.
      return { x: 0, y: 0 };
    },
    details: (el: any) => {
      // Show the value of the hovered cell in the sidebar.
      return [`Value: ${el.toFixed(2)}`];
    },
  };

  // Define how to handle mouse events
  const customOutput: MemViewMapperOutput = {
    onHover: (position: Vector2) => {
      mem.log(`Position ${position.x}/${position.y} -> Mouse Hovering`);
    },
    onMouseDown: (position: Vector2) => {
      mem.log(`Position ${position.x}/${position.y} -> Mouse Down`);
    },
    onMouseUp: (position: Vector2) => {
      mem.log(`Position ${position.x}/${position.y} -> Mouse Up`);
    },
  };

  const myArray: number[][] = [];
  const size: Vector2 = { x: 16, y: 16 };

  // Init Array
  for (let iY = 0; iY < size.y; iY++) {
    myArray.push([]);
    for (let iX = 0; iX < size.x; iX++) {
      myArray[iY].push(Math.random());
    }
  }

  for (let i = 0; i < 10000; i++) {
    // Randomize the array for each iteration
    for (let iY = 0; iY < size.y; iY++) {
      for (let iX = 0; iX < size.x; iX++) {
        myArray[iY][iX] = Math.random();
      }
    }

    await mem.log2d(
      // Array unique id
      "my_array_id",
      // Array reference
      myArray,
      // Options
      {
        // Wait for 1000ms before continuing.
        waitFor: 1000,
        // Wait for the array to be rendered before continuing.
        isSync: true,
        mapper: customMapper,
        output: customOutput,
      }
    );
  }
})();
```

## Author

[THP-Software](https://github.com/thp-software)
