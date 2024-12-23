import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { open } from "openurl";
import * as fs from "fs";

import { Vector2 } from "../../shared/interfaces/Vector2";
import { MemViewArray2dFlat } from "./core/MemViewArray2dFlat";
import { MemViewArray2d } from "./core/MemViewArray2d";
import { MemViewArray1d } from "./core/MemViewArray1d";
import { MemViewArrayType } from "../../shared/enums/ArrayType";
import {
  DeepPartial,
  DeepPartialExceptFunctions,
} from "../../shared/types/DeepPartial";
import { Atlas } from "../../shared/interfaces/Atlas";
import { LogData } from "../../shared/interfaces/LogData";
import { LogLevel } from "../../shared/enums/LogLevel";
import { mergeBaseMemViewArrayLogOptions } from "../../shared/data/BaseMemViewArrayLogOptions";
import { __filename, __dirname } from "./others/Utils";
import { MemViewArrayBack } from "./core/MemViewArray";
import { ArrayUpdate } from "../../shared/interfaces/ArrayUpdate";
import { encodeMapper } from "../../shared/utils/mapper";
import { MemViewOptions } from "../../shared/interfaces/MemViewOptions";
import { MemViewArrayLogOptions } from "../../shared/interfaces/MemViewArrayLogOptions";
import { MemViewLogOptions } from "../../shared/interfaces/MemViewLogOptions";
import { mergeBaseMemViewLogOptions } from "../../shared/data/BaseMemViewLogOptions";
import { KeyCode } from "../../shared/enums/KeyCode";
import { KeyEvent } from "../../shared/interfaces/KeyEvent";
import { Zoom } from "../../shared/enums/Zoom";
import { MemViewDisplayLogOptions } from "../../shared/interfaces/MemViewDisplayLogOptions";
import { DisplayUpdate } from "../../shared/interfaces/DisplayUpdate";
import { mergeBaseMemViewDisplayLogOptions } from "../../shared/data/BaseMemViewDisplayLogOptions";
import { ViewData } from "../../shared/interfaces/ViewData";
import { AudioManager, AudioRessource } from "../../shared/utils/AudioManager";
import { AudioPlayerOptions } from "../../shared/interfaces/AudioPlayerOptions";

export default class MemView {
  /**
   * Options of MemView
   */
  private options: MemViewOptions;

  /**
   * Socket server
   */
  private io: Server | undefined = undefined;

  /**
   * Monitored arrays
   */
  private arrays: MemViewArrayBack[] = [];

  private displays: DisplayUpdate[] = [];

  /**
   * Logs history
   */
  private logs: LogData[] = [];

  /**
   * Is the last log in breakpoint
   */
  private logBreakpoint: boolean = false;

  /**
   * Atlas data
   */
  private atlas: Atlas | null = null;

  /**
   * Store Keyboard keys state
   */
  private pressedKeys: Map<KeyCode, boolean> = new Map<KeyCode, boolean>();

  private keyEventCallback: ((data: KeyEvent) => void) | undefined = undefined;

  private viewData: ViewData | undefined = undefined;

  private audioManager: AudioManager;

  constructor() {
    this.options = {
      port: 9000,
      openNewTab: true,
      waitForTab: true,
      showSideBar: true,
      showConsole: true,
      showCursor: true,
      lockDrag: false,
      lockZoom: false,
      targetRender: "CPU",
      autoOrder: "Wrap",
      renderOptions: {
        bitmapViewThreshold: Zoom.Divide2,
        gridDisplayThreshold: Zoom.Base,
        textureDisplayThreshold: Zoom.Base,
        textDisplayThreshold: Zoom.Base,
      },
    };
    this.audioManager = new AudioManager();
  }

