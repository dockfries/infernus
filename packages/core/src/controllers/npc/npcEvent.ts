import { TCommonCallback } from "@/types";
import { OnClientMessage, promisifyCallback } from "@/utils/helperUtils";
import {
  OnNpcConnect,
  OnNpcDisconnect,
  OnNPCModeExit,
  OnNPCModeInit,
  OnNPCSpawn,
} from "@/wrapper/native/callbacks";

export abstract class BaseNpcEvent {
  constructor() {
    OnNpcConnect(promisifyCallback(this, "onConnect", "OnNpcConnect"));
    OnNpcDisconnect(promisifyCallback(this, "onDisconnect", "OnNpcDisconnect"));
    OnNPCModeInit(promisifyCallback(this, "onModeInit", "OnNPCModeInit"));
    OnNPCModeExit(promisifyCallback(this, "onModeExit", "OnNPCModeExit"));
    OnNPCSpawn(promisifyCallback(this, "onSpawn", "OnNPCSpawn"));
    OnClientMessage(promisifyCallback(this, "onClientMessage"));
  }
  onConnect?(myplayerid: number): TCommonCallback;
  onDisconnect?(reason: string): TCommonCallback;
  onModeInit?(): TCommonCallback;
  onModeExit?(): TCommonCallback;
  onSpawn?(): TCommonCallback;
  onClientMessage?(colour: number, text: string): TCommonCallback;
}
