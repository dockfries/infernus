import { EventBus } from "core/utils/eventBus";

export enum _3dTextHooks {
  created = "On3dTextCreate",
  destroyed = "On3dTextDestroy",
}

export const _3dTextBus = new EventBus();
