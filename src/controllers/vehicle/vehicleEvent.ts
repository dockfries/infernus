import {
  OnNPCEnterVehicle,
  OnNPCExitVehicle,
  OnPlayerEnterVehicle,
  OnPlayerExitVehicle,
  OnVehicleDamageStatusUpdate,
  OnVehicleDeath,
  OnVehicleMod,
  OnVehiclePaintjob,
  OnVehicleRespray,
  OnVehicleSirenStateChange,
  OnVehicleSpawn,
  OnVehicleStreamIn,
  OnVehicleStreamOut,
  OnTrailerUpdate,
} from "@/wrapper/callbacks";
import type { BasePlayer } from "../player";
import type { BaseVehicle } from "./baseVehicle";
import { vehicleBus, vehicleHooks } from "./vehicleBus";

export abstract class BaseVehicleEvent<
  P extends BasePlayer,
  V extends BaseVehicle
> {
  public readonly vehicles = new Map<number, V>();
  private readonly players;

  constructor(playersMap: Map<number, P>) {
    this.players = playersMap;
    // The class event is extended through the event bus
    vehicleBus.on(vehicleHooks.created, (veh: V) => {
      this.vehicles.set(veh.id, veh);
    });
    vehicleBus.on(vehicleHooks.destroyed, (veh: V) => {
      this.vehicles.delete(veh.id);
    });
    OnVehicleDamageStatusUpdate((vehicleid, playerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      return this.onDamageStatusUpdate(v, p);
    });
    OnVehicleDeath((vehicleid, killerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const k = this.findPlayerById(killerid);
      if (!k) return 0;
      return this.onDeath(v, k);
    });
    OnVehicleMod((playerid, vehicleid, componentid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      return this.onMod(p, v, componentid);
    });
    OnVehiclePaintjob((playerid, vehicleid, paintjobid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      return this.onPaintjob(p, v, paintjobid);
    });
    OnVehicleRespray((playerid, vehicleid, color1, color2): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      return this.onRespray(p, v, color1, color2);
    });
    OnVehicleSirenStateChange((playerid, vehicleid, newstate): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      return this.onSirenStateChange(p, v, Boolean(newstate));
    });
    OnVehicleSpawn((vehicleid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      return this.onSpawn(v);
    });
    OnVehicleStreamIn((vehicleid, forplayerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const p = this.findPlayerById(forplayerid);
      if (!p) return 0;
      return this.onStreamIn(v, p);
    });
    OnVehicleStreamOut((vehicleid, forplayerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const p = this.findPlayerById(forplayerid);
      if (!p) return 0;
      return this.onStreamOut(v, p);
    });
    OnPlayerEnterVehicle((playerid, vehicleid, ispassenger): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      return this.onPlayerEnter(p, v, Boolean(ispassenger));
    });
    OnPlayerExitVehicle((playerid, vehicleid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      return this.onPlayerExit(p, v);
    });
    OnNPCEnterVehicle((vehicleid, seatid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      return this.onNpcEnter(v, seatid);
    });
    OnNPCExitVehicle(this.onNpcExit);
    OnTrailerUpdate((playerid, vehicleid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      return this.onTrailerUpdate(p, v);
    });
  }

  protected abstract onDamageStatusUpdate(vehicle: V, player: P): number;
  protected abstract onDeath(vehicle: V, killer: P): number;
  protected abstract onMod(player: P, vehicle: V, componentid: number): number;
  protected abstract onPaintjob(
    player: P,
    vehicle: V,
    paintjobid: number
  ): number;
  protected abstract onRespray(
    player: P,
    vehicle: V,
    color1: number,
    color2: number
  ): number;
  protected abstract onSirenStateChange(
    player: P,
    vehicle: V,
    newstate: boolean
  ): number;
  protected abstract onSpawn(vehicle: V): number;
  protected abstract onStreamIn(vehicle: V, forplayer: P): number;
  protected abstract onStreamOut(vehicle: V, forplayer: P): number;
  protected abstract onPlayerEnter(
    player: P,
    vehicle: V,
    isPassenger: boolean
  ): number;
  protected abstract onPlayerExit(player: P, vehicle: V): number;
  protected abstract onNpcEnter(vehicle: V, seatid: number): number;
  protected abstract onNpcExit(): number;
  protected abstract onTrailerUpdate(player: P, vehicle: V): number;

  public findVehicleById(vehicleid: number) {
    return this.vehicles.get(vehicleid);
  }

  private findPlayerById(playerid: number) {
    return this.players.get(playerid);
  }

  public getVehiclesArr(): Array<V> {
    return [...this.vehicles.values()];
  }
}
