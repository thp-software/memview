import { MemViewArray } from "../../../shared/arrays/MemViewArray";
import { MemViewArrayType } from "../../../shared/enums/ArrayType";
import { MemViewArrayLogOptions } from "../../../shared/interfaces/MemViewArrayLogOptions";

export abstract class MemViewArrayBack extends MemViewArray {
  private _options: MemViewArrayLogOptions;
  get options(): MemViewArrayLogOptions {
    return this._options;
  }

  constructor(
    id: string,
    type: MemViewArrayType,
    options: MemViewArrayLogOptions
  ) {
    super(id, type);
    this._options = options;
  }
}
