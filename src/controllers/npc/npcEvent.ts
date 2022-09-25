import { OnClientMessage } from "@/utils/helperUtils";
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
    OnClientMessage(this.onClientMessage);
  }
  protected abstract onConnect(myplayerid: number): number;
  protected abstract onDisconnect(reason: string): number;
  protected abstract onModeInit(): number;
  protected abstract onModeExit(): number;
  protected abstract onSpawn(): number;
  protected abstract onClientMessage(color: number, text: string): number;
}
