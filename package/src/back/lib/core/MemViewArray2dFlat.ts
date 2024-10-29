import { Vector2 } from "../../../shared/interfaces/Vector2";
import { MemViewArrayType } from "../../../shared/enums/ArrayType";
import { MemViewArrayLogOptions } from "../../../shared/interfaces/MemViewArrayLogOptions";
import { MemViewArrayBack } from "./MemViewArray";

export class MemViewArray2dFlat extends MemViewArrayBack {
  private data: any[];
  private size: Vector2;

  constructor(
    id: string,
    array: any[],
    size: Vector2,
    options: MemViewArrayLogOptions
  ) {
    super(id, MemViewArrayType.Array2dFlat, options);
    this.data = array;
    this.size = size;
  }

  public setData(data: any[]) {
    this.data = data;
    this._iteration++;
  }

  public getData(): any[] {
    return this.data;
  }

  public getSize(): Vector2 {
    return this.size;
  }
}
