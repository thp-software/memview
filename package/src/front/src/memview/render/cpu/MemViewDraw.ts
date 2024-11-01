import { MemViewArrayType } from "../../../../../shared/enums/ArrayType";
import { Vector2 } from "../../../../../shared/interfaces/Vector2";
import { MemViewElement } from "../../../../../shared/interfaces/MemViewElement";
import { Anchor } from "../../../../../shared/enums/Anchor";
import { MemViewRenderOptions } from "../../../../../shared/interfaces/MemViewRenderOptions";
import { zooms } from "../../../../../shared/enums/Zoom";

export abstract class MemViewDraw {
  public static drawElement(
    context: CanvasRenderingContext2D,
    atlasImage: any | null,
    atlasTextureSize: Vector2 | undefined,
    // arrayPosition: Vector2,
    position: Vector2,
    zoomFactor: number,
    element: MemViewElement,
    renderOptions: MemViewRenderOptions
  ) {
    context.fillStyle = element.cellBackgroundColor;
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.fillRect(
      Math.floor(position.x * zoomFactor),
      Math.floor(position.y * zoomFactor),
      Math.floor(64 * zoomFactor),
      Math.floor(64 * zoomFactor)
    );

    console.log(zoomFactor + "/" + zooms[renderOptions.gridDisplayThreshold]);
    if (zoomFactor >= zooms[renderOptions.gridDisplayThreshold]) {
      context.strokeRect(
        Math.floor(position.x * zoomFactor),
        Math.floor(position.y * zoomFactor),
        Math.floor(64 * zoomFactor),
        Math.floor(64 * zoomFactor)
      );
    }

    if (zoomFactor >= zooms[renderOptions.textureDisplayThreshold]) {
      if (
        !(element.cellAtlasIndex.x === 0 && element.cellAtlasIndex.x === 0) &&
        atlasImage &&
        atlasTextureSize
      ) {
        context.drawImage(
          atlasImage,
          element.cellAtlasIndex.x * atlasTextureSize.x,
          element.cellAtlasIndex.y * atlasTextureSize.y,
          atlasTextureSize.x,
          atlasTextureSize.y,
          position.x * zoomFactor,
          position.y * zoomFactor,
          64 * zoomFactor,
          64 * zoomFactor
        );
      }
    }

    if (zoomFactor >= zooms[renderOptions.textDisplayThreshold]) {
      element.cellText.forEach((text) => {
        context.fillStyle = text.color;

        context.textAlign = MemViewDraw.getTextAlignFromAnchor(text.anchor);

        context.textBaseline = "middle";
        context.font = `${text.fontSize * zoomFactor}px Consolas`;

        const anchoredPosition: Vector2 = this.getPositionForAnchor(
          position,
          text.anchor,
          zoomFactor
        );

        context.fillText(text.text, anchoredPosition.x, anchoredPosition.y);
      });
    }

    if (zoomFactor >= 2) {
      // context.fillStyle = element.fontColor;
      // context.textAlign = "left";
      // context.textBaseline = "top";
      // context.font = "16px Consolas";
      // context.fillText(
      //   arrayPosition.x + "/" + arrayPosition.y,
      //   Math.floor(position.x * zoomFactor + 2 * zoomFactor),
      //   Math.floor(position.y * zoomFactor + 2 * zoomFactor)
      // );
    }
  }

  public static drawElementCursor(
    context: CanvasRenderingContext2D,
    position: Vector2,
    zoomFactor: number
  ) {
    context.fillStyle = "#ffffff20";
    context.strokeStyle = "red";
    context.lineWidth = 2;

    context.fillRect(
      Math.floor(position.x * zoomFactor),
      Math.floor(position.y * zoomFactor),
      Math.floor(64 * zoomFactor),
      Math.floor(64 * zoomFactor)
    );

    context.strokeRect(
      Math.floor(position.x * zoomFactor),
      Math.floor(position.y * zoomFactor),
      Math.floor(64 * zoomFactor),
      Math.floor(64 * zoomFactor)
    );
  }

  public static drawArrayInfos(
    context: CanvasRenderingContext2D,
    type: MemViewArrayType,
    name: string,
    position: Vector2,
    size: Vector2,
    zoomFactor: number
  ) {
    let fontSize: number = 20;

    let offsetY: number = 20 + 10 * zoomFactor;
    if (zoomFactor >= 1) {
      offsetY = 20 + 10 * zoomFactor;
    }

    if (zoomFactor >= 0.0625) {
      context.fillStyle = "white";
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.font = `${fontSize}px Consolas`;
      context.fillText(
        name,
        Math.floor(position.x * zoomFactor),
        Math.floor(position.y * zoomFactor - offsetY)
      );
    }

    if (zoomFactor >= 0.125) {
      context.fillStyle = "#ffffff90";
      context.textAlign = "right";
      context.textBaseline = "middle";
      context.font = `${fontSize}px Consolas`;
      context.fillText(
        MemViewArrayType[type],
        Math.floor((position.x + 64 * size.x) * zoomFactor),
        Math.floor(position.y * zoomFactor - offsetY)
      );
    }
  }

