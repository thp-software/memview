import { CellText } from "./CellText";
import { Vector2 } from "./Vector2";

export interface MemViewElement {
  cellBackgroundColor: string;
  cellAtlasIndex: Vector2;
  cellText: CellText[];
  details: string[];
}
