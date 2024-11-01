import { Zoom } from "../enums/Zoom";

export interface MemViewRenderOptions {
  /**
   * Less or equal to
   */
  bitmapViewThreshold: Zoom;
  /**
   * Greater or equal to
   */
  gridDisplayThreshold: Zoom;
  /**
   * Greater or equal to
   */
  textureDisplayThreshold: Zoom;
  /**
   * Greater or equal to
   */
  textDisplayThreshold: Zoom;
}
