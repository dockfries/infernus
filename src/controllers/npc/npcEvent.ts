import { TCommonCallback } from "@/types";
import { OnClientMessage, promisifyCallback } from "@/utils/helperUtils";
import {
  OnNpcConnect,
  OnNpcDisconnect,
  OnNPCModeExit,
  OnNPCModeInit,
  OnNPCSpawn,
} from "@/wrapper/callbacks";

export abstract class BaseNpcEvent {
  constructor() {
    OnNpcConnect(promisifyCallback(this.onConnect, "OnNpcConnect"));
    OnNpcDisconnect(promisifyCallback(this.onDisconnect, "OnNpcDisconnect"));
    OnNPCModeInit(promisifyCallback(this.onModeInit, "OnNPCModeInit"));
    OnNPCModeExit(promisifyCallback(this.onModeExit, "OnNPCModeExit"));
    OnNPCSpawn(promisifyCallback(this.onSpawn, "OnNPCSpawn"));
    OnClientMessage(promisifyCallback(this.onClientMessage, "OnClientMessage"));
  }
  protected abstract onConnect(myplayerid: number): TCommonCallback;
  protected abstract onDisconnect(reason: string): TCommonCallback;
  protected abstract onModeInit(): TCommonCallback;
  protected abstract onModeExit(): TCommonCallback;
  protected abstract onSpawn(): TCommonCallback;
  protected abstract onClientMessage(
    color: number,
    text: string
  ): TCommonCallback;
}
