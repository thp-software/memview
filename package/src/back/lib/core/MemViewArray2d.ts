import { Vector2 } from "../../../shared/interfaces/Vector2";
import { MemViewArrayType } from "../../../shared/enums/ArrayType";
import { MemViewArrayLogOptions } from "../../../shared/interfaces/MemViewArrayLogOptions";
import { MemViewArrayBack } from "./MemViewArray";

export class MemViewArray2d extends MemViewArrayBack {
  private data: any[][];

  constructor(id: string, array: any[][], options: MemViewArrayLogOptions) {
    super(id, MemViewArrayType.Array2d, options);
    this.data = array;
  }

  public getSize() {
    const maxSize: Vector2 = { x: 0, y: this.data.length };

    for (let iY = 0; iY < this.data.length; iY++) {
      if (this.data[iY].length > maxSize.x) {
        maxSize.x = this.data[iY].length;
      }
    }

    return maxSize;
  }

  public setData(data: any[][]) {
    this.data = data;
    this._iteration++;
  }

  public getData(): any[] {
    return this.data;
  }
}
