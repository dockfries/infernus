import { IClientFuncQueue } from "@/interfaces";
import { OnClientCheckResponse } from "@/wrapper/callbacks";

export const ccWaitingQueue: Map<number, IClientFuncQueue> = new Map();

export const delCCTask = (playerId: number, reject = false): boolean => {
  const task = ccWaitingQueue.get(playerId);
  if (!task) return false;
  if (reject) task.reject("timeout");
  clearTimeout(task.timeout);
  ccWaitingQueue.delete(playerId);
  return true;
};

OnClientCheckResponse(
  (
    playerid: number,
    actionid: number,
    memaddr: number,
    retndata: number
  ): number => {
    const callback = ccWaitingQueue.get(playerid);
    if (!callback) return 0;
    clearTimeout(callback.timeout);
    setTimeout(() => callback.resolve({ actionid, memaddr, retndata }));
    return 1;
  }
);
