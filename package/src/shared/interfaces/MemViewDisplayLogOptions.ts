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
  elements: (
    | DisplayElementDiv
    | DisplayElementText
    | DisplayElementTexture
    | DisplayElementButton
  )[];
}

export interface DisplayElement {
  id: string;
  type: "Div" | "Text" | "Texture" | "Button";
  position: Vector2;
  size: Vector2;
  onMouseHover?: () => void;
  onMouseDown?: () => void;
  [key: string]: any;
}

export interface DisplayElementText extends DisplayElement {
  fontSize: number;
  color: string;
  alignement: CanvasTextAlign;
  value: string;
}

export interface DisplayElementDiv extends DisplayElement {
  backgroundColor: string;
}

export interface DisplayElementTexture extends DisplayElement {
  textureIndex: Vector2;
  scale: number;
}

export interface DisplayElementButton extends DisplayElement {
  backgroundColor: string;
  hoverBackgroundColor: string;
  pressBackgroundColor: string;
  fontSize: number;
  color: string;
  value: string;
  alignement: CanvasTextAlign;
}
