import { GangZoneCb } from "../../interfaces/GangZone";

export const OnPlayerEnterPlayerGangZone = (fn: GangZoneCb) => {
  samp.on("OnPlayerEnterPlayerGangZone", fn);
};
export const OnPlayerLeavePlayerGangZone = (fn: GangZoneCb) => {
  samp.on("OnPlayerLeavePlayerGangZone", fn);
};
