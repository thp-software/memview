import { MemViewArrayType } from "../../../../../shared/enums/ArrayType";
import { Vector2 } from "../../../../../shared/interfaces/Vector2";
import { MemViewArrayFront } from "../../arrays/MemViewArray";
import { MemViewDraw } from "./MemViewDraw";
import { MemViewRender } from "../MemViewRender";
import { Atlas } from "../../../../../shared/interfaces/Atlas";
import { MemViewMapper } from "../../../../../shared/interfaces/MemViewMapper";

export class MemViewRenderCPU implements MemViewRender {
  // private canvas: HTMLCanvasElement | null = null;
  // private canvasContext: CanvasRenderingContext2D | null = null;

  private backgroundCanvas: HTMLCanvasElement | null = null;
  private backgroundCanvasContext: CanvasRenderingContext2D | null = null;

  private arrayCellsCanvas: HTMLCanvasElement | null = null;
  private arrayCellsCanvasContext: CanvasRenderingContext2D | null = null;

  private arrayAtlasCanvas: HTMLCanvasElement | null = null;
  private arrayAtlasCanvasContext: CanvasRenderingContext2D | null = null;

  private arrayCellInfosCanvas: HTMLCanvasElement | null = null;
  private arrayCellInfosCanvasContext: CanvasRenderingContext2D | null = null;

  private canvasUI: HTMLCanvasElement | null = null;
  private canvasUIContext: CanvasRenderingContext2D | null = null;

  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCanvasContext: CanvasRenderingContext2D | null = null;

  private atlas: Atlas | null = null;
  private atlasImage: any | null = null;

  public init(container: HTMLDivElement): boolean {
    this.backgroundCanvas = document.createElement("canvas");
    this.backgroundCanvas.style.width = "100%";
    this.backgroundCanvas.style.height = "100%";
    this.backgroundCanvas.width = container.clientWidth;
    this.backgroundCanvas.height = container.clientHeight;
    this.backgroundCanvas.style.zIndex = `${10}`;
    this.backgroundCanvas.style.position = "absolute";

    container.appendChild(this.backgroundCanvas);

    this.backgroundCanvasContext = this.backgroundCanvas.getContext("2d");

    this.arrayCellsCanvas = document.createElement("canvas");
    this.arrayCellsCanvas.style.width = "100%";
    this.arrayCellsCanvas.style.height = "100%";
    this.arrayCellsCanvas.width = container.clientWidth;
    this.arrayCellsCanvas.height = container.clientHeight;
    this.arrayCellsCanvas.style.zIndex = `${11}`;
    this.arrayCellsCanvas.style.position = "absolute";

    container.appendChild(this.arrayCellsCanvas);

    this.arrayCellsCanvasContext = this.arrayCellsCanvas.getContext("2d");

    this.arrayAtlasCanvas = document.createElement("canvas");
    this.arrayAtlasCanvas.style.width = "100%";
    this.arrayAtlasCanvas.style.height = "100%";
    this.arrayAtlasCanvas.width = container.clientWidth;
    this.arrayAtlasCanvas.height = container.clientHeight;
    this.arrayAtlasCanvas.style.zIndex = `${12}`;
    this.arrayAtlasCanvas.style.position = "absolute";
    this.arrayAtlasCanvas.style.imageRendering = "pixelated";
    // image-rendering: crisp-edges;

    container.appendChild(this.arrayAtlasCanvas);

    this.arrayAtlasCanvasContext = this.arrayAtlasCanvas.getContext("2d");
    if (this.arrayAtlasCanvasContext) {
      this.arrayAtlasCanvasContext.imageSmoothingEnabled = false;
    }

    this.arrayCellInfosCanvas = document.createElement("canvas");
    this.arrayCellInfosCanvas.style.width = "100%";
    this.arrayCellInfosCanvas.style.height = "100%";
    this.arrayCellInfosCanvas.width = container.clientWidth;
    this.arrayCellInfosCanvas.height = container.clientHeight;
    this.arrayCellInfosCanvas.style.zIndex = `${13}`;
    this.arrayCellInfosCanvas.style.position = "absolute";
    // image-rendering: crisp-edges;

    container.appendChild(this.arrayCellInfosCanvas);

    this.arrayCellInfosCanvasContext =
      this.arrayCellInfosCanvas.getContext("2d");

    this.canvasUI = document.createElement("canvas");
    this.canvasUI.style.width = "100%";
    this.canvasUI.style.height = "100%";
    this.canvasUI.width = container.clientWidth;
    this.canvasUI.height = container.clientHeight;
    this.canvasUI.style.zIndex = `${14}`;
    this.canvasUI.style.position = "absolute";

    container.appendChild(this.canvasUI);

    this.canvasUIContext = this.canvasUI.getContext("2d");

    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.style.width = "100%";
    this.offscreenCanvas.style.height = "100%";
    this.offscreenCanvas.width = 4096;
    this.offscreenCanvas.height = 4096;
    this.offscreenCanvas.style.zIndex = `${-1}`;
    this.offscreenCanvas.style.position = "absolute";
    this.offscreenCanvas.style.imageRendering = "pixelated";

    container.appendChild(this.offscreenCanvas);

    this.offscreenCanvasContext = this.offscreenCanvas.getContext("2d");
    if (this.offscreenCanvasContext) {
      this.offscreenCanvasContext.imageSmoothingEnabled = false;
    }

    return true;
  }

