import { CellText } from "./CellText";
import { Vector2 } from "./Vector2";

export interface MemViewMapper {
  cellBackgroundColor: (element: any) => string;
  cellAtlasIndex: (element: any) => Vector2;
  cellText: (element: any) => CellText[];
  details: (element: any) => string[];
}

export interface MemViewMapperSendable {
  cellBackgroundColor: string;
  cellAtlasIndex: string;
  cellText: string;
  details: string;
}
