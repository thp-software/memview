import { MemViewRenderOptions } from "./MemViewRenderOptions";

export interface MemViewOptions {
  /**
   * Port of the interface : http://localhost:[PORT]
   */
  port: number;
  /**
   * Must open a new tab each time you start it
   */
  openNewTab: boolean;
  /**
   * Must wait for the interface tab to be open before continuing
   */
  waitForTab: boolean;
  /**
   * Show the side bar
   */
  showSideBar: boolean;
  /**
   * Rendering target
   */
  targetRender: "CPU" | "GPU";
  /**
   * Way to order the arrays on map.
   * Set "None" if you want to position them yourself
   */
  autoOrder: "None" | "Row" | "Column" | "Wrap";

  renderOptions: MemViewRenderOptions;
}
