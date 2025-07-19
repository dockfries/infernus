import { PlayerEvent } from "@infernus/core";
import { INTERNAL_MAP } from "../constants";
import { RemoveBuildingArgs } from "../interfaces";
import { ensureLength } from "../utils/error";

PlayerEvent.onConnect(({ player, next }) => {
  const removeBuildGroup = INTERNAL_MAP.removeBuilding.flat();
  removeBuildGroup.forEach((removeBuilding) => {
    player.removeBuilding(...removeBuilding);
  });
  return next();
});

export function removeBuildingParser(line: string[]) {
  ensureLength("removeBuilding", line, 6, line.length);
  return line.slice(1).map((line) => +line) as RemoveBuildingArgs[0];
}