  public clear(): void {
    if (this.backgroundCanvas && this.backgroundCanvasContext) {
      this.backgroundCanvasContext.clearRect(
        0,
        0,
        this.backgroundCanvas.width,
        this.backgroundCanvas.height
      );
    }
    if (this.arrayCellsCanvas && this.arrayCellsCanvasContext) {
      this.arrayCellsCanvasContext.clearRect(
        0,
        0,
        this.arrayCellsCanvas.width,
        this.arrayCellsCanvas.height
      );
    }
    if (this.arrayAtlasCanvas && this.arrayAtlasCanvasContext) {
      this.arrayAtlasCanvasContext.clearRect(
        0,
        0,
        this.arrayAtlasCanvas.width,
        this.arrayAtlasCanvas.height
      );
    }
    if (this.arrayCellInfosCanvas && this.arrayCellInfosCanvasContext) {
      this.arrayCellInfosCanvasContext.clearRect(
        0,
        0,
        this.arrayCellInfosCanvas.width,
        this.arrayCellInfosCanvas.height
      );
    }
    if (this.canvasUI && this.canvasUIContext) {
      this.canvasUIContext.clearRect(
        0,
        0,
        this.canvasUI.width,
        this.canvasUI.height
      );
    }
  }

  public draw1dArray(
    id: string,
    position: Vector2,
    zoomFactor: number,
    data: any[],
    mapper: MemViewMapper,
    isBreakpoint: boolean
  ): void {
    if (
      this.backgroundCanvas &&
      this.backgroundCanvasContext &&
      this.canvasUI &&
      this.canvasUIContext &&
      this.arrayCellInfosCanvasContext
    ) {
      let maxSize: Vector2 = { x: data.length, y: 1 };

      MemViewDraw.drawArrayContour(
        this.backgroundCanvasContext,
        position,
        maxSize,
        zoomFactor,
        isBreakpoint ? "red" : "black",
        isBreakpoint ? 5 : 1,
        isBreakpoint ? "red" : "#00000010"
      );

      MemViewDraw.drawArrayInfos(
        this.backgroundCanvasContext,
        MemViewArrayType.Array2dFlat,
        id,
        position,
        maxSize,
        zoomFactor
      );

      for (let iX = 0; iX < data.length; iX++) {
        if (
          (position.x + iX * 64) * zoomFactor < -64 * zoomFactor ||
          (position.x + iX * 64) * zoomFactor >=
            (zoomFactor >= 1
              ? this.backgroundCanvas.width
              : this.backgroundCanvas.width / zoomFactor) ||
          (position.y + 0 * 64) * zoomFactor < -64 * zoomFactor ||
          (position.y + 0 * 64) * zoomFactor >=
            (zoomFactor >= 1
              ? this.backgroundCanvas.height
              : this.backgroundCanvas.height / zoomFactor)
        ) {
          continue;
        }

        MemViewDraw.drawElement(
          this.arrayCellInfosCanvasContext,
          this.atlasImage,
          this.atlas?.textureSize,
          // { x: iX, y: 0 },
          { x: position.x + iX * 64, y: position.y + 0 * 64 },
          zoomFactor,
          {
            cellBackgroundColor: mapper.cellBackgroundColor(data[iX]),
            cellAtlasIndex: mapper.cellAtlasIndex(data[iX]),
            cellText: mapper.cellText(data[iX]),
            details: mapper.details(data[iX]),
          }
        );
      }
    }
  }

