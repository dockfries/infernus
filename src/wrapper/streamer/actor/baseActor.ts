import type { BasePlayer } from "@/controllers/player";
import type { IDynamicActor } from "@/interfaces";
import { logger } from "@/logger";
import { getAnimateDurationByLibName } from "@/utils/animateUtils";
import {
  GetActorSkin,
  SetActorSkin,
  GetActorSpawnInfo,
  GetActorAnimation,
} from "omp-wrapper";

import {
  ApplyDynamicActorAnimation,
  ClearDynamicActorAnimations,
  CreateDynamicActor,
  CreateDynamicActorEx,
  DestroyDynamicActor,
  GetDynamicActorFacingAngle,
  GetDynamicActorHealth,
  GetDynamicActorPos,
  GetDynamicActorVirtualWorld,
  GetPlayerCameraTargetDynActor,
  GetPlayerTargetDynamicActor,
  IsDynamicActorInvulnerable,
  IsDynamicActorStreamedIn,
  IsValidDynamicActor,
  SetDynamicActorFacingAngle,
  SetDynamicActorHealth,
  SetDynamicActorInvulnerable,
  SetDynamicActorPos,
  SetDynamicActorVirtualWorld,
  StreamerDistances,
  StreamerItemTypes,
} from "omp-wrapper-streamer";
import { Streamer } from "../common";
import { actorBus, actorHooks } from "./actorBus";

export class DynamicActor {
  private sourceInfo: IDynamicActor;
  private _id = -1;
  public get id(): number {
    return this._id;
  }
  constructor(actor: IDynamicActor) {
    this.sourceInfo = actor;
  }
  public create(): void | this {
    if (this.id !== -1)
      return logger.warn("[StreamerActor]: Unable to create actor again");
    let { streamdistance, worldid, interiorid, playerid, areaid, priority } =
      this.sourceInfo;
    const { modelid, x, y, z, r, invulnerable, health, extended } =
      this.sourceInfo;

    streamdistance ??= StreamerDistances.ACTOR_SD;
    priority ??= 0;

    if (extended) {
      if (typeof worldid === "number") worldid = [-1];
      else worldid ??= [-1];
      if (typeof interiorid === "number") interiorid = [-1];
      else interiorid ??= [-1];
      if (typeof playerid === "number") playerid = [-1];
      else playerid ??= [-1];
      if (typeof areaid === "number") areaid = [-1];
      else areaid ??= [-1];

      this._id = CreateDynamicActorEx(
        modelid,
        x,
        y,
        z,
        r,
        invulnerable,
        health,
        streamdistance,
        worldid,
        interiorid,
        playerid,
        areaid,
        priority
      );
    } else {
      if (Array.isArray(worldid)) worldid = -1;
      else worldid ??= -1;
      if (Array.isArray(interiorid)) interiorid = -1;
      else interiorid ??= -1;
      if (Array.isArray(playerid)) playerid = -1;
      else playerid ??= -1;
      if (Array.isArray(areaid)) areaid = -1;
      else areaid ??= -1;

      this._id = CreateDynamicActor(
        modelid,
        x,
        y,
        z,
        r,
        invulnerable,
        health,
        worldid,
        interiorid,
        playerid,
        streamdistance,
        areaid,
        priority
      );
    }

    actorBus.emit(actorHooks.created, this);
    return this;
  }
  public destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to destroy the actor before create"
      );
    DestroyDynamicActor(this.id);
    actorBus.emit(actorHooks.destroyed, this);
    return this;
  }
  public isValid(): boolean {
    return IsValidDynamicActor(this.id);
  }
  public isStreamedIn<P extends BasePlayer>(forplayer: P): boolean {
    if (this.id === -1) return false;
    return IsDynamicActorStreamedIn(this.id, forplayer.id);
  }
  public getVirtualWorld(): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to get virtual world before create"
      );
    return GetDynamicActorVirtualWorld(this.id);
  }
  public setVirtualWorld(vworld: number): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to set virtual world before create"
      );
    return SetDynamicActorVirtualWorld(this.id, vworld);
  }
  public applyAnimation(
    animLib: string,
    animName: string,
    loop = false,
    lockX = true,
    lockY = true,
    freeze = false
  ): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to apply animation before create"
      );
    const duration = getAnimateDurationByLibName(animLib, animName);
    if (duration === undefined)
      return logger.error("[StreamerActor]: Invalid anim library or name");
    return ApplyDynamicActorAnimation(
      this.id,
      animLib,
      animName,
      4.1,
      loop,
      lockX,
      lockY,
      freeze,
      loop ? 0 : duration
    );
  }
  public clearAnimations(): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to clear animation before create"
      );
    return ClearDynamicActorAnimations(this.id);
  }
  public getFacingAngle(): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to get facing angle before create"
      );
    return GetDynamicActorFacingAngle(this.id);
  }
  public setFacingAngle(ang: number): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to set facing angle before create"
      );
    return SetDynamicActorFacingAngle(this.id, ang);
  }
  public getPos() {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to get pos before create");
    return GetDynamicActorPos(this.id);
  }
  public setPos(x: number, y: number, z: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to set pos before create");
    return SetDynamicActorPos(this.id, x, y, z);
  }
  public getHealth(): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to get health before create");
    return GetDynamicActorHealth(this.id);
  }
  public setHealth(health: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to set health before create");
    return SetDynamicActorHealth(this.id, health);
  }
  public isInvulnerable(): boolean {
    if (this.id === -1) return false;
    return IsDynamicActorInvulnerable(this.id);
  }
  public setInvulnerable(invulnerable = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to set invulnerable before create"
      );
    return SetDynamicActorInvulnerable(this.id, invulnerable);
  }
  public getPlayerTarget<P extends BasePlayer, A extends DynamicActor>(
    player: P,
    actors: Map<number, A>
  ): void | A {
    if (this.id === -1) return undefined;
    const actorId = GetPlayerTargetDynamicActor(player.id);
    return actors.get(actorId);
  }
  public getPlayerCameraTarget<P extends BasePlayer, A extends DynamicActor>(
    player: P,
    actors: Map<number, A>
  ): void | A {
    if (this.id === -1) return undefined;
    const actorId = GetPlayerCameraTargetDynActor(player.id);
    return actors.get(actorId);
  }
  public getSkin(): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to get skin before create");
    return GetActorSkin(this.id);
  }
  public setSkin(model: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to set skin before create");
    if (model < 0 || model > 311 || model == 74) return 0;
    return SetActorSkin(this.id, model);
  }
  public getSpawnInfo() {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to get spawn info before create"
      );
    return GetActorSpawnInfo(this.id);
  }
  public getAnimation() {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to get animation before create"
      );
    return GetActorAnimation(this.id);
  }
  public toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.ACTOR,
      this.id,
      toggle
    );
  }
  public isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.ACTOR, this.id);
  }
}
