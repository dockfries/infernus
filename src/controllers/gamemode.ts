import { OnGameModeExit, OnGameModeInit } from "@/wrapper/callbacks";
import { GameModeExit } from "@/wrapper/functions";

export default class BaseGameMode {
  private static instance: BaseGameMode;
  private initialized = false;

  private constructor() {}

  public static getInstance(): BaseGameMode {
    if (!BaseGameMode.instance) BaseGameMode.instance = new BaseGameMode();
    return BaseGameMode.instance;
  }

  // do something during initialization, such as load some objects
  // final callback to main.ts
  public init(func: () => void): void {
    if (this.initialized)
      throw new Error("[GameMode]: Cannot be initialized more than once");
    this.initialized = true;
    this.OnInit(func);
  }

  public OnInit(callback: () => void) {
    OnGameModeInit((): void => callback());
  }

  // do something during close/restart server, such as storage of player data
  public exit(func: () => void): void {
    if (!this.initialized) return;
    this.initialized = false;
    GameModeExit();
    this.OnExit(func);
  }

  public OnExit(callback: () => void) {
    OnGameModeExit((): void => callback());
  }
}