  public draw2dArray(
    id: string,
    position: Vector2,
    zoomFactor: number,
    data: any[],
    mapper: MemViewMapper,
    isBreakpoint: boolean
  ): void {
    if (
      this.backgroundCanvas &&
      this.backgroundCanvasContext &&
      this.canvasUI &&
      this.canvasUIContext &&
      this.arrayCellInfosCanvasContext &&
      this.offscreenCanvas &&
      this.offscreenCanvasContext
    ) {
      let maxSize: Vector2 = { x: 0, y: data.length };

      for (let iY = 0; iY < data.length; iY++) {
        if (data[iY].length > maxSize.x) {
          maxSize.x = data[iY].length;
        }
      }

      MemViewDraw.drawArrayContour(
        this.backgroundCanvasContext,
        position,
        maxSize,
        zoomFactor,
        isBreakpoint ? "red" : "black",
        isBreakpoint ? 5 : 1,
        isBreakpoint ? "red" : "#00000010"
      );

      MemViewDraw.drawArrayInfos(
        this.backgroundCanvasContext,
        MemViewArrayType.Array2d,
        id,
        position,
        maxSize,
        zoomFactor
      );

      if (zoomFactor >= 1) {
        for (let iY = 0; iY < data.length; iY++) {
          for (let iX = 0; iX < data[iY].length; iX++) {
            if (
              (position.x + iX * 64) * zoomFactor < -64 * zoomFactor ||
              (position.x + iX * 64) * zoomFactor >=
                (zoomFactor >= 1
                  ? this.backgroundCanvas.width
                  : this.backgroundCanvas.width / zoomFactor) ||
              (position.y + iY * 64) * zoomFactor < -64 * zoomFactor ||
              (position.y + iY * 64) * zoomFactor >=
                (zoomFactor >= 1
                  ? this.backgroundCanvas.height
                  : this.backgroundCanvas.height / zoomFactor)
            ) {
              continue;
            }

            MemViewDraw.drawElement(
              this.arrayCellInfosCanvasContext,
              this.atlasImage,
              this.atlas?.textureSize,
              // { x: iX, y: iY },
              { x: position.x + iX * 64, y: position.y + iY * 64 },
              zoomFactor,
              {
                cellBackgroundColor: mapper.cellBackgroundColor(data[iY][iX]),
                cellAtlasIndex: mapper.cellAtlasIndex(data[iY][iX]),
                cellText: mapper.cellText(data[iY][iX]),
                details: mapper.details(data[iY][iX]),
              }
            );
          }
        }
      } else {
        this.offscreenCanvasContext.clearRect(0, 0, maxSize.x, maxSize.y);
        const imageData = this.offscreenCanvasContext.createImageData(
          maxSize.x,
          maxSize.y
        );
        const data2 = imageData.data;

        for (let y = 0; y < maxSize.y; y++) {
          for (let x = 0; x < maxSize.x; x++) {
            const index = (y * maxSize.x + x) * 4;

            const hexColor = this.hexToRgba(
              mapper.cellBackgroundColor(data[y][x])
            );
            data2[index] = hexColor.r;
            data2[index + 1] = hexColor.g;
            data2[index + 2] = hexColor.b;
            data2[index + 3] = hexColor.a;
          }
        }

        this.offscreenCanvasContext.putImageData(imageData, 0, 0);
        this.offscreenCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.offscreenCanvasContext.scale(64 * zoomFactor, 64 * zoomFactor);

        this.arrayCellInfosCanvasContext.imageSmoothingEnabled = false;
        this.arrayCellInfosCanvasContext.drawImage(
          this.offscreenCanvas,
          0,
          0,
          maxSize.x,
          maxSize.y,
          position.x * zoomFactor,
          position.y * zoomFactor,
          maxSize.x * 64 * zoomFactor,
          maxSize.y * 64 * zoomFactor
        );
      }
    }
  }

