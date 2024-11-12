import { Vector2 } from "./Vector2";

export interface MemViewDisplayLogOptions {
  /**
   * Wait on interface to render the update before releasing log
   */
  isSync: boolean;
  /*
   * Execution pause until you press play on front side
   */
  isBreakpoint: boolean;
  /*
   * Sleep for
   */
  waitFor: number;
  /**
   * Position on the map (Only if autoOrder = "None")
   */
  position: Vector2;
  /**
   * Background color of the display
   */
  backgroundColor: string;
  /**
   * Elements to display
   */
  elements: (DisplayElementDiv | DisplayElementText | DisplayElementTexture)[];
}

export interface DisplayElement {
  type: "Div" | "Text" | "Texture";
  position: Vector2;
}

export interface DisplayElementText extends DisplayElement {
  position: Vector2;
  fontSize: number;
  color: string;
  alignement: CanvasTextAlign;
  value: string;
}

export interface DisplayElementDiv extends DisplayElement {
  size: Vector2;
  backgroundColor: string;
}

export interface DisplayElementTexture extends DisplayElement {
  textureIndex: Vector2;
  scale: number;
}
