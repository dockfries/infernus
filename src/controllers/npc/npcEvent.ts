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
    OnNpcConnect(promisifyCallback.call(this, this.onConnect, "OnNpcConnect"));
    OnNpcDisconnect(
      promisifyCallback.call(this, this.onDisconnect, "OnNpcDisconnect")
    );
    OnNPCModeInit(
      promisifyCallback.call(this, this.onModeInit, "OnNPCModeInit")
    );
    OnNPCModeExit(
      promisifyCallback.call(this, this.onModeExit, "OnNPCModeExit")
    );
    OnNPCSpawn(promisifyCallback.call(this, this.onSpawn, "OnNPCSpawn"));
    OnClientMessage(
      promisifyCallback.call(this, this.onClientMessage, "OnClientMessage")
    );
  }
  public abstract onConnect(myplayerid: number): TCommonCallback;
  public abstract onDisconnect(reason: string): TCommonCallback;
  public abstract onModeInit(): TCommonCallback;
  public abstract onModeExit(): TCommonCallback;
  public abstract onSpawn(): TCommonCallback;
  public abstract onClientMessage(color: number, text: string): TCommonCallback;
}
