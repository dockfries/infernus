import { IClientFuncQueue } from "@/interfaces";
import { OnClientCheckResponse } from "@/wrapper/callbacks";

export const ccWaitingQueue: Map<number, IClientFuncQueue> = new Map();

export const delCCTask = (playerId: number, reject = false): boolean => {
  const task = ccWaitingQueue.get(playerId);
  if (!task) return false;
  if (reject)
    task.reject(
      "[BasePlayer]: An attempt to check the player client response timed out"
    );
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
    const task = ccWaitingQueue.get(playerid);
    if (!task) return 0;
    clearTimeout(task.timeout);
    setTimeout(() => task.resolve({ actionid, memaddr, retndata }));
    return 1;
  }
);
