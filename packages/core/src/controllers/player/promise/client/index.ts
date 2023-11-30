import type { IClientFuncQueue } from "../../../../interfaces";
import type { Player } from "../../entity";
import { onCheckResponse } from "../../event";

export const checkResponseQueue: Map<Player, IClientFuncQueue> = new Map();

export const delCheckResponseTask = (
  player: Player,
  reject = false
): boolean => {
  const task = checkResponseQueue.get(player);
  if (!task) return false;
  if (reject) {
    task.reject(
      "[Player]: An attempt to check the player client response timed out"
    );
  }
  clearTimeout(task.timeout);
  checkResponseQueue.delete(player);
  return true;
};

onCheckResponse(({ player, actionId, memAddr, data, next }) => {
  const task = checkResponseQueue.get(player);
  if (!task) return 0;
  clearTimeout(task.timeout);
  setTimeout(() => task.resolve({ actionId, memAddr, data }));
  return next();
});
