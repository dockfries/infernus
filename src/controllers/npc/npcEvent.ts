import {
  OnNpcConnect,
  OnNpcDisconnect,
  OnNPCModeExit,
  OnNPCModeInit,
  OnNPCSpawn,
} from "@/wrapper/callbacks";

export abstract class BaseNpcEvent {
  constructor() {
    OnNpcConnect(this.onConnect);
    OnNpcDisconnect(this.onDisconnect);
    OnNPCModeInit(this.onModeInit);
    OnNPCModeExit(this.onModeExit);
    OnNPCSpawn(this.onSpawn);
  }
  protected abstract onConnect(myplayerid: number): void;
  protected abstract onDisconnect(reason: string): void;
  protected abstract onModeInit(): void;
  protected abstract onModeExit(): void;
  protected abstract onSpawn(): void;
}
