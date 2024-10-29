import { MemViewMapper } from "./MemViewMapper";
import { MemViewMapperOutput } from "./MemViewMapperOutput";
import { Vector2 } from "./Vector2";

/*
 * These options need MemView.log* to be called with await.
 * It only freeze the execution flow that enter the log, but not the further one.
 */
export interface MemViewArrayLogOptions {
  /**
   * Wait on interface to render the update before releasing log
   */
  isSync: boolean;
  /*
   * Execution pause until you press play on front side
   */
  isBreakpoint: boolean;
  /*
   * Sleep for
   */
  waitFor: number;
  /**
   * Position on the map (Only if autoOrder = "None")
   */
  position: Vector2;
  /**
   * Mouse output
   */
  output: MemViewMapperOutput;
  /**
   * Mapping of each cell
   */
  mapper: MemViewMapper;
}