  /**
   * Start the web interface
   * @async
   * @param {MemViewOptions} options
   * @returns
   */
  public async start(options?: DeepPartial<MemViewOptions>): Promise<void> {
    return new Promise((resolve) => {
      if (options) {
        this.options = {
          ...this.options,
          ...options,
          renderOptions: {
            ...this.options.renderOptions,
            ...options.renderOptions,
          },
        };
      }

      for (const key of Object.values(KeyCode)) {
        this.pressedKeys.set(key as KeyCode, false);
      }

      const app = express();

      const httpServer = createServer(app);

      this.io = new Server(httpServer);

      app.use(express.static(__dirname));

      app.get("/", (_, res) => {
        res.sendFile(__dirname + "/index.html");
      });

      this.io.on("connection", (socket) => {
        socket.emit("options", this.options, () => {
          if (this.atlas) {
            socket.emit("load_atlas", this.atlas, () => {});
          }

          const audios: AudioRessource[] = this.audioManager.getAll();
          for (let i = 0; i < audios.length; i++) {
            this.io?.emit("audio_load", {
              id: audios[i].id,
              data: audios[i].data,
              type: audios[i].type,
            });
          }

          if (this.viewData != undefined) {
            socket.emit("set_view", this.viewData);
          }
          for (let i = 0; i < this.arrays.length; i++) {
            if (this.arrays[i].type === MemViewArrayType.Array2dFlat) {
              const toSend: ArrayUpdate = {
                type: MemViewArrayType.Array2dFlat,
                id: this.arrays[i].id,
                data: (this.arrays[i] as MemViewArray2dFlat).getData(),
                size: (this.arrays[i] as MemViewArray2dFlat).getSize(),
                isSync: (this.arrays[i] as MemViewArray2dFlat).options.isSync,
                isBreakpoint: this.arrays[i].isBreakpoint,
                waitFor: (this.arrays[i] as MemViewArray2dFlat).options.waitFor,
                position: this.arrays[i].position,
                zIndex: this.arrays[i].zIndex,
                mapper: encodeMapper(this.arrays[i].options.mapper),
                iteration: this.arrays[i].iteration,
              };
              socket.emit("array_update", toSend);
            } else if (this.arrays[i].type === MemViewArrayType.Array2d) {
              const toSend: ArrayUpdate = {
                type: MemViewArrayType.Array2d,
                id: this.arrays[i].id,
                data: (this.arrays[i] as MemViewArray2d).getData(),
                size: (this.arrays[i] as MemViewArray2d).getSize(),
                isSync: (this.arrays[i] as MemViewArray2d).options.isSync,
                isBreakpoint: this.arrays[i].isBreakpoint,
                waitFor: (this.arrays[i] as MemViewArray2d).options.waitFor,
                position: this.arrays[i].position,
                zIndex: this.arrays[i].zIndex,
                mapper: encodeMapper(this.arrays[i].options.mapper),
                iteration: this.arrays[i].iteration,
              };
              socket.emit("array_update", toSend);
            } else if (this.arrays[i].type === MemViewArrayType.Array1d) {
              const toSend: ArrayUpdate = {
                type: MemViewArrayType.Array1d,
                id: this.arrays[i].id,
                data: (this.arrays[i] as MemViewArray1d).getData(),
                size: (this.arrays[i] as MemViewArray1d).getSize(),
                isSync: (this.arrays[i] as MemViewArray1d).options.isSync,
                isBreakpoint: this.arrays[i].isBreakpoint,
                waitFor: (this.arrays[i] as MemViewArray1d).options.waitFor,
                position: this.arrays[i].position,
                zIndex: this.arrays[i].zIndex,
                mapper: encodeMapper(this.arrays[i].options.mapper),
                iteration: this.arrays[i].iteration,
              };
              socket.emit("array_update", toSend);
            }
          }
          for (let i = 0; i < this.displays.length; i++) {
            socket.emit("display_update", this.displays[i], () => {});
          }

          socket.emit(
            "log",
            this.logs.length > 100
              ? this.logs.slice(this.logs.length - 100)
              : this.logs
          );

          socket.on("disconnect", () => {
            console.log("Interface disconnected");
          });

          socket.on("array_mouse_down", (data: any) => {
            const index = this.arrays.findIndex((el) => el.id === data.id);
            if (
              index >= 0 &&
              this.arrays[index].options.output.onMouseDown !== undefined
            ) {
              this.arrays[index].options.output.onMouseDown(data.position);
            }
          });

          socket.on("array_mouse_up", (data: any) => {
            const index = this.arrays.findIndex((el) => el.id === data.id);
            if (
              index >= 0 &&
              this.arrays[index].options.output.onMouseUp !== undefined
            ) {
              this.arrays[index].options.output.onMouseUp(data.position);
            }
          });

          socket.on("array_hover", (data: any) => {
            const index = this.arrays.findIndex((el) => el.id === data.id);

            if (
              index >= 0 &&
              this.arrays[index].options.output.onHover !== undefined
            ) {
              this.arrays[index].options.output.onHover(data.position);
            }
          });

          socket.on("display_hover", (data: any) => {
            const index = this.displays.findIndex((el) => el.id === data.id);

            if (index >= 0) {
              const elementIndex = this.displays[index].elements.findIndex(
                (el) => el.id === data.elementId
              );
              if (
                elementIndex >= 0 &&
                this.displays[index].elements[elementIndex].onMouseHover
              ) {
                this.displays[index].elements[elementIndex].onMouseHover();
              }
            }
          });

          socket.on("display_mouse_down", (data: any) => {
            const index = this.displays.findIndex((el) => el.id === data.id);

            if (index >= 0) {
              const elementIndex = this.displays[index].elements.findIndex(
                (el) => el.id === data.elementId
              );
              if (
                elementIndex >= 0 &&
                this.displays[index].elements[elementIndex].onMouseDown
              ) {
                this.displays[index].elements[elementIndex].onMouseDown();
              }
            }
          });

          socket.on("resume_breakpoint", (data: any) => {
            const index = this.arrays.findIndex((el) => el.id === data.id);
            if (index >= 0) {
              this.arrays[index].setBreakpoint(false);
            }
          });

          socket.on("resume_breakpoint_log", () => {
            this.logBreakpoint = false;
          });

          socket.on("keyboard_event", (data: any) => {
            this.pressedKeys.set(data.key, data.isPressed);
            if (this.keyEventCallback) {
              this.keyEventCallback(data);
            }
          });
          resolve();
        });
      });

      httpServer.listen(this.options.port, () => {
        console.log(
          `MemView is served on \x1b[1m\x1b[36mhttp://localhost:${this.options.port}\x1b[0m`
        );
        if (this.options.openNewTab) {
          open(`http://localhost:${this.options.port}`);
        }
        if (!this.options.waitForTab) {
          resolve();
        } else {
          console.log("Waiting on user opening interface...");
        }
      });
    });
  }

