import { GangZoneCb } from "../../interfaces/GangZone";

export const OnPlayerEnterGangZone = (fn: GangZoneCb) => {
  samp.on("OnPlayerEnterGangZone", fn);
};
export const OnPlayerLeaveGangZone = (fn: GangZoneCb) => {
  samp.on("OnPlayerLeaveGangZone", fn);
};
