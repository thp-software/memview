import { MemViewArrayType } from "../../../../shared/enums/ArrayType";
import { Vector2 } from "../../../../shared/interfaces/Vector2";
import { MemViewRender } from "../render/MemViewRender";
import { MemViewArrayFront } from "./MemViewArray";
import { MemViewMapper } from "../../../../shared/interfaces/MemViewMapper";
import { MemViewRenderOptions } from "../../../../shared/interfaces/MemViewRenderOptions";

export class MemViewArray2dFlat extends MemViewArrayFront {
  private data: any[] = [];
  private size: Vector2;

  public constructor(id: string, size: Vector2, mapper: MemViewMapper) {
    super(id, MemViewArrayType.Array2dFlat, mapper);
    this.size = size;
  }

  public updateRender(
    memViewRender: MemViewRender,
    renderOptions: MemViewRenderOptions,
    offset: Vector2,
    zoomFactor: number
  ) {
    memViewRender.draw2dFlatArray(
      this.id,
      { x: -offset.x + this.position.x, y: -offset.y + this.position.y },
      this.size,
      zoomFactor,
      this.data,
      this.mapper,
      this.isBreakpoint,
      renderOptions
    );
  }

  public getData(position: Vector2): any | undefined {
    if (
      position.x >= 0 &&
      position.x < this.size.x &&
      position.y >= 0 &&
      position.y < this.size.y
    ) {
      return this.data[position.x + this.size.x * position.y];
    }
    return undefined;
  }

  public getSize(): Vector2 {
    return this.size;
  }

  public setData(data: any[]): void {
    this.data = data;
    this._lastUpdate = Date.now();
  }
}
