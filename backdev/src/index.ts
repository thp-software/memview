import {
  MemView,
  MemViewMapper,
  MemViewMapperOutput,
  Vector2,
  Anchor,
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
    openNewTab: false,
    // No auto order
    autoOrder: "None",
    showSideBar: true,
    showConsole: false,
    lockDrag: true,
    lockZoom: true,
    renderOptions: {
      bitmapViewThreshold: Zoom.Divide16,
      gridDisplayThreshold: Zoom.Base,
      textureDisplayThreshold: Zoom.Base,
      textDisplayThreshold: Zoom.Multiply2,
    },
  });

  await mem.loadAtlas(
    __dirname + "/../assets/single_texture_atlas.png",
    { x: 1, y: 1 },
    { x: 8, y: 8 }
  );

  mem.setView({
    position: { x: 8, y: 8 },
    zoom: Zoom.Divide2,
    handleResize: true,
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

  const myArray: number[][] = [];
  const myArrayTop: number[][] = [];
  const size: Vector2 = { x: 16, y: 16 };

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

    await mem.logDisplay(
      "dis",
      { x: 6, y: 4 },
      {
        position: { x: 17 * 64, y: 0 },
        backgroundColor: "#606060",
        elements: [
          {
            type: "Div",
            backgroundColor: "#779",
            position: { x: 8, y: 30 },
            size: { x: 340, y: 20 },
          },
          {
            type: "Text",
            color: "#ddd",
            position: { x: 10, y: 10 },
            value: "This is a Display",
            fontSize: 36,
            alignement: "left",
          },
          {
            type: "Text",
            color: "#ddd",
            position: { x: 150, y: 80 },
            value: `iteration: ${i}`,
            fontSize: 26,
            alignement: "left",
          },
          {
            type: "Texture",
            position: { x: 10, y: 80 },
            textureIndex: { x: 1, y: 0 },
            scale: 2,
          },
        ],
      }
    );
  }
})();
