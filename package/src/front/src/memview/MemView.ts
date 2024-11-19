import { Vector2 } from "../../../shared/interfaces/Vector2";
import { io, Socket } from "socket.io-client";
import { MemViewArrayType } from "../../../shared/enums/ArrayType";
import { MemViewArray2dFlat } from "./arrays/MemViewArray2dFlat";
import { MemViewArray2d } from "./arrays/MemViewArray2d";
import EventEmitter from "eventemitter3";
import { MemViewRender } from "./render/MemViewRender";
import { MemViewRenderCPU } from "./render/cpu/MemViewRenderCPU";
import { decodeMapper } from "../../../shared/Utils/mapper";
import { ArrayUpdate } from "../../../shared/interfaces/ArrayUpdate";
import { DisplayUpdate } from "../../../shared/interfaces/DisplayUpdate";
import { MemViewArrayFront } from "./arrays/MemViewArray";
import { MemViewMapper } from "../../../shared/interfaces/MemViewMapper";
import { KeyCode } from "../../../shared/enums/KeyCode";
import { zooms } from "../../../shared/enums/Zoom";
import { ViewData } from "../../../shared/interfaces/ViewData";
import { AudioManager } from "../../../shared/Utils/AudioManager";
import { AudioPlayer } from "./utils/AudioPlayer";

export class MemView {
  private container: HTMLDivElement;

  private eventEmitter: EventEmitter;

  private arrays: MemViewArrayFront[] = [];

  private displays: DisplayUpdate[] = [];

  private memViewRender: MemViewRender | null = null;

  private offset: Vector2 = { x: 0, y: 0 };
  private startDrag: Vector2 = { x: 0, y: 0 };
  private mouseLocal: Vector2 = { x: 0, y: 0 };
  private cellPosition: Vector2 = { x: 0, y: 0 };
  private isDragging: boolean = false;

  private hoveredArray: MemViewArrayFront | null = null;
  private hoveredArrayCell: Vector2 = { x: 0, y: 0 };

  private zooms: number[] = zooms;

  private zoomIndex: number = 6;

  private socket: Socket | undefined = undefined;
  private location: Location;

  private _isConnected: boolean = false;
  public get isConnected(): boolean {
    return this._isConnected;
  }

  private _options: any = {};
  public get options(): any {
    return this._options;
  }

  private _showSideBar: boolean = false;
  public get showSideBar(): boolean {
    return this._showSideBar;
  }

  pressedKeys: Map<KeyCode, boolean> = new Map<KeyCode, boolean>();

  private viewData: ViewData | undefined = undefined;

  private audioManager: AudioManager;
  private audioPlayer: AudioPlayer;

  public constructor(container: HTMLDivElement, location: Location) {
    this.container = container;

    this.eventEmitter = new EventEmitter();

    this.audioManager = new AudioManager();
    this.audioPlayer = new AudioPlayer();

    this.location = location;

    this.initSocketClient();
  }

  public initSocketClient() {
    this.socket = io(`http://${this.location.host}`, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 1000,
    });

