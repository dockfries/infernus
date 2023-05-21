import type { Player } from "core/controllers/player";
import type { IDynamicActor } from "core/interfaces";
import { logger } from "core/logger";
import { getAnimateDurationByLibName } from "core/utils/animateUtils";
import {
  GetActorSkin,
  SetActorSkin,
  GetActorSpawnInfo,
  GetActorAnimation,
} from "@infernus/wrapper";

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
} from "@infernus/streamer";
import { Streamer } from "../common";
import { actorBus, actorHooks } from "./actorBus";

export class DynamicActor {
  private sourceInfo: IDynamicActor;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(actor: IDynamicActor) {
    this.sourceInfo = actor;
  }
  create(): void | this {
    if (this.id !== -1)
      return logger.warn("[StreamerActor]: Unable to create actor again");
    let { streamdistance, worldid, interiorid, playerid, areaid, priority } =
      this.sourceInfo;
    const { modelid, x, y, z, r, invulnerable, health, extended } =
      this.sourceInfo;

    streamdistance ??= StreamerDistances.ACTOR_SD;
    priority ??= 0;

    if (extended) {
      if (typeof worldid === "number") worldid = [0];
      else worldid ??= [0];
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
      if (Array.isArray(worldid)) worldid = 0;
      else worldid ??= 0;
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
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to destroy the actor before create"
      );
    DestroyDynamicActor(this.id);
    actorBus.emit(actorHooks.destroyed, this);
    return this;
  }
  isValid(): boolean {
    return IsValidDynamicActor(this.id);
  }
  isStreamedIn<P extends Player>(forplayer: P): boolean {
    if (this.id === -1) return false;
    return IsDynamicActorStreamedIn(this.id, forplayer.id);
  }
  getVirtualWorld(): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to get virtual world before create"
      );
    return GetDynamicActorVirtualWorld(this.id);
  }
  setVirtualWorld(vworld: number): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to set virtual world before create"
      );
    return SetDynamicActorVirtualWorld(this.id, vworld);
  }
  applyAnimation(
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
  clearAnimations(): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to clear animation before create"
      );
    return ClearDynamicActorAnimations(this.id);
  }
  getFacingAngle(): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to get facing angle before create"
      );
    return GetDynamicActorFacingAngle(this.id);
  }
  setFacingAngle(ang: number): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to set facing angle before create"
      );
    return SetDynamicActorFacingAngle(this.id, ang);
  }
  getPos() {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to get pos before create");
    return GetDynamicActorPos(this.id);
  }
  setPos(x: number, y: number, z: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to set pos before create");
    return SetDynamicActorPos(this.id, x, y, z);
  }
  getHealth(): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to get health before create");
    return GetDynamicActorHealth(this.id);
  }
  setHealth(health: number): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to set health before create");
    return SetDynamicActorHealth(this.id, health);
  }
  isInvulnerable(): boolean {
    if (this.id === -1) return false;
    return IsDynamicActorInvulnerable(this.id);
  }
  setInvulnerable(invulnerable = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to set invulnerable before create"
      );
    return SetDynamicActorInvulnerable(this.id, invulnerable);
  }
  getPlayerTarget<P extends Player, A extends DynamicActor>(
    player: P,
    actors: Map<number, A>
  ): void | A {
    if (this.id === -1) return undefined;
    const actorId = GetPlayerTargetDynamicActor(player.id);
    return actors.get(actorId);
  }
  getPlayerCameraTarget<P extends Player, A extends DynamicActor>(
    player: P,
    actors: Map<number, A>
  ): void | A {
    if (this.id === -1) return undefined;
    const actorId = GetPlayerCameraTargetDynActor(player.id);
    return actors.get(actorId);
  }
  getSkin(): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to get skin before create");
    return GetActorSkin(this.id);
  }
  setSkin(model: number, ignoreRange = false): void | number {
    if (this.id === -1)
      return logger.warn("[StreamerActor]: Unable to set skin before create");
    if (!ignoreRange && (model < 0 || model > 311 || model == 74)) return 0;
    return SetActorSkin(this.id, model);
  }
  getSpawnInfo() {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to get spawn info before create"
      );
    return GetActorSpawnInfo(this.id);
  }
  getAnimation() {
    if (this.id === -1)
      return logger.warn(
        "[StreamerActor]: Unable to get animation before create"
      );
    return GetActorAnimation(this.id);
  }
  toggleCallbacks(toggle = true): void | number {
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
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.ACTOR, this.id);
  }
}
