export interface AudioRessource {
  id: string;
  data: any;
  type: string;
}

export class AudioManager {
  private ressources: AudioRessource[] = [];

  public alreadyExist(id: string): boolean {
    return this.ressources.findIndex((el) => el.id === id) >= 0;
  }

  public add(id: string, data: any, type: string): boolean {
    if (this.alreadyExist(id)) {
      return false;
    }
    this.ressources.push({ id, data, type });
    return true;
  }

  public remove(id: string): boolean {
    const index: number = this.ressources.findIndex((el) => el.id === id);
    if (index >= 0) {
      this.ressources.splice(index, 1);
      return true;
    }
    return false;
  }

  public removeAll(): void {
    this.ressources = [];
  }

  public get(id: string): AudioRessource | undefined {
    return this.ressources.find((el) => el.id === id);
  }

  public getAll(): AudioRessource[] {
    return this.ressources;
  }
}
