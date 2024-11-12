import {
  DisplayElementDiv,
  DisplayElementText,
  DisplayElementTexture,
} from "./MemViewDisplayLogOptions";
import { Vector2 } from "./Vector2";

export interface DisplayUpdate {
  id: string;
  size: Vector2;
  backgroundColor: string;
  isSync: boolean;
  isBreakpoint: boolean;
  waitFor: number;
  position: Vector2;
  elements: (DisplayElementDiv | DisplayElementText | DisplayElementTexture)[];
}
