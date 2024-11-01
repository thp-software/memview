import {
  MemView,
  MemViewMapper,
  MemViewMapperOutput,
  Vector2,
  Anchor,
  KeyCode,
  KeyEvent,
  Zoom,
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
    // No auto order
    autoOrder: "None",
    renderOptions: {
      bitmapViewThreshold: Zoom.Divide4,
      gridDisplayThreshold: Zoom.Divide2,
      textureDisplayThreshold: Zoom.Divide2,
      textDisplayThreshold: Zoom.Base,
    },
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

  const customMapperTop: MemViewMapper = {
    cellBackgroundColor: (el: any) => {
      // If the value of cell is > 0.9, cell background will be red, else it will be green.
      return el > 0.9 ? "#a0505050" : "#0000";
    },
    cellText: (el: any) => {
      // Show the value of the cell at the center of itself.
      return [];
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
  const myArrayTop: number[][] = [];
  const size: Vector2 = { x: 32, y: 32 };

  // Init Array
  for (let iY = 0; iY < size.y; iY++) {
    myArray.push([]);
    myArrayTop.push([]);
    for (let iX = 0; iX < size.x; iX++) {
      myArray[iY].push(Math.random());
      myArrayTop[iY].push(Math.random());
    }
  }

  for (let i = 0; i < 10000; i++) {
    // Randomize the array for each iteration
    for (let iY = 0; iY < size.y; iY++) {
      for (let iX = 0; iX < size.x; iX++) {
        myArray[iY][iX] = Math.random();
        myArrayTop[iY][iX] = Math.random();
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
        waitFor: 0,
        // Wait for the array to be rendered before continuing.
        isSync: true,
        mapper: customMapper,
        output: customOutput,
        position: { x: 0, y: 0 },
      }
    );

    await mem.log2d(
      // Array unique id
      "my_array_id_2",
      // Array reference
      myArrayTop,
      // Options
      {
        // Wait for 1000ms before continuing.
        waitFor: 33,
        // Wait for the array to be rendered before continuing.
        isSync: true,
        mapper: customMapperTop,
        output: customOutput,
        position: { x: 0, y: 0 },
      }
    );
  }
})();
