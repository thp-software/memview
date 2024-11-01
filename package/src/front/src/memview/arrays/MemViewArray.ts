import { Vector2 } from "../../../../shared/interfaces/Vector2";
import { MemViewArrayType } from "../../../../shared/enums/ArrayType";
import { MemViewRender } from "../render/MemViewRender";
import { MemViewArray } from "../../../../shared/arrays/MemViewArray";
import { MemViewMapper } from "../../../../shared/interfaces/MemViewMapper";
import { MemViewRenderOptions } from "../../../../shared/interfaces/MemViewRenderOptions";

export abstract class MemViewArrayFront extends MemViewArray {
  protected _lastRenderTime: number;
  public get lastRenderTime(): number {
    return this._lastRenderTime;
  }

  protected _mapper: MemViewMapper;
  public get mapper(): MemViewMapper {
    return this._mapper;
  }

  public constructor(
    id: string,
    type: MemViewArrayType,
    mapper: MemViewMapper
  ) {
    super(id, type);
    this._mapper = mapper;
    this._lastRenderTime = 0;
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  public getId(): string {
    return this.id;
  }

  public getType(): MemViewArrayType {
    return this.type;
  }

  public getLastUpdate(): number {
    return this.lastUpdate;
  }

  public getLastRenderTime(): number {
    return this.lastRenderTime;
  }

  public setLastRenderTime(deltaTime: number): void {
    this._lastRenderTime = deltaTime;
  }

  public abstract getData(position: Vector2): any | undefined;
  public abstract getSize(): Vector2;
  public abstract updateRender(
    memViewRender: MemViewRender,
    renderOptions: MemViewRenderOptions,
    offset: Vector2,
    zoomFactor: number
  ): void;
}