    if (this.socket) {
      this.socket.on("connect", () => {
        this._isConnected = true;
        this.onConnect();
      });

      this.socket.on("disconnect", () => {
        this._isConnected = false;
        this.onDisconnect();
      });

      this.socket.on("connect_error", (error: Error) => {
        console.error("Connection error:", error);
        this.onError(error);
      });

      this.socket.on("array_update", (data: any, ack: any) => {
        this.onArrayUpdate(data);
        ack();
      });

      this.socket.on("display_update", (data: any, ack: any) => {
        this.onDisplayUpdate(data);
        ack();
      });

      this.socket.on("set_view", (data: any) => {
        this.viewData = data;
        if (this.viewData) {
          this.setView(this.viewData);
          this.update();
        }
      });

      this.socket.on("array_update_resume", (message: any) => {
        this.onResume(message);
      });

      this.socket.on("audio_load", (message: any) => {
        this.audioManager.add(message.id, message.data, message.type);
      });

      this.socket.on("audio_remove", (message: any) => {
        this.audioManager.remove(message.id);
      });

      this.socket.on("audio_remove_all", () => {
        this.audioManager.removeAll();
      });

      this.socket.on("audio_play", (message: any) => {
        this.audioPlayer.play(
          message.id,
          this.audioManager.get(message.ressourceId)!,
          message.options
        );
      });

      this.socket.on("audio_pause", (message: any) => {
        this.audioPlayer.pause(message.id);
      });

      this.socket.on("audio_resume", (message: any) => {
        this.audioPlayer.resume(message.id);
      });

      this.socket.on("audio_stop", (message: any) => {
        this.audioPlayer.stop(message.id);
      });

      this.socket.on("audio_listener_position", (_: any) => {
        // this.audioPlayer.setListenerPosition(message.position);
      });

      this.socket.on("audio_position", (_: any) => {
        // this.audioPlayer.setPosition(message.id, message.position);
      });

      this.socket.on("audio_volume", (message: any) => {
        this.audioPlayer.setVolume(message.id, message.volume);
      });

      this.socket.on("options", (data: any, ack: any) => {
        this.audioPlayer.stopAll();
        this.audioManager.removeAll();

        this._options = data;
        this.eventEmitter.emit("options", data);

        if (this.memViewRender) {
          this.memViewRender.clean();
          this.memViewRender = null;
        }

        if (this._options.targetRender === "CPU") {
          this.memViewRender = new MemViewRenderCPU();
          this.memViewRender.init(this.container);
        }
        this.bindEvents();

        ack();
      });

      this.socket.on("load_atlas", (data: any, ack: any) => {
        if (this.memViewRender) {
          this.memViewRender.setAtlas(data);
        }
        ack();
      });

      this.socket.on("log", (data: any) => {
        this.eventEmitter.emit("log", data);
      });
    }
  }

  public onResume(message: any) {
    const index: number = this.arrays.findIndex(
      (el) => el.id === message.payload.id
    );

    if (index >= 0) {
      this.arrays[index].setBreakpoint(message.payload.isBreakpoint);
      this.eventEmitter.emit(
        "arrays_update",
        this.arrays.map((el) => {
          return {
            id: el.id,
            type: el.type,
            lastUpdate: el.lastUpdate,
            isOnBreakpoint: el.isBreakpoint,
          };
        })
      );
    }
  }

  public clean() {
    if (this.memViewRender) {
      this.memViewRender.clean();
    }
    this.removeAllListeners();
  }

  private onConnect() {
    this.eventEmitter.emit("connection_status", true);
  }

  private onDisconnect() {
    this.eventEmitter.emit("connection_status", false);
  }

  private onError(error: Error) {
    console.error("Socket.IO error:", error);
  }

  private onArrayUpdate(update: ArrayUpdate) {
    const mapper: MemViewMapper = decodeMapper(update.mapper);

    const index: number = this.arrays.findIndex((el) => el.id === update.id);

    if (index >= 0) {
      if (update.type === MemViewArrayType.Array2dFlat) {
        (this.arrays[index] as MemViewArray2dFlat).setData(update.data);
        this.arrays[index].setBreakpoint(update.isBreakpoint);
        this.arrays[index].setIteration(update.iteration);
        this.arrays[index].setPosition({
          x: update.position.x * 64,
          y: update.position.y * 64,
        });
      } else if (update.type === MemViewArrayType.Array2d) {
        (this.arrays[index] as MemViewArray2d).setData(update.data);
        this.arrays[index].setBreakpoint(update.isBreakpoint);
        this.arrays[index].setIteration(update.iteration);
        this.arrays[index].setPosition({
          x: update.position.x * 64,
          y: update.position.y * 64,
        });
      }
    } else {
      if (update.type === MemViewArrayType.Array2dFlat) {
        if (this.memViewRender) {
          this.arrays.push(
            new MemViewArray2dFlat(
              update.id,
              {
                x: update.size.x,
                y: update.size.y,
              },
              mapper
            )
          );

          (this.arrays[this.arrays.length - 1] as MemViewArray2dFlat).setData(
            update.data
          );

          this.arrays[this.arrays.length - 1].setBreakpoint(
            update.isBreakpoint
          );
          this.arrays[this.arrays.length - 1].setIteration(update.iteration);
          this.arrays[this.arrays.length - 1].setPosition({
            x: update.position.x * 64,
            y: update.position.y * 64,
          });
        }
      } else if (update.type === MemViewArrayType.Array2d) {
        if (this.memViewRender) {
          this.arrays.push(new MemViewArray2d(update.id, mapper));

          (this.arrays[this.arrays.length - 1] as MemViewArray2d).setData(
            update.data
          );

          this.arrays[this.arrays.length - 1].setBreakpoint(
            update.isBreakpoint
          );
          this.arrays[this.arrays.length - 1].setIteration(update.iteration);
          this.arrays[this.arrays.length - 1].setPosition({
            x: update.position.x * 64,
            y: update.position.y * 64,
          });
        }
      }
    }

    this.eventEmitter.emit(
      "arrays_update",
      this.arrays.map((el) => {
        return {
          id: el.id,
          type: el.type,
          lastUpdate: el.lastUpdate,
          isOnBreakpoint: el.isBreakpoint,
          iteration: el.iteration,
        };
      })
    );

    this.update();
    this.updateUI();
  }

  private onDisplayUpdate(update: DisplayUpdate) {
    const index = this.displays.findIndex((el) => el.id === update.id);

    if (index >= 0) {
      this.displays[index] = update;
    } else {
      this.displays.push(update);
    }

    this.update();
  }

  public sendMessage(event: string, message: any) {
    if (this.socket) {
      this.socket.emit(event, message);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  private bindEvents(): void {
    if (this.memViewRender) {
      const topCanvas = this.memViewRender.getTopCanvas();

      if (topCanvas) {
        topCanvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        topCanvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        topCanvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        topCanvas.addEventListener("wheel", this.onMouseWheel.bind(this), {
          passive: true,
        });
        topCanvas.addEventListener("contextmenu", (e) => {
          e.preventDefault();
        });

        window.addEventListener("resize", this.onResize.bind(this));

        for (const key of Object.values(KeyCode)) {
          this.pressedKeys.set(key as KeyCode, false);
        }

        window.addEventListener("keydown", (event: KeyboardEvent) => {
          if (this.pressedKeys.get(event.code as KeyCode) == false) {
            this.socket?.emit("keyboard_event", {
              key: event.code as KeyCode,
              isPressed: true,
            });
          }
          this.pressedKeys.set(event.code as KeyCode, true);
        });

        window.addEventListener("keyup", (event: KeyboardEvent) => {
          this.socket?.emit("keyboard_event", {
            key: event.code as KeyCode,
            isPressed: false,
          });
          this.pressedKeys.set(event.code as KeyCode, false);
        });
      }
    }

    // document.addEventListener("visibilitychange", function () {
    //   if (document.hidden) {
    //     console.log("L'onglet est en arrière-plan");
    //   } else {
    //     console.log("L'onglet est actif");
    //   }
    // });
  }

  public update() {
    if (this.memViewRender) {
      this.memViewRender.clear();

      if (this._options.autoOrder !== "None") {
        this.reOrderArrays();
      }

      for (let i = 0; i < this.arrays.length; i++) {
        const start: number = performance.now();
        this.arrays[i].updateRender(
          this.memViewRender,
          this._options.renderOptions,
          this.offset,
          this.zooms[this.zoomIndex]
        );
        this.arrays[i].setLastRenderTime(performance.now() - start);
      }

      for (let i = 0; i < this.displays.length; i++) {
        // const start: number = performance.now();
        this.memViewRender.drawDisplay(
          {
            x: -this.offset.x + this.displays[i].position.x,
            y: -this.offset.y + this.displays[i].position.y,
          },
          this.displays[i].size,
          this.displays[i].backgroundColor,
          this.zooms[this.zoomIndex],
          this.displays[i].elements
        );
        // this.arrays[i].setLastRenderTime(performance.now() - start);
      }

      this.getArrayUnderMouse();
    }
  }

  public updateUI() {
    if (this.memViewRender) {
      if (this._options.showCursor) {
        this.memViewRender.drawUI(
          this.hoveredArray,
          this.hoveredArrayCell,
          this.offset,
          this.zooms[this.zoomIndex]
        );
      }
    }

    let detailsRaw: string[] | undefined = this.hoveredArray?.mapper.details(
      this.hoveredArray.getData(this.hoveredArrayCell)
    );
    this.eventEmitter.emit(
      "cell",
      this.hoveredArray !== null
        ? {
            position: this.hoveredArrayCell,
            id: this.hoveredArray?.id,
            type: this.hoveredArray?.type,
            detailsRaw,
            lastRenderTime: this.hoveredArray.lastRenderTime,
            size: this.hoveredArray.getSize(),
          }
        : null
    );
  }

  /**
   * For every mouse move
   */
  private onMouseMove(event: MouseEvent) {
    const rect = { left: 0, top: 0 };

    this.mouseLocal = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    this.cellPosition = {
      x: Math.floor(
        (this.offset.x + this.mouseLocal.x / this.zooms[this.zoomIndex]) / 64
      ),
      y: Math.floor(
        (this.offset.y + this.mouseLocal.y / this.zooms[this.zoomIndex]) / 64
      ),
    };

    this.getArrayUnderMouse();

    if (this.hoveredArray !== null) {
      this.socket?.emit("array_hover", {
        id: this.hoveredArray.getId(),
        position: this.hoveredArrayCell,
      });
    }

    if (!this._options.lockDrag && this.isDragging) {
      const newOffset: Vector2 = {
        x:
          this.startDrag.x -
          (event.clientX - rect.left) / this.zooms[this.zoomIndex],
        y:
          this.startDrag.y -
          (event.clientY - rect.top) / this.zooms[this.zoomIndex],
      };

      this.offset = {
        x: newOffset.x,
        y: newOffset.y,
      };
      this.update();
      this.updateUI();
    }
    this.updateUI();
  }

  /**
   * For every mouse click (press)
   */
  private onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      if (this.hoveredArray !== null) {
        this.socket?.emit("array_mouse_down", {
          id: this.hoveredArray.getId(),
          position: this.hoveredArrayCell,
        });
      }
    } else if (event.button === 2) {
      const rect = { left: 0, top: 0 };
      this.startDrag = {
        x:
          (event.clientX - rect.left) / this.zooms[this.zoomIndex] +
          this.offset.x,
        y:
          (event.clientY - rect.top) / this.zooms[this.zoomIndex] +
          this.offset.y,
      };
      this.isDragging = true;
    }
  }

  /**
   * For every mouse click (release)
   */
  private onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      if (this.hoveredArray !== null) {
        this.socket?.emit("array_mouse_up", {
          id: this.hoveredArray.getId(),
          position: this.hoveredArrayCell,
        });
      }
    } else if (event.button === 2) {
      this.isDragging = false;
    }
  }

  /**
   * For every mouse wheel event
   */
  private onMouseWheel(event: WheelEvent) {
    if (this._options.lockZoom) {
      return;
    }
    const previousZoom = this.zooms[this.zoomIndex];

    let newIndex = this.zoomIndex + (event.deltaY < 0 ? 1 : -1);

    newIndex = Math.min(newIndex, this.zooms.length - 1);

    newIndex = Math.max(newIndex, 0);

    if (this.zoomIndex !== newIndex) {
      this.zoomIndex = newIndex;

      const newZoom = this.zooms[this.zoomIndex];

      if (event.deltaY < 0) {
        // Zoom in
        this.offset = {
          x: this.offset.x + this.mouseLocal.x / this.zooms[this.zoomIndex],
          y: this.offset.y + this.mouseLocal.y / this.zooms[this.zoomIndex],
        };
      } else if (event.deltaY > 0) {
        // Zoom out
        this.offset = {
          x:
            this.offset.x -
            (this.mouseLocal.x / newZoom - this.mouseLocal.x / previousZoom),
          y:
            this.offset.y -
            (this.mouseLocal.y / newZoom - this.mouseLocal.y / previousZoom),
        };
      }
    }

    this.update();
    this.updateUI();
  }

  private onResize() {
    this.memViewRender?.onResize();

    if (this.viewData && this.viewData.handleResize) {
      this.setView(this.viewData);
    }

    this.update();
    this.updateUI();
  }

  public reOrderArrays() {
    if (this.arrays.length === 0) {
      return;
    }

    let previousArrayPosition: Vector2 = {
      x: 0,
      y: 0,
    };

    this.arrays[0].setPosition(previousArrayPosition);

    let previousArraySize: Vector2 = this.arrays[0].getSize();

    previousArraySize = {
      x: previousArraySize.x * 64,
      y: previousArraySize.y * 64,
    };

    let highestArrayPreviousLine: number = previousArraySize.y;

    for (let i = 1; i < this.arrays.length; i++) {
      let newPosition: Vector2 = { x: 0, y: 0 };

      if (
        this._options.autoOrder === "Row" ||
        this._options.autoOrder === "Wrap"
      ) {
        newPosition = {
          x: previousArrayPosition.x + previousArraySize.x + 256,
          y: previousArrayPosition.y,
        };
      } else if (this._options.autoOrder === "Column") {
        newPosition = {
          x: previousArrayPosition.x,
          y: previousArrayPosition.y + previousArraySize.y + 256,
        };
      }

      if (this._options.autoOrder === "Wrap") {
        if (previousArraySize.y > highestArrayPreviousLine) {
          highestArrayPreviousLine = previousArraySize.y;
        }

        if (newPosition.x + previousArraySize.x > 512 * 64) {
          newPosition.x = 0;
          newPosition.y =
            previousArrayPosition.y + highestArrayPreviousLine + 256;
          highestArrayPreviousLine = 0;
        }
      }

      this.arrays[i].setPosition(newPosition);

      previousArrayPosition = newPosition;

      previousArraySize = this.arrays[i].getSize();

      previousArraySize = {
        x: previousArraySize.x * 64,
        y: previousArraySize.y * 64,
      };
    }
  }

  public reOrderArraysRow() {
    if (this.arrays.length === 0) {
      return;
    }

    let previousArrayPosition: Vector2 = {
      x: 0,
      y: 0,
    };

    this.arrays[0].setPosition(previousArrayPosition);

    let previousArraySize: Vector2 = this.arrays[0].getSize();

    previousArraySize = {
      x: previousArraySize.x * 64,
      y: previousArraySize.y * 64,
    };

    let highestArrayPreviousLine: number = previousArraySize.y;

    for (let i = 1; i < this.arrays.length; i++) {
      let newPosition: Vector2 = {
        x: previousArrayPosition.x + previousArraySize.x + 256,
        y: previousArrayPosition.y,
      };

      if (previousArraySize.y > highestArrayPreviousLine) {
        highestArrayPreviousLine = previousArraySize.y;
      }

      this.arrays[i].setPosition(newPosition);

      previousArrayPosition = newPosition;

      previousArraySize = this.arrays[i].getSize();

      previousArraySize = {
        x: previousArraySize.x * 64,
        y: previousArraySize.y * 64,
      };
    }
  }

  public reOrderArraysColumn() {
    if (this.arrays.length === 0) {
      return;
    }

    let previousArrayPosition: Vector2 = {
      x: 0,
      y: 0,
    };

    this.arrays[0].setPosition(previousArrayPosition);

    let previousArraySize: Vector2 = this.arrays[0].getSize();

    previousArraySize = {
      x: previousArraySize.x * 64,
      y: previousArraySize.y * 64,
    };

    for (let i = 1; i < this.arrays.length; i++) {
      let newPosition: Vector2 = {
        x: previousArrayPosition.x,
        y: previousArrayPosition.y + previousArraySize.y + 256,
      };

      this.arrays[i].setPosition(newPosition);

      previousArrayPosition = newPosition;

      previousArraySize = this.arrays[i].getSize();

      previousArraySize = {
        x: previousArraySize.x * 64,
        y: previousArraySize.y * 64,
      };
    }
  }

  public getArrayUnderMouse() {
    for (let i = 0; i < this.arrays.length; i++) {
      const position: Vector2 = this.arrays[i].getPosition();
      let size: Vector2 = { x: 0, y: 0 };

      size = this.arrays[i].getSize();

      if (
        this.cellPosition.x >= position.x / 64 &&
        this.cellPosition.y >= position.y / 64 &&
        this.cellPosition.x < position.x / 64 + size.x &&
        this.cellPosition.y < position.y / 64 + size.y
      ) {
        this.hoveredArray = this.arrays[i];
        this.hoveredArrayCell = {
          x: this.cellPosition.x - position.x / 64,
          y: this.cellPosition.y - position.y / 64,
        };
        return;
      }
    }

    this.hoveredArray = null;
  }

  public on(event: string, listener: (...args: any[]) => void) {
    return this.eventEmitter.on(event, listener);
  }

  public off(eventName: string, listener: (...args: any[]) => void) {
    this.eventEmitter.off(eventName, listener);
  }

  public removeAllListeners() {
    this.eventEmitter.removeAllListeners();
  }

  public resumeBreakpoint(id: string) {
    this.socket?.emit("resume_breakpoint", { id });
  }

  public resumeBreakpointLog() {
    this.socket?.emit("resume_breakpoint_log");
  }

  public focusArray(id: string) {
    const index: number = this.arrays.findIndex((el) => el.getId() === id);

    if (index >= 0) {
      const position = this.arrays[index].getPosition();
      const size = {
        x: this.arrays[index].getSize().x,
        y: this.arrays[index].getSize().y,
      };

      this.focusPosition({
        x: position.x + size.x / 2,
        y: position.y + size.y / 2,
      });
      this.update();
    }
  }

  public focusPosition(position: Vector2) {
    this.offset = {
      x: position.x * 64 - window.innerWidth / this.zooms[this.zoomIndex] / 2,
      y: position.y * 64 - window.innerHeight / this.zooms[this.zoomIndex] / 2,
    };
    this.update();
  }

  public setView(viewData: ViewData) {
    let newIndex = viewData.zoom;

    newIndex = Math.min(newIndex, this.zooms.length - 1);

    newIndex = Math.max(newIndex, 0);

    this.zoomIndex = newIndex;

    this.offset = {
      x:
        viewData.position.x * 64 -
        window.innerWidth / this.zooms[this.zoomIndex] / 2,
      y:
        viewData.position.y * 64 -
        window.innerHeight / this.zooms[this.zoomIndex] / 2,
    };
  }
}
