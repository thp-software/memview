import { Vector2 } from "./Vector2";

export interface MemViewMapperOutput {
  onHover: (position: Vector2) => void;
  onMouseDown: (position: Vector2) => void;
  onMouseUp: (position: Vector2) => void;
}
