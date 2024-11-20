import { Howl } from "howler";

import { AudioPlayerOptions } from "../../../../shared/interfaces/AudioPlayerOptions";
import { AudioRessource } from "../../../../shared/Utils/AudioManager";

export interface AudioInstance {
  id: string;
  audio: Howl;
}

export class AudioPlayer {
  private instanciedAudio: AudioInstance[] = [];

  // public setListenerPosition(position: Vector2) {
  //   Howler.pos(position.x, position.y, 0);
  // }

  public play(
    id: string,
    ressource: AudioRessource,
    options: AudioPlayerOptions
  ) {
    const index: number = this.instanciedAudio.findIndex((el) => el.id === id);

    if (index >= 0) {
      return;
    }

    const url = AudioPlayer.convertArrayBufferToBlob(
      ressource.data,
      ressource.type
    );

    try {
      let audio = new Howl({
        src: [url],
        html5: false,
        autoplay: true,
        format: [ressource.type],
        volume: options.volume,
        loop: options.loop,
        onend: () => {
          if (!options.loop) {
            const newIndex = this.instanciedAudio.findIndex(
              (el) => el.id === id
            );
            this.instanciedAudio.splice(newIndex, 1);
          }
        },
      });

      // audio.pannerAttr({
      //   panningModel: "HRTF",
      //   refDistance: 1,
      //   rolloffFactor: 1,
      //   maxDistance: 100,
      //   distanceModel: "inverse",
      // });

      // if (options.isSpatial) {
      //   audio.pos(options.position.x, options.position.y, 0);
      // }

      audio.play();

      this.instanciedAudio.push({ id, audio });
    } catch (e) {
      console.error(e);
    }
  }

  public pause(id: string) {
    const index: number = this.instanciedAudio.findIndex((el) => el.id === id);
    if (index < 0) {
      return;
    }

    this.instanciedAudio[index].audio.pause();
  }

  public resume(id: string) {
    const index: number = this.instanciedAudio.findIndex((el) => el.id === id);
    if (index < 0) {
      return;
    }

    this.instanciedAudio[index].audio.play();
  }

  public stop(id: string) {
    const index: number = this.instanciedAudio.findIndex((el) => el.id === id);
    if (index < 0) {
      return;
    }

    this.instanciedAudio[index].audio.stop();

    this.instanciedAudio.splice(index, 1);
  }

  public stopAll() {
    for (let i = 0; i < this.instanciedAudio.length; i++) {
      this.instanciedAudio[i].audio.stop();
    }
    this.instanciedAudio = [];
  }

  // public setPosition(id: string, position: Vector2) {
  //   const index: number = this.instanciedAudio.findIndex((el) => el.id === id);
  //   if (index < 0) {
  //     return;
  //   }

  //   this.instanciedAudio[index].audio.pos(position.x, position.y, 0);
  // }

  public setVolume(id: string, volume: number) {
    const index: number = this.instanciedAudio.findIndex((el) => el.id === id);
    if (index < 0) {
      return;
    }

    this.instanciedAudio[index].audio.volume(volume);
  }

  public static convertArrayBufferToBlob(
    data: ArrayBuffer,
    type: string
  ): string {
    var arrayBufferView = new Uint8Array(data);
    const blob = new Blob([arrayBufferView], { type: `audio/${type}` });
    return URL.createObjectURL(blob);
  }
}
