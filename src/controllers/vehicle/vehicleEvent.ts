import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
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
  private readonly vehicles = new Map<number, V>();
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
      const pFn = promisifyCallback.call(
        this,
        this.onDamageStatusUpdate,
        "OnVehicleDamageStatusUpdate"
      );
      return pFn(v, p);
    });
    OnVehicleDeath((vehicleid, killerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const k = this.findPlayerById(killerid);
      if (!k) return 0;
      const pFn = promisifyCallback.call(this, this.onDeath, "OnVehicleDeath");
      return pFn(v, k);
    });
    OnVehicleMod((playerid, vehicleid, componentid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      const pFn = promisifyCallback.call(this, this.onMod, "OnVehicleMod");
      return pFn(p, v, componentid);
    });
    OnVehiclePaintjob((playerid, vehicleid, paintjobid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      const pFn = promisifyCallback.call(
        this,
        this.onPaintjob,
        "OnVehiclePaintjob"
      );
      return pFn(p, v, paintjobid);
    });
    OnVehicleRespray((playerid, vehicleid, color1, color2): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      const pFn = promisifyCallback.call(
        this,
        this.onRespray,
        "OnVehicleRespray"
      );
      return pFn(p, v, color1, color2);
    });
    OnVehicleSirenStateChange((playerid, vehicleid, newstate): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onSirenStateChange,
        "OnVehicleSirenStateChange"
      );
      return pFn(p, v, Boolean(newstate));
    });
    OnVehicleSpawn((vehicleid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 1;
      const pFn = promisifyCallback.call(this, this.onSpawn, "OnVehicleSpawn");
      return pFn(v);
    });
    OnVehicleStreamIn((vehicleid, forplayerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const p = this.findPlayerById(forplayerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onStreamIn,
        "OnVehicleStreamIn"
      );
      return pFn(v, p);
    });
    OnVehicleStreamOut((vehicleid, forplayerid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const p = this.findPlayerById(forplayerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onStreamOut,
        "OnVehicleStreamOut"
      );
      return pFn(v, p);
    });
    OnPlayerEnterVehicle((playerid, vehicleid, ispassenger): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerEnter,
        "OnPlayerEnterVehicle"
      );
      return pFn(p, v, Boolean(ispassenger));
    });
    OnPlayerExitVehicle((playerid, vehicleid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onPlayerExit,
        "OnPlayerExitVehicle"
      );
      return pFn(p, v);
    });
    OnNPCEnterVehicle((vehicleid, seatid): number => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onNpcEnter,
        "OnNPCEnterVehicle"
      );
      return pFn(v, seatid);
    });
    OnNPCExitVehicle(
      promisifyCallback.call(this, this.onNpcExit, "OnNPCExitVehicle")
    );
    OnTrailerUpdate((playerid, vehicleid): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const v = this.findVehicleById(vehicleid);
      if (!v) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onTrailerUpdate,
        "OnTrailerUpdate"
      );
      return pFn(p, v);
    });
  }

  public abstract onDamageStatusUpdate(vehicle: V, player: P): TCommonCallback;
  public abstract onDeath(vehicle: V, killer: P): TCommonCallback;
  public abstract onMod(
    player: P,
    vehicle: V,
    componentid: number
  ): TCommonCallback;
  public abstract onPaintjob(
    player: P,
    vehicle: V,
    paintjobid: number
  ): TCommonCallback;
  public abstract onRespray(
    player: P,
    vehicle: V,
    color1: number,
    color2: number
  ): TCommonCallback;
  public abstract onSirenStateChange(
    player: P,
    vehicle: V,
    newstate: boolean
  ): TCommonCallback;
  public abstract onSpawn(vehicle: V): TCommonCallback;
  public abstract onStreamIn(vehicle: V, forplayer: P): TCommonCallback;
  public abstract onStreamOut(vehicle: V, forplayer: P): TCommonCallback;
  public abstract onPlayerEnter(
    player: P,
    vehicle: V,
    isPassenger: boolean
  ): TCommonCallback;
  public abstract onPlayerExit(player: P, vehicle: V): TCommonCallback;
  public abstract onNpcEnter(vehicle: V, seatid: number): TCommonCallback;
  public abstract onNpcExit(): TCommonCallback;
  public abstract onTrailerUpdate(player: P, vehicle: V): TCommonCallback;

  public findVehicleById(vehicleid: number) {
    return this.vehicles.get(vehicleid);
  }

  private findPlayerById(playerid: number) {
    return this.players.get(playerid);
  }

  public getVehiclesArr(): Array<V> {
    return [...this.vehicles.values()];
  }

  public getVehiclesMap(): Map<number, V> {
    return this.vehicles;
  }
}
