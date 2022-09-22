import { ICommonGangZoneKey } from "@/interfaces";
import { BasePlayer } from "../player";
import { BaseGangZone } from "./baseGangZone";
import { gangZoneBus, gangZoneHooks } from "./gangZoneBus";

export abstract class BaseGangZoneEvent<
  P extends BasePlayer,
  G extends BaseGangZone<P>
> {
  public readonly gangZones = new Map<ICommonGangZoneKey, G>();
  private readonly players;
  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    gangZoneBus.on(
      gangZoneHooks.created,
      (res: { key: ICommonGangZoneKey; value: G }) => {
        this.gangZones.set(res.key, res.value);
      }
    );
    gangZoneBus.on(gangZoneHooks.destroyed, (res: ICommonGangZoneKey) => {
      if (this.gangZones.has(res)) this.gangZones.delete(res);
    });
  }
}