  public hexToRgba(hex: string) {
    let normalizedHex =
      hex.length === 4
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex.length === 5
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}${hex[4]}${hex[4]}`
        : hex;

    const bigint = parseInt(normalizedHex.slice(1), 16);

    return {
      r: (bigint >> (normalizedHex.length === 9 ? 24 : 16)) & 255,
      g: (bigint >> (normalizedHex.length === 9 ? 16 : 8)) & 255,
      b: (bigint >> (normalizedHex.length === 9 ? 8 : 0)) & 255,
      a:
        normalizedHex.length === 9 || normalizedHex.length === 5
          ? bigint & 255
          : 255,
    };
  }

  public draw2dFlatArray(
    id: string,
    position: Vector2,
    size: Vector2,
    zoomFactor: number,
    data: any[],
    mapper: MemViewMapper,
    isBreakpoint: boolean
  ): void {
    if (
      this.backgroundCanvas &&
      this.backgroundCanvasContext &&
      this.canvasUI &&
      this.canvasUIContext &&
      this.arrayCellInfosCanvasContext &&
      this.offscreenCanvas &&
      this.offscreenCanvasContext
    ) {
      MemViewDraw.drawArrayContour(
        this.backgroundCanvasContext,
        position,
        size,
        zoomFactor,
        isBreakpoint ? "red" : "black",
        isBreakpoint ? 5 : 1,
        isBreakpoint ? "#ff000010" : "#00000010"
      );

      MemViewDraw.drawArrayInfos(
        this.backgroundCanvasContext,
        MemViewArrayType.Array2dFlat,
        id,
        position,
        size,
        zoomFactor
      );

      if (zoomFactor >= 1) {
        for (let iY = 0; iY < size.y; iY++) {
          for (let iX = 0; iX < size.x; iX++) {
            if (
              (position.x + iX * 64) * zoomFactor < -64 * zoomFactor ||
              (position.x + iX * 64) * zoomFactor >=
                (zoomFactor >= 1
                  ? this.backgroundCanvas.width
                  : this.backgroundCanvas.width / zoomFactor) ||
              (position.y + iY * 64) * zoomFactor < -64 * zoomFactor ||
              (position.y + iY * 64) * zoomFactor >=
                (zoomFactor >= 1
                  ? this.backgroundCanvas.height
                  : this.backgroundCanvas.height / zoomFactor)
            ) {
              continue;
            }

            MemViewDraw.drawElement(
              this.arrayCellInfosCanvasContext,
              this.atlasImage,
              this.atlas?.textureSize,
              // { x: iX, y: i Y },
              { x: position.x + iX * 64, y: position.y + iY * 64 },
              zoomFactor,
              {
                cellBackgroundColor: mapper.cellBackgroundColor(
                  data[iX + size.x * iY]
                ),
                cellAtlasIndex: mapper.cellAtlasIndex(data[iX + size.x * iY]),
                cellText: mapper.cellText(data[iX + size.x * iY]),
                details: mapper.details(data[iX + size.x * iY]),
              }
            );
          }
        }
      } else {
        this.offscreenCanvasContext.clearRect(0, 0, size.x, size.y);
        const imageData = this.offscreenCanvasContext.createImageData(
          size.x,
          size.y
        );
        const data2 = imageData.data;

        for (let y = 0; y < size.y; y++) {
          for (let x = 0; x < size.x; x++) {
            const index = (y * size.x + x) * 4;

            const hexColor = this.hexToRgba(
              mapper.cellBackgroundColor(data[x + size.x * y])
            );
            data2[index] = hexColor.r;
            data2[index + 1] = hexColor.g;
            data2[index + 2] = hexColor.b;
            data2[index + 3] = hexColor.a;
          }
        }

        this.offscreenCanvasContext.putImageData(imageData, 0, 0);
        this.offscreenCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.offscreenCanvasContext.scale(64 * zoomFactor, 64 * zoomFactor);

        this.arrayCellInfosCanvasContext.imageSmoothingEnabled = false;
        this.arrayCellInfosCanvasContext.drawImage(
          this.offscreenCanvas,
          0,
          0,
          size.x,
          size.y,
          position.x * zoomFactor,
          position.y * zoomFactor,
          size.x * 64 * zoomFactor,
          size.y * 64 * zoomFactor
        );
      }
    }
  }

  public drawArraysUI(): void {}

  public drawUI(
    hoveredArray: MemViewArrayFront | null,
    hoveredArrayCell: Vector2,
    offset: Vector2,
    zoomFactor: number
  ): void {
    if (this.canvasUI && this.canvasUIContext) {
      this.canvasUIContext.clearRect(
        0,
        0,
        this.canvasUI.width,
        this.canvasUI.height
      );
      if (hoveredArray != null)
        MemViewDraw.drawElementCursor(
          this.canvasUIContext,
          {
            x:
              hoveredArray.getPosition().x + hoveredArrayCell.x * 64 - offset.x,
            y:
              hoveredArray.getPosition().y + hoveredArrayCell.y * 64 - offset.y,
          },
          zoomFactor
        );
    }
  }

  // setPosition(position: Vector2): void {
  //   console.log(position);
  // }

  clean(): void {
    this.backgroundCanvas?.remove();
    this.arrayCellInfosCanvas?.remove();
    this.arrayAtlasCanvas?.remove();
    this.arrayCellInfosCanvas?.remove();
    this.canvasUI?.remove();
    this.offscreenCanvas?.remove();
  }

  onResize(): void {
    if (this.backgroundCanvas) {
      this.backgroundCanvas.width = this.backgroundCanvas.offsetWidth;
      this.backgroundCanvas.height = this.backgroundCanvas.offsetHeight;
    }
    if (this.arrayCellsCanvas) {
      this.arrayCellsCanvas.width = this.arrayCellsCanvas.offsetWidth;
      this.arrayCellsCanvas.height = this.arrayCellsCanvas.offsetHeight;
    }
    if (this.arrayAtlasCanvas) {
      this.arrayAtlasCanvas.width = this.arrayAtlasCanvas.offsetWidth;
      this.arrayAtlasCanvas.height = this.arrayAtlasCanvas.offsetHeight;
    }
    if (this.arrayCellInfosCanvas) {
      this.arrayCellInfosCanvas.width = this.arrayCellInfosCanvas.offsetWidth;
      this.arrayCellInfosCanvas.height = this.arrayCellInfosCanvas.offsetHeight;
    }
    if (this.canvasUI) {
      this.canvasUI.width = this.canvasUI.offsetWidth;
      this.canvasUI.height = this.canvasUI.offsetHeight;
    }
  }

  getTopCanvas(): HTMLCanvasElement | null {
    return this.canvasUI;
  }

  setAtlas(atlas: Atlas): Promise<void> {
    return new Promise((resolve) => {
      this.atlas = atlas;
      console.log(atlas.texture);
      this.atlasImage = new Image();
      this.atlasImage.src = this.atlas.texture;
      this.atlasImage.onload = () => {
        resolve();
      };
    });
  }
}
