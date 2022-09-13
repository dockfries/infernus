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
  protected abstract onConnect(myplayerid: number): number;
  protected abstract onDisconnect(reason: string): number;
  protected abstract onModeInit(): number;
  protected abstract onModeExit(): number;
  protected abstract onSpawn(): number;
}
