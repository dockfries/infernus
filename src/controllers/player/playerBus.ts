import { EventBus } from "@/utils/eventBus";

export enum playerHooks {
  pause = "OnPlayerPause",
  create = "OnPlayerEventCreate",
  setLocale = "OnPlayerSetLocale",
  setCharset = "OnPlayerSetCharset",
  setIsRecording = "OnPlayerSetIsRecording",
}

export const playerBus = new EventBus();
