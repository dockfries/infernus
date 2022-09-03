import { OnGameModeExit, OnGameModeInit } from "@/wrapper/callbacks";
import { GameModeExit } from "@/wrapper/functions";

export abstract class AbstractGM {
  protected OnInit(): void {}
  protected OnExit(): void {}
}

export abstract class BaseGameMode extends AbstractGM {
  private initialized = false;

  public constructor() {
    super();
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

  public isInitialized(): boolean {
    return this.initialized;
  }

  // do something during close/restart server, such as storage of player data
  public exit(): void {
    // it's restart
    GameModeExit();
  }
}
