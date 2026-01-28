import type { Player } from "core/components/player";
import type { IDynamicActor } from "core/interfaces";
import { isValidAnimateName } from "core/utils/animate";
import * as s from "@infernus/streamer";
import { Streamer } from "../common";
import { INTERNAL_FLAGS } from "../../../utils/flags";
import { dynamicActorPool } from "core/utils/pools";
import { DynamicActorException } from "core/exceptions";

export class DynamicActor {
  private sourceInfo: IDynamicActor | null = null;
  private _id: number = s.StreamerMiscellaneous.INVALID_ID;
  get id(): number {
    return this._id;
  }
  constructor(actorOrId: IDynamicActor | number) {
    if (typeof actorOrId === "number") {
      if (actorOrId === s.StreamerMiscellaneous.INVALID_ID) {
        throw new DynamicActorException("Invalid id");
      }

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
      throw new DynamicActorException("Cannot create again");
    if (!this.sourceInfo)
      throw new DynamicActorException("Cannot create with only id");
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

      this._id = DynamicActor.__inject__.createEx(
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

      this._id = DynamicActor.__inject__.create(
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
      throw new DynamicActorException("Cannot destroy to actor before create");
    if (!INTERNAL_FLAGS.skip) {
      DynamicActor.__inject__.destroy(this.id);
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
    return DynamicActor.__inject__.isStreamedIn(this.id, forPlayer.id);
  }
  getVirtualWorld(): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot get virtual world before create");
    return DynamicActor.__inject__.getVirtualWorld(this.id);
  }
  setVirtualWorld(vWorld: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot set virtual world before create");
    return DynamicActor.__inject__.setVirtualWorld(this.id, vWorld);
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
      throw new DynamicActorException("Cannot apply animation before create");
    if (!isValidAnimateName(animLib, animName)) {
      throw new DynamicActorException(
        `Invalid anim library or name ${animLib} ${animName}`,
      );
    }
    return DynamicActor.__inject__.applyAnimation(
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
      throw new DynamicActorException("Cannot clear animation before create");
    return DynamicActor.__inject__.clearAnimations(this.id);
  }
  getFacingAngle() {
    return DynamicActor.__inject__.getFacingAngle(this.id);
  }
  setFacingAngle(ang: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot set facing angle before create");
    return DynamicActor.__inject__.setFacingAngle(this.id, ang);
  }
  getPos() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot get pos before create");
    return DynamicActor.__inject__.getPos(this.id);
  }
  setPos(x: number, y: number, z: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot set pos before create");
    return DynamicActor.__inject__.setPos(this.id, x, y, z);
  }
  getHealth() {
    return DynamicActor.__inject__.getHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot set health before create");
    return DynamicActor.__inject__.setHealth(this.id, health);
  }
  isInvulnerable(): boolean {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID) return false;
    return DynamicActor.__inject__.isInvulnerable(this.id);
  }
  setInvulnerable(invulnerable = true): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot set invulnerable before create");
    return DynamicActor.__inject__.setInvulnerable(this.id, invulnerable);
  }
  getPlayerTarget(player: Player) {
    const actorId = DynamicActor.__inject__.getPlayerTarget(player.id);
    return dynamicActorPool.get(actorId);
  }
  getPlayerCameraTarget(player: Player) {
    const actorId = DynamicActor.__inject__.getPlayerCameraTarget(player.id);
    return dynamicActorPool.get(actorId);
  }
  getAnimation() {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot get animation before create");
    return DynamicActor.__inject__.getAnimation(this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === s.StreamerMiscellaneous.INVALID_ID)
      throw new DynamicActorException("Cannot toggle callbacks before create");
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
    createEx: s.CreateDynamicActorEx,
    create: s.CreateDynamicActor,
    destroy: s.DestroyDynamicActor,
    getPlayerTarget: s.GetPlayerTargetDynamicActor,
    getPlayerCameraTarget: s.GetPlayerCameraTargetDynActor,
    isStreamedIn: s.IsDynamicActorStreamedIn,
    getVirtualWorld: s.GetDynamicActorVirtualWorld,
    setVirtualWorld: s.SetDynamicActorVirtualWorld,
    applyAnimation: s.ApplyDynamicActorAnimation,
    clearAnimations: s.ClearDynamicActorAnimations,
    getFacingAngle: s.GetDynamicActorFacingAngle,
    setFacingAngle: s.SetDynamicActorFacingAngle,
    getPos: s.GetDynamicActorPos,
    setPos: s.SetDynamicActorPos,
    getHealth: s.GetDynamicActorHealth,
    setHealth: s.SetDynamicActorHealth,
    isInvulnerable: s.IsDynamicActorInvulnerable,
    setInvulnerable: s.SetDynamicActorInvulnerable,
    getAnimation: s.GetDynamicActorAnimation,
  };
}
