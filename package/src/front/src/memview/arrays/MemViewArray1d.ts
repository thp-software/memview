import { Vector2 } from "../../../../shared/interfaces/Vector2";
import { MemViewArrayType } from "../../../../shared/enums/ArrayType";
import { MemViewRender } from "../render/MemViewRender";
import { MemViewArrayFront } from "./MemViewArray";
import { MemViewMapper } from "../../../../shared/interfaces/MemViewMapper";

export class MemViewArray1d extends MemViewArrayFront {
  private data: any[] = [];

  public constructor(id: string, mapper: MemViewMapper) {
    super(id, MemViewArrayType.Array1d, mapper);
  }

  public updateRender(
    memViewRender: MemViewRender,
    offset: Vector2,
    zoomFactor: number
  ) {
    memViewRender.draw1dArray(
      this.id,
      { x: -offset.x + this.position.x, y: -offset.y + this.position.y },
      zoomFactor,
      this.data,
      this.mapper,
      this.isBreakpoint
    );
  }

  public getData(position: Vector2): any | undefined {
    if (position.x >= 0 && position.x < this.data.length) {
      return this.data[position.x];
    }
    return undefined;
  }

  public getSize(): Vector2 {
    return { x: this.data.length, y: 1 };
  }

  public setData(data: any[][]): void {
    this.data = data;
    this._lastUpdate = Date.now();
  }
}
