import { PlayerEvent } from "@infernus/core";
import { INTERNAL_MAP } from "../constants";
import { RemoveBuildingArgs } from "../interfaces";
import { ensureLength } from "../utils/error";
import assert from "node:assert";

PlayerEvent.onConnect(({ player, next }) => {
  const removeBuildGroup = INTERNAL_MAP.removedBuilding.flat();
  removeBuildGroup.forEach((removeBuilding) => {
    player.removeBuilding(...removeBuilding);
  });
  return next();
});

export function removeBuildingParser(line: string[]) {
  ensureLength("removeBuilding", line, 6, line.length);
  return line.slice(1).map((val) => {
    const _val = +val;
    assert(!Number.isNaN(_val));
    return _val;
  }) as RemoveBuildingArgs[0];
}
