<p align="center">
  <img src="https://raw.githubusercontent.com/thp-software/memview/refs/heads/master/assets/logo_test.png#center">
</p>

<p align="center">
<img src="https://img.shields.io/badge/Prototype-4CAF50?style=flat&logo=git&logoColor=white" alt="Prototype">
<img src="https://img.shields.io/badge/Node.js-4CAF50?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Socket.IO-4CAF50?style=flat&logo=socketdotio&logoColor=white" alt="Socket.IO">
<img src="https://img.shields.io/badge/Localhost-4CAF50?style=flat&logo=server&logoColor=white" alt="Localhost"> 
<img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</p>

<h2 align="center"><b><i>A Web Interface for Your Node.js App</i></b></h2>

<h3 align="center">🚧 Prototype version — breaking changes may occur until 1.0.0. 🚧</h3>

<h3 align="center"><i>Clean documentation coming soon.</i></h3>

## What is MemView ?

<h3><i>console.log() for arrays</i></h3>

> MemView is a web interface for Node.js that enables quick debugging and visualization of arrays.

- 👍 Plug & Play
- 🛠️ Fully customizable
- ⚡ Optimized for fast rendering
- 💻 CPU-only, no hardware acceleration required

<p align="center">
  <img src="https://raw.githubusercontent.com/thp-software/memview/refs/heads/master/assets/diagram.svg#center">
</p>

### Output

You can display items on a draggable and zoomable map:

- 🔢 Log arrays (1D, 2D, and flattened 2D) ✅
- 💬 Log messages in the console (log, warn, and error) ✅
- 🖼️ Log images (RGB, RGBA) <b><i>- Coming soon -</i></b>
- 📟 Log displays <b><i>- Beta -</i></b>
- 🌳 Log tree structures <b><i>- Potential future feature -</i></b>
- 🔊 Log audio (music, spatialized sounds) <b><i>- Potential future feature -</i></b>

### Input

You can receive inputs:

- 🖱️ Mouse events ✅
- ⌨️ Keyboard events ✅
- 🕹️ Gamepad events <b><i>- Potential future feature -</i></b>

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
  KeyCode,
  KeyEvent,
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
      mem.log(`Mouse: ${position.x}/${position.y} -> Mouse Hovering`);
    },
    onMouseDown: (position: Vector2) => {
      mem.log(`Mouse: ${position.x}/${position.y} -> Mouse Down`);
    },
    onMouseUp: (position: Vector2) => {
      mem.log(`Mouse: ${position.x}/${position.y} -> Mouse Up`);
    },
  };

  // You can listen to keyboard event
  mem.bindKeyEvent((data: KeyEvent) => {
    // mem.log(`Keyboard: ${data.key} -> ${data.isPressed}`);
  });

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

    // Another way to get keyboard events.
    // KeyCode is bind on the physical position of the key.
    // That's mean that "KeyQ" is "Q" on QWERTY layout but "A" on AZERTY layout.
    mem.log("Q (QWERTY) / A (AZERTY) " + mem.getKey(KeyCode.KeyQ));

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

## Code Quality

#### Before 1.0.0

Features first, even to the detriment of code quality.

#### Since 1.0.0

Quality first.

## Author

[THP-Software](https://github.com/thp-software)
