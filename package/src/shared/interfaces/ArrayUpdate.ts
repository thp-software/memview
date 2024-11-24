import { MemViewArrayType } from "../enums/ArrayType";
import { MemViewMapperSendable } from "./MemViewMapper";
import { Vector2 } from "./Vector2";

export interface ArrayUpdate {
  type: MemViewArrayType;
  id: string;
  data: any;
  size: Vector2;
  isSync: boolean;
  isBreakpoint: boolean;
  waitFor: number;
  iteration: number;
  position: Vector2;
  zIndex: number;
  mapper: MemViewMapperSendable;
}
