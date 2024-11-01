import { Atlas } from "../../../../shared/interfaces/Atlas";
import { MemViewMapper } from "../../../../shared/interfaces/MemViewMapper";
import { MemViewRenderOptions } from "../../../../shared/interfaces/MemViewRenderOptions";
import { Vector2 } from "../../../../shared/interfaces/Vector2";
import { MemViewArrayFront } from "../arrays/MemViewArray";

export interface MemViewRender {
  init(container: HTMLDivElement): boolean;

  clear(): void;

  getTopCanvas(): HTMLCanvasElement | null;

  draw1dArray(
    id: string,
    position: Vector2,
    zoomFactor: number,
    data: any[],
    mapper: MemViewMapper,
    isBreakpoint: boolean,
    renderOptions: MemViewRenderOptions
  ): void;

  draw2dArray(
    id: string,
    position: Vector2,
    zoomFactor: number,
    data: any[],
    mapper: MemViewMapper,
    isBreakpoint: boolean,
    renderOptions: MemViewRenderOptions
  ): void;

  draw2dFlatArray(
    id: string,
    position: Vector2,
    size: Vector2,
    zoomFactor: number,
    data: any[],
    mapper: MemViewMapper,
    isBreakpoint: boolean,
    renderOptions: MemViewRenderOptions
  ): void;

  drawArraysUI(): void;

  drawUI(
    hoveredArray: MemViewArrayFront | null,
    hoveredArrayCell: Vector2,
    offset: Vector2,
    zoomFactor: number
  ): void;

  // setPosition(position: Vector2): void;

  clean(): void;

  onResize(): void;

  setAtlas(atlas: Atlas): void;
}