  /**
   * Load atlas textures
   * @async
   * @param {string} path - Path of the atlas on the disk
   * @param {Vector2} textureCount - Textures count on x and y
   * @param {Vector2} textureSize - Textures size (in pixels)
   * @returns {boolean} - Return true if loaded and sended to web interface.
   */
  public async loadAtlas(
    path: string,
    textureCount: Vector2,
    textureSize: Vector2
  ): Promise<boolean> {
    return new Promise((resolve) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          console.error("Unable to load file:", err);
          resolve(false);
        }

        this.atlas = {
          texture: `data:image/png;base64,${data.toString("base64")}`,
          textureCount,
          textureSize,
        };

        this.io?.emit("load_atlas", this.atlas, () => {
          resolve(true);
        });
      });
      resolve(false);
    });
  }

  /**
   * Load audio
   * @param {string} - Unique Id of the ressource.
   * @param {string} path - Path of the audio on the disk. Must be an absolute path.
   * @returns {Promise<boolean>}
   */
  public async loadAudio(id: string, path: string): Promise<boolean> {
    return new Promise((resolve) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          console.error("Unable to load file:", err);
          resolve(false);
        }
        const type: string | undefined = path.split(".").pop();
        if (type != undefined && ["wav", "mp3", "ogg"].includes(type)) {
          this.audioManager.add(id, data, type);
          this.io?.emit("audio_load", { id, data, type }, () => {
            resolve(true);
          });
        } else {
          console.error("Only wav, mp3 and ogg are supported");
          resolve(false);
        }
      });
    });
  }

  /**
   * Unload audio
   * @param {string} - Unique Id of the ressource.
   * @returns {Promise<boolean>}
   */
  public unloadAudio(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.audioManager.alreadyExist(id)) {
        this.audioManager.remove(id);
        this.io?.emit("audio_remove", { id }, () => {
          resolve(true);
        });
      }
      resolve(false);
    });
  }

  /**
   * Unload all audio
   */
  public unloadAllAudio(): void {
    this.audioManager.removeAll();
    this.io?.emit("audio_remove_all");
  }

  /**
   * Play audio
   * @param {string} - Id of the played audio
   * @param {string} - Id of the loaded ressource
   * @param {AudioPlayerOptions} - Options
   */
  public playAudio(
    id: string,
    ressourceId: string,
    options?: AudioPlayerOptions
  ): void {
    this.io?.emit("audio_play", { id, ressourceId, options });
  }

  /**
   * Pause audio
   * @param {string} - Id of the played audio
   */
  public pauseAudio(id: string): void {
    this.io?.emit("audio_pause", { id });
  }

  /**
   * Resume audio
   * @param {string} - Id of the played audio
   */
  public resumeAudio(id: string): void {
    this.io?.emit("audio_resume", { id });
  }

  /**
   * Stop audio
   * @param {string} - Id of the played audio
   */
  public stopAudio(id: string): void {
    this.io?.emit("audio_stop", { id });
  }

  /**
   * Set the position of the played audio
   * @param {string} - Id of the played audio
   * @param {Vector2} - Position of the audio (for spatialization)
   */
  // public setAudioPosition(id: string, position: Vector2): void {
  //   this.io?.emit("audio_position", { id, position });
  // }

  /**
   * Set the position of the listener
   * @param {Vector2} - Position of the listener
   */
  // public setAudioListenerPosition(position: Vector2): void {
  //   this.io?.emit("audio_listener_position", { position });
  // }

  /**
   * Set the volume of the played audio
   * @param {string} - Id of the played audio
   * @param {number} - Volume
   */
  public setAudioVolume(id: string, volume: number): void {
    this.io?.emit("audio_volume", { id, volume });
  }

  /**
   * Log array (2D Flat)
   * @async
   * @param {string} id - Unique id of the array
   * @param {any[]} data - Reference to the array
   * @param {Vector2} size - Size of the array
   * @param {MemViewArrayLogOptions} options - Options of the log
   * @returns {Promise<void>}
   */
  public async log2dFlat(
    id: string,
    data: any[],
    size: Vector2,
    options?: DeepPartialExceptFunctions<MemViewArrayLogOptions>
  ): Promise<void> {
    return this.logArray(id, data, MemViewArrayType.Array2dFlat, options, size);
  }

  /**
   * Log array (2D)
   * @async
   * @param {string} id - Unique id of the array
   * @param {any[][]} data - Reference to the array
   * @param {MemViewArrayLogOptions} options - Options of the log
   * @returns {Promise<void>}
   */
  public async log2d(
    id: string,
    data: any[][],
    options?: DeepPartialExceptFunctions<MemViewArrayLogOptions>
  ): Promise<void> {
    return this.logArray(id, data, MemViewArrayType.Array2d, options);
  }

  /**
   * Log array (1D)
   * @async
   * @param {string} id - Unique id of the array
   * @param {any[]} data - Reference to the array
   * @param {MemViewArrayLogOptions} options - Options of the log
   * @returns {Promise<void>}
   */
  public async log1d(
    id: string,
    data: any[],
    options?: DeepPartialExceptFunctions<MemViewArrayLogOptions>
  ): Promise<void> {
    return this.logArray(id, data, MemViewArrayType.Array1d, options);
  }

  /**
   * Log a text message
   * @async
   * @param {string} - Message to log
   * @param {MemViewLogOptions} - Options of the log
   * @returns {Promise<void>}
   */
  public async log(
    value: string,
    options?: DeepPartial<MemViewLogOptions>
  ): Promise<void> {
    return this.logMessage(value, LogLevel.log, options);
  }

  /**
   * Log a text message (as a warning)
   * @async
   * @param {string} - Message to log
   * @param {MemViewLogOptions} - Options of the log
   * @returns {Promise<void>}
   */
  public async warn(
    value: string,
    options?: DeepPartial<MemViewLogOptions>
  ): Promise<void> {
    return this.logMessage(value, LogLevel.warn, options);
  }

  /**
   * Log a text message (as an error)
   * @async
   * @param {string} - Message to log
   * @param {MemViewLogOptions} - Options of the log
   * @returns {Promise<void>}
   */
  public async error(
    value: string,
    options?: DeepPartial<MemViewLogOptions>
  ): Promise<void> {
    return this.logMessage(value, LogLevel.error, options);
  }

  public async logDisplay(
    id: string,
    size: Vector2,
    options?: Partial<MemViewDisplayLogOptions>
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const finalOptions = mergeBaseMemViewDisplayLogOptions(options);

      const index = this.displays.findIndex((el) => el.id === id);

      const data: DisplayUpdate = {
        id,
        size,
        isSync: finalOptions.isSync,
        isBreakpoint: finalOptions.isBreakpoint,
        waitFor: finalOptions.waitFor,
        position: finalOptions.position,
        elements: finalOptions.elements,
        backgroundColor: finalOptions.backgroundColor,
      };

      if (index >= 0) {
        this.displays[index] = data;
      } else {
        this.displays.push(data);
      }

      await this.io?.emit("display_update", data, () => {
        resolve();
      });
    });
  }

  /**
   * Set the view position and zoom
   * @param {ViewData} - Position/Zoom to apply
   */
  public setView(viewData: ViewData) {
    this.viewData = viewData;
    this.io?.emit("set_view", viewData);
  }

  /**
   * Get the state of a key
   * @param {KeyCode} - Key code to look at
   * @returns {boolean} Key state
   */
  public getKey(code: KeyCode): boolean {
    if (this.pressedKeys.has(code)) {
      return this.pressedKeys.get(code)!;
    }
    return false;
  }

  /**
   * Assign a callback to key event
   * @param {(event: KeyEvent) => void} - Callback
   */
  public bindKeyEvent(callback: (event: KeyEvent) => void) {
    this.keyEventCallback = callback;
  }

  private async logMessage(
    value: string,
    level: LogLevel,
    options?: DeepPartial<MemViewLogOptions>
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const finalOptions = mergeBaseMemViewLogOptions(options);

      const log: LogData = {
        value:
          typeof value === "object" && value !== null && !Array.isArray(value)
            ? JSON.stringify(value)
            : value,
        level,
        timestamp: Date.now(),
        breakpoint: finalOptions.isBreakpoint,
      };

      this.logs.push(log);
      this.io?.emit("log", [log]);

      if (finalOptions.doubleLog) {
        this.logToConsole(log.value, level);
      }

      if (finalOptions.isBreakpoint) {
        this.logBreakpoint = true;
        await this.waitForLogBreakpointResume();
      }

      resolve();
    });
  }

  private logToConsole(value: string, level: LogLevel) {
    switch (level) {
      case LogLevel.log:
        console.log(value);
        break;
      case LogLevel.warn:
        console.warn(value);
        break;
      case LogLevel.error:
        console.error(value);
        break;
      default:
        console.log(value);
    }
  }

  private async logArray(
    id: string,
    data: any,
    arrayType: MemViewArrayType,
    options?: DeepPartialExceptFunctions<MemViewArrayLogOptions>,
    size: Vector2 = { x: 0, y: 0 }
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const start = performance.now();
      const finalOptions = mergeBaseMemViewArrayLogOptions(options);

      let index = this.arrays.findIndex((el) => el.id === id);
      if (index >= 0) {
        this.setDataForArrayType(this.arrays[index], data, arrayType);
      } else {
        const arrayInstance = this.createArrayInstance(
          id,
          data,
          arrayType,
          finalOptions,
          size
        );
        this.arrays.push(arrayInstance);
        index = this.arrays.length - 1;
        this.setPositionIfDefined(index, finalOptions.position);
        this.setZIndexIfDefined(index, finalOptions.zIndex);
      }

      this.arrays[index].setBreakpoint(finalOptions.isBreakpoint ?? false);

      if (this.io) {
        const toSend: ArrayUpdate = {
          type: arrayType,
          id,
          data,
          size,
          isSync: finalOptions.isSync,
          isBreakpoint: this.arrays[index].isBreakpoint,
          waitFor: finalOptions.waitFor,
          position: this.arrays[index].position,
          zIndex: this.arrays[index].zIndex,
          mapper: encodeMapper(finalOptions.mapper),
          iteration: this.arrays[index].iteration,
        };
        await this.emitArrayUpdate(toSend, index, finalOptions, start, resolve);
      }

      await this.handleAsyncResolution(index, finalOptions, start, resolve);
    });
  }

  private setDataForArrayType(
    arrayInstance: any,
    data: any,
    arrayType: MemViewArrayType
  ) {
    switch (arrayType) {
      case MemViewArrayType.Array2dFlat:
        (arrayInstance as MemViewArray2dFlat).setData(data);
        break;
      case MemViewArrayType.Array2d:
        (arrayInstance as MemViewArray2d).setData(data);
        break;
      case MemViewArrayType.Array1d:
        (arrayInstance as MemViewArray1d).setData(data);
        break;
      default:
        throw new Error("Unknown array type");
    }
  }

  private createArrayInstance(
    id: string,
    data: any,
    type: MemViewArrayType,
    options: MemViewArrayLogOptions,
    size: Vector2
  ) {
    switch (type) {
      case MemViewArrayType.Array2dFlat:
        return new MemViewArray2dFlat(id, data, size, options);
      case MemViewArrayType.Array2d:
        return new MemViewArray2d(id, data, options);
      case MemViewArrayType.Array1d:
        return new MemViewArray1d(id, data, options);
      default:
        throw new Error("Unknown array type");
    }
  }

  private async emitArrayUpdate(
    updateData: ArrayUpdate,
    index: number,
    finalOptions: MemViewArrayLogOptions,
    start: number,
    resolve: () => void
  ) {
    this.io?.emit("array_update", updateData, async () => {
      const delta = performance.now() - start;
      if (this.arrays[index].isBreakpoint) {
        await this.waitForBreakpointResume(index);
        if (this.io) {
          this.io.emit("array_update_resume", {
            type: updateData.type,
            payload: {
              id: updateData.id,
              isBreakpoint: this.arrays[index].isBreakpoint,
            },
          });
        }
        resolve();
      } else {
        finalOptions.waitFor && finalOptions.waitFor > 0
          ? setTimeout(resolve, finalOptions.waitFor - delta)
          : resolve();
      }
    });
  }

  private async handleAsyncResolution(
    index: number,
    finalOptions: MemViewArrayLogOptions,
    start: number,
    resolve: () => void
  ) {
    if (!finalOptions.isSync && !this.arrays[index].isBreakpoint) {
      const delta = performance.now() - start;
      setTimeout(
        resolve,
        finalOptions.waitFor ? finalOptions.waitFor - delta : 0
      );
    }

    if (this.arrays[index].isBreakpoint) {
      await this.waitForBreakpointResume(index);
      if (this.io) {
        this.io.emit("array_update_resume", {
          type: MemViewArrayType.Array2dFlat,
          payload: {
            id: this.arrays[index].id,
            isBreakpoint: this.arrays[index].isBreakpoint,
          },
        });
      }
      resolve();
    }
  }

  private setPositionIfDefined(
    index: number,
    position?: { x: number; y: number }
  ) {
    if (position) {
      this.arrays[index].setPosition({
        x: position.x || 0,
        y: position.y || 0,
      });
    }
  }

  private setZIndexIfDefined(index: number, zIndex?: number) {
    if (zIndex != undefined) {
      this.arrays[index].setZIndex(zIndex || 0);
    }
  }

  private async waitForBreakpointResume(arrayIndex: number): Promise<void> {
    return new Promise(async (resolve) => {
      while (this.arrays[arrayIndex].isBreakpoint) {
        await this.sleep(50);
      }
      resolve();
    });
  }

  private async waitForLogBreakpointResume(): Promise<void> {
    return new Promise(async (resolve) => {
      while (this.logBreakpoint) {
        await this.sleep(50);
      }
      resolve();
    });
  }

  private async sleep(time: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, time));
  }
}