  // public static drawTexture(
  //   context: CanvasRenderingContext2D,
  //   atlasImage: any,
  //   atlasPosition: Vector2,
  //   atlasTextureSize: Vector2,
  //   position: Vector2
  // ) {
  //   context.drawImage(
  //     atlasImage,
  //     atlasPosition.x * atlasTextureSize.x,
  //     atlasPosition.y * atlasTextureSize.y,
  //     atlasTextureSize.x,
  //     atlasTextureSize.y,
  //     position.x,
  //     position.x,
  //     atlasTextureSize.x,
  //     atlasTextureSize.y
  //   );
  // }

  // public static drawArrayContour(
  //   context: CanvasRenderingContext2D,
  //   position: Vector2,
  //   size: Vector2,
  //   zoomFactor: number
  // ) {
  //   context.fillStyle = "#00000010";
  //   context.strokeStyle = "black";
  //   context.lineWidth = 1;

  //   context.fillRect(
  //     Math.floor((position.x - 10) * zoomFactor),
  //     Math.floor((position.y - 10) * zoomFactor),
  //     Math.floor((size.x * 64 + 20) * zoomFactor),
  //     Math.floor((size.y * 64 + 20) * zoomFactor)
  //   );

  //   context.strokeRect(
  //     Math.floor((position.x - 10) * zoomFactor),
  //     Math.floor((position.y - 10) * zoomFactor),
  //     Math.floor((size.x * 64 + 20) * zoomFactor),
  //     Math.floor((size.y * 64 + 20) * zoomFactor)
  //   );
  // }
  public static drawArrayContour(
    context: CanvasRenderingContext2D,
    position: Vector2,
    size: Vector2,
    zoomFactor: number,
    lineColor: string,
    lineThickness: number,
    backgroundColor: string
  ) {
    context.strokeStyle = lineColor;
    context.lineWidth = lineThickness;
    context.fillStyle = backgroundColor;

    context.fillRect(
      Math.floor((position.x - 10) * zoomFactor),
      Math.floor((position.y - 10) * zoomFactor),
      Math.floor((size.x * 64 + 20) * zoomFactor),
      Math.floor((size.y * 64 + 20) * zoomFactor)
    );

    context.strokeRect(
      Math.floor((position.x - 10) * zoomFactor),
      Math.floor((position.y - 10) * zoomFactor),
      Math.floor((size.x * 64 + 20) * zoomFactor),
      Math.floor((size.y * 64 + 20) * zoomFactor)
    );
  }

  public static getPositionForAnchor(
    position: Vector2,
    anchor: Anchor,
    zoomFactor: number
  ): Vector2 {
    switch (anchor) {
      case Anchor.Center: {
        return {
          x: Math.floor(position.x * zoomFactor + 32 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 32 * zoomFactor),
        };
      }
      case Anchor.Left: {
        return {
          x: Math.floor(position.x * zoomFactor + 2 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 32 * zoomFactor),
        };
      }
      case Anchor.Top: {
        return {
          x: Math.floor(position.x * zoomFactor + 32 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 6 * zoomFactor),
        };
      }
      case Anchor.Right: {
        return {
          x: Math.floor(position.x * zoomFactor + 62 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 32 * zoomFactor),
        };
      }
      case Anchor.Bottom: {
        return {
          x: Math.floor(position.x * zoomFactor + 32 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 58 * zoomFactor),
        };
      }
      case Anchor.TopLeft: {
        return {
          x: Math.floor(position.x * zoomFactor + 2 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 6 * zoomFactor),
        };
      }
      case Anchor.TopRight: {
        return {
          x: Math.floor(position.x * zoomFactor + 62 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 6 * zoomFactor),
        };
      }
      case Anchor.BottomLeft: {
        return {
          x: Math.floor(position.x * zoomFactor + 2 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 58 * zoomFactor),
        };
      }
      case Anchor.BottomRight: {
        return {
          x: Math.floor(position.x * zoomFactor + 62 * zoomFactor),
          y: Math.floor(position.y * zoomFactor + 58 * zoomFactor),
        };
      }
    }
  }

  public static getTextAlignFromAnchor(anchor: Anchor): CanvasTextAlign {
    switch (anchor) {
      case Anchor.Center: {
        return "center";
      }
      case Anchor.Left: {
        return "left";
      }
      case Anchor.Top: {
        return "center";
      }
      case Anchor.Right: {
        return "right";
      }
      case Anchor.Bottom: {
        return "center";
      }
      case Anchor.TopLeft: {
        return "left";
      }
      case Anchor.TopRight: {
        return "right";
      }
      case Anchor.BottomLeft: {
        return "left";
      }
      case Anchor.BottomRight: {
        return "right";
      }
    }
  }
}
