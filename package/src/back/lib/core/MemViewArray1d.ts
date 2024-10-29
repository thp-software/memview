import { MemViewArrayType } from "../../../shared/enums/ArrayType";
import { MemViewArrayLogOptions } from "../../../shared/interfaces/MemViewArrayLogOptions";
import { MemViewArrayBack } from "./MemViewArray";

export class MemViewArray1d extends MemViewArrayBack {
  private data: any[];

  constructor(id: string, array: any[], options: MemViewArrayLogOptions) {
    super(id, MemViewArrayType.Array1d, options);
    this.data = array;
  }

  public getSize() {
    return { x: this.data.length, y: 1 };
  }

  public setData(data: any[]) {
    this.data = data;
    this._iteration++;
  }

  public getData(): any[] {
    return this.data;
  }
}
