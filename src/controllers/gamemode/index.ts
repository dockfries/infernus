import { OnGameModeExit, OnGameModeInit } from "@/wrapper/callbacks";
import { GameModeExit } from "@/wrapper/functions";

export class BaseGameMode {
  private initialized = false;

  public constructor() {
    OnGameModeInit((): void => {
      if (this.initialized)
        throw new Error("[GameMode]: Cannot be initialized more than once");
      this.initialized = true;
      this.OnInit();
    });
    OnGameModeExit((): void => {
      if (!this.initialized)
        throw new Error("[GameMode]: Cannot be unload more than once");
      this.initialized = false;
      this.OnExit();
    });
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  // do something during close/restart server, such as storage of player data
  public exit(): void {
    // it's restart
    GameModeExit();
  }

  // do something during initialization, such as load some objects
  // final callback to main.ts
  public OnInit(): void {}
  public OnExit(): void {}
}
