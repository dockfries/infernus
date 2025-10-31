import type { Player } from "core/components/player";
import type { IDynamicActor } from "core/interfaces";
import { isValidAnimateName } from "core/utils/animate";
import * as w from "core/wrapper/native";
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

      this._id = s.CreateDynamicActorEx(
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

      this._id = s.CreateDynamicActor(
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
      s.DestroyDynamicActor(this.id);
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
    return s.IsDynamicActorStreamedIn(this.id, forPlayer.id);
  }
  getVirtualWorld(): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to get virtual world before create",
      );
    return s.GetDynamicActorVirtualWorld(this.id);
  }
  setVirtualWorld(vWorld: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to set virtual world before create",
      );
    return s.SetDynamicActorVirtualWorld(this.id, vWorld);
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
    return s.ApplyDynamicActorAnimation(
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
    return s.ClearDynamicActorAnimations(this.id);
  }
  getFacingAngle() {
    return s.GetDynamicActorFacingAngle(this.id);
  }
  setFacingAngle(ang: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to set facing angle before create",
      );
    return s.SetDynamicActorFacingAngle(this.id, ang);
  }
  getPos() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to get pos before create");
    return s.GetDynamicActorPos(this.id);
  }
  setPos(x: number, y: number, z: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to set pos before create");
    return s.SetDynamicActorPos(this.id, x, y, z);
  }
  getHealth() {
    return s.GetDynamicActorHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to set health before create");
    return s.SetDynamicActorHealth(this.id, health);
  }
  isInvulnerable(): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return s.IsDynamicActorInvulnerable(this.id);
  }
  setInvulnerable(invulnerable = true): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to set invulnerable before create",
      );
    return s.SetDynamicActorInvulnerable(this.id, invulnerable);
  }
  getPlayerTarget(player: Player) {
    const actorId = s.GetPlayerTargetDynamicActor(player.id);
    return dynamicActorPool.get(actorId);
  }
  getPlayerCameraTarget(player: Player) {
    const actorId = s.GetPlayerCameraTargetDynActor(player.id);
    return dynamicActorPool.get(actorId);
  }
  getSkin(): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to get skin before create");
    return w.GetActorSkin(this.id);
  }
  setSkin(model: number, ignoreRange = false): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to set skin before create");
    if (!ignoreRange && (model < 0 || model > 311 || model === 74))
      return false;
    return w.SetActorSkin(this.id, model);
  }
  getSpawnInfo() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error(
        "[StreamerActor]: Unable to get spawn info before create",
      );
    return w.GetActorSpawnInfo(this.id);
  }
  getAnimation() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new Error("[StreamerActor]: Unable to get animation before create");
    return s.GetDynamicActorAnimation(this.id);
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
}
