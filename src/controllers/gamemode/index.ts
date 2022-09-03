import {
  OnGameModeExit,
  OnGameModeInit,
  OnIncomingConnection,
} from "@/wrapper/callbacks";
import { GameModeExit } from "@/wrapper/functions";
import logger from "@/logger";

export abstract class AbstractGM {
  protected abstract onInit(): void;
  protected abstract onExit(): void;
  protected abstract onIncomingConnection(
    playerid: number,
    ipAddress: string,
    port: number
  ): void;
}

export abstract class BaseGameMode extends AbstractGM {
  private initialized = false;

  public constructor() {
    super();
    OnGameModeInit((): void => {
      if (this.initialized)
        return logger.error(
          new Error("[GameMode]: Cannot be initialized more than once")
        );
      this.initialized = true;
      this.onInit();
    });
    OnGameModeExit((): void => {
      if (!this.initialized)
        return logger.error(
          new Error("[GameMode]: Cannot be unload more than once")
        );
      this.initialized = false;
      this.onExit();
    });
    OnIncomingConnection(this.onIncomingConnection);
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
