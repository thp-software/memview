import { MemViewArrayType } from "../enums/ArrayType";
import { Vector2 } from "../interfaces/Vector2";

export abstract class MemViewArray {
  private _id: string;
  get id(): string {
    return this._id;
  }

  private _type: MemViewArrayType;
  get type(): MemViewArrayType {
    return this._type;
  }

  private _isBreakpoint: boolean;
  get isBreakpoint(): boolean {
    return this._isBreakpoint;
  }

  protected _iteration: number;
  get iteration(): number {
    return this._iteration;
  }

  protected _position: Vector2;
  get position(): Vector2 {
    return this._position;
  }

  protected _zIndex: number;
  get zIndex(): number {
    return this._zIndex;
  }

  protected _lastUpdate: number;
  get lastUpdate(): number {
    return this._lastUpdate;
  }

  constructor(id: string, type: MemViewArrayType) {
    this._id = id;
    this._type = type;
    this._isBreakpoint = false;
    this._iteration = 1;
    this._position = { x: 0, y: 0 };
    this._zIndex = 0;
    this._lastUpdate = Date.now();
  }

  setPosition(position: Vector2) {
    this._position = position;
  }

  setZIndex(zIndex: number) {
    this._zIndex = zIndex;
  }

  setBreakpoint(isBreakpoint: boolean) {
    this._isBreakpoint = isBreakpoint;
  }

  setIteration(iteration: number) {
    this._iteration = iteration;
  }

  public abstract getSize(): Vector2;
}
