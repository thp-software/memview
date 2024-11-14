import { Zoom } from "../enums/Zoom";
import { Vector2 } from "./Vector2";

export interface ViewData {
  /**
   * Position in unit
   */
  position: Vector2;
  /**
   * Zoom
   */
  zoom: Zoom;
  /**
   * If true, it will apply the last view after the resize of the navigator
   */
  handleResize: boolean;
}
