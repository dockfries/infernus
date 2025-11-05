import type { Player } from "core/components/player";
import type { IDynamicActor } from "core/interfaces";
import { isValidAnimateName } from "core/utils/animate";
import * as s from "@infernus/streamer";
import { Streamer } from "../common";
import { INTERNAL_FLAGS } from "../../../utils/flags";
import { dynamicActorPool } from "core/utils/pools";

export class DynamicActor {
  private sourceInfo: IDynamicActor | null = null;
  private _id: number = s.StreamerMiscellaneous.INVALID_ID;
  get id(): number {
    return this._id;
  }
  constructor(actorOrId: IDynamicActor | number) {
    if (typeof actorOrId === "number") {
      const obj = DynamicActor.getInstance(actorOrId);
      if (obj) {
        return obj;
      }
      this._id = actorOrId;
      dynamicActorPool.set(this._id, this);
    } else {
      this.sourceInfo = actorOrId;
    }
  }
  create(): this {
    if (this.id !== s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to create again");
    if (!this.sourceInfo)
      throw new Error("[StreamerActor]: Unable to create with only id");
    let { streamDistance, worldId, interiorId, playerId, areaId, priority } =
      this.sourceInfo;
    const { modelId, x, y, z, r, invulnerable, health, extended } =
      this.sourceInfo;

    streamDistance ??= s.StreamerDistances.ACTOR_SD;
    priority ??= 0;

    if (extended) {
      if (typeof worldId === "number") worldId = [0];
      else worldId ??= [0];
      if (typeof interiorId === "number") interiorId = [-1];
      else interiorId ??= [-1];
      if (typeof playerId === "number") playerId = [-1];
      else playerId ??= [-1];
      if (typeof areaId === "number") areaId = [-1];
      else areaId ??= [-1];

      this._id = DynamicActor.__inject__.CreateDynamicActorEx(
        modelId,
        x,
        y,
        z,
        r,
        invulnerable,
        health,
        streamDistance,
        worldId,
        interiorId,
        playerId,
        areaId,
        priority,
      );
    } else {
      if (Array.isArray(worldId)) worldId = 0;
      else worldId ??= 0;
      if (Array.isArray(interiorId)) interiorId = -1;
      else interiorId ??= -1;
      if (Array.isArray(playerId)) playerId = -1;
      else playerId ??= -1;
      if (Array.isArray(areaId)) areaId = -1;
      else areaId ??= -1;

      this._id = DynamicActor.__inject__.CreateDynamicActor(
        modelId,
        x,
        y,
        z,
        r,
        invulnerable,
        health,
        worldId,
        interiorId,
        playerId,
        streamDistance,
        areaId,
        priority,
      );
    }

    dynamicActorPool.set(this.id, this);
    return this;
  }
  destroy(): this {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID && !INTERNAL_FLAGS.skip)
      throw new Error(
        "[StreamerActor]: Unable to destroy the actor before create",
      );
    if (!INTERNAL_FLAGS.skip) {
      DynamicActor.__inject__.DestroyDynamicActor(this.id);
    }
    dynamicActorPool.delete(this.id);
    this._id = s.StreamerMiscellaneous.INVALID_ID;
    return this;
  }
  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== s.StreamerMiscellaneous.INVALID_ID)
      return true;
    return DynamicActor.isValid(this.id);
  }
  isStreamedIn(forPlayer: Player): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicActor.__inject__.IsDynamicActorStreamedIn(
      this.id,
      forPlayer.id,
    );
  }
  getVirtualWorld(): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to get virtual world before create",
      );
    return DynamicActor.__inject__.GetDynamicActorVirtualWorld(this.id);
  }
  setVirtualWorld(vWorld: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to set virtual world before create",
      );
    return DynamicActor.__inject__.SetDynamicActorVirtualWorld(this.id, vWorld);
  }
  applyAnimation(
    animLib: string,
    animName: string,
    speed = 4.1,
    loop = false,
    lockX = true,
    lockY = true,
    freeze = false,
    time = 0,
  ): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to apply animation before create",
      );
    if (!isValidAnimateName(animLib, animName)) {
      throw new Error(
        `[StreamerActor]: Invalid anim library or name ${animLib} ${animName}`,
      );
    }
    return DynamicActor.__inject__.ApplyDynamicActorAnimation(
      this.id,
      animLib,
      animName,
      speed,
      loop,
      lockX,
      lockY,
      freeze,
      time,
    );
  }
  clearAnimations(): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to clear animation before create",
      );
    return DynamicActor.__inject__.ClearDynamicActorAnimations(this.id);
  }
  getFacingAngle() {
    return DynamicActor.__inject__.GetDynamicActorFacingAngle(this.id);
  }
  setFacingAngle(ang: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to set facing angle before create",
      );
    return DynamicActor.__inject__.SetDynamicActorFacingAngle(this.id, ang);
  }
  getPos() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to get pos before create");
    return DynamicActor.__inject__.GetDynamicActorPos(this.id);
  }
  setPos(x: number, y: number, z: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to set pos before create");
    return DynamicActor.__inject__.SetDynamicActorPos(this.id, x, y, z);
  }
  getHealth() {
    return DynamicActor.__inject__.GetDynamicActorHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to set health before create");
    return DynamicActor.__inject__.SetDynamicActorHealth(this.id, health);
  }
  isInvulnerable(): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicActor.__inject__.IsDynamicActorInvulnerable(this.id);
  }
  setInvulnerable(invulnerable = true): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to set invulnerable before create",
      );
    return DynamicActor.__inject__.SetDynamicActorInvulnerable(
      this.id,
      invulnerable,
    );
  }
  getPlayerTarget(player: Player) {
    const actorId = DynamicActor.__inject__.GetPlayerTargetDynamicActor(
      player.id,
    );
    return dynamicActorPool.get(actorId);
  }
  getPlayerCameraTarget(player: Player) {
    const actorId = DynamicActor.__inject__.GetPlayerCameraTargetDynActor(
      player.id,
    );
    return dynamicActorPool.get(actorId);
  }
  getAnimation() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to get animation before create");
    return DynamicActor.__inject__.GetDynamicActorAnimation(this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to toggle callbacks before create",
      );
    return Streamer.toggleItemCallbacks(
      s.StreamerItemTypes.ACTOR,
      this.id,
      toggle,
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.ACTOR, this.id);
  }
  static isValid = s.IsValidDynamicActor;
  static togglePlayerUpdate(player: Player, update = true) {
    return Streamer.toggleItemUpdate(player, s.StreamerItemTypes.ACTOR, update);
  }
  static hideForPlayer(player: Player, z = -50000) {
    Streamer.updateEx(player, 0, 0, z);
    return this.togglePlayerUpdate(player, false);
  }
  static showForPlayer(player: Player, z = -50000) {
    const pos = player.getPos();
    if (pos.ret) {
      Streamer.updateEx(player, pos.x, pos.y, pos.z);
    } else {
      Streamer.updateEx(player, 0, 0, z);
    }
    return this.togglePlayerUpdate(player, true);
  }

  static getInstance(id: number) {
    return dynamicActorPool.get(id);
  }
  static getInstances() {
    return [...dynamicActorPool.values()];
  }

  static __inject__ = {
    CreateDynamicActorEx: s.CreateDynamicActorEx,
    CreateDynamicActor: s.CreateDynamicActor,
    DestroyDynamicActor: s.DestroyDynamicActor,
    GetPlayerTargetDynamicActor: s.GetPlayerTargetDynamicActor,
    GetPlayerCameraTargetDynActor: s.GetPlayerCameraTargetDynActor,
    IsDynamicActorStreamedIn: s.IsDynamicActorStreamedIn,
    GetDynamicActorVirtualWorld: s.GetDynamicActorVirtualWorld,
    SetDynamicActorVirtualWorld: s.SetDynamicActorVirtualWorld,
    ApplyDynamicActorAnimation: s.ApplyDynamicActorAnimation,
    ClearDynamicActorAnimations: s.ClearDynamicActorAnimations,
    GetDynamicActorFacingAngle: s.GetDynamicActorFacingAngle,
    SetDynamicActorFacingAngle: s.SetDynamicActorFacingAngle,
    GetDynamicActorPos: s.GetDynamicActorPos,
    SetDynamicActorPos: s.SetDynamicActorPos,
    GetDynamicActorHealth: s.GetDynamicActorHealth,
    SetDynamicActorHealth: s.SetDynamicActorHealth,
    IsDynamicActorInvulnerable: s.IsDynamicActorInvulnerable,
    SetDynamicActorInvulnerable: s.SetDynamicActorInvulnerable,
    GetDynamicActorAnimation: s.GetDynamicActorAnimation,
  };
}
