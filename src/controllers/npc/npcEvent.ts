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
