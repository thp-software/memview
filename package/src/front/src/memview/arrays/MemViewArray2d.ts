import { Vector2 } from "../../../../shared/interfaces/Vector2";
import { MemViewArrayType } from "../../../../shared/enums/ArrayType";
import { MemViewRender } from "../render/MemViewRender";
import { MemViewArrayFront } from "./MemViewArray";
import { MemViewMapper } from "../../../../shared/interfaces/MemViewMapper";
import { MemViewRenderOptions } from "../../../../shared/interfaces/MemViewRenderOptions";

export class MemViewArray2d extends MemViewArrayFront {
  private data: any[][] = [];

  public constructor(id: string, mapper: MemViewMapper) {
    super(id, MemViewArrayType.Array2d, mapper);
  }

  public updateRender(
    memViewRender: MemViewRender,
    renderOptions: MemViewRenderOptions,
    offset: Vector2,
    zoomFactor: number
  ) {
    memViewRender.draw2dArray(
      this.id,
      { x: -offset.x + this.position.x, y: -offset.y + this.position.y },
      zoomFactor,
      this.data,
      this.mapper,
      this.isBreakpoint,
      renderOptions
    );
  }

  public getData(position: Vector2): any | undefined {
    if (position.y >= 0 && position.y < this.data.length) {
      if (position.x >= 0 && position.x < this.data[position.y].length) {
        return this.data[position.y][position.x];
      }
    }
    return undefined;
  }

  public getSize(): Vector2 {
    const maxSize: Vector2 = { x: 0, y: this.data.length };

    for (let iY = 0; iY < this.data.length; iY++) {
      if (this.data[iY].length > maxSize.x) {
        maxSize.x = this.data[iY].length;
      }
    }

    return maxSize;
  }

  public setData(data: any[][]): void {
    this.data = data;
    this._lastUpdate = Date.now();
  }
}
