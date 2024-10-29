import { Vector2 } from "./Vector2";

export interface Atlas {
  /**
   * Atlas data in base64
   */
  texture: string;
  /**
   * Count of textures in atlas
   */
  textureCount: Vector2;
  /**
   * Size of each texture in pixels
   */
  textureSize: Vector2;
}
