import type { Player } from "core/controllers/player";
import type { IDynamicActor } from "core/interfaces";
import { isValidAnimateName } from "core/utils/animateUtils";
import * as w from "core/wrapper/native";
import * as s from "@infernus/streamer";
import { Streamer } from "../common";
import { streamerFlag } from "../flag";

export class DynamicActor {
  static readonly actors = new Map<number, DynamicActor>();

  private sourceInfo: IDynamicActor;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(actor: IDynamicActor) {
    this.sourceInfo = actor;
  }
  create(): this {
    if (this.id !== -1)
      throw new Error("[StreamerActor]: Unable to create actor again");
    let {
      streamDistance,
      worldId,
      interiorId: interiorId,
      playerId,
      areaId,
      priority,
    } = this.sourceInfo;
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

    DynamicActor.actors.set(this.id, this);
    return this;
  }
  destroy(): this {
    if (this.id === -1 && !streamerFlag.skip)
      throw new Error(
        "[StreamerActor]: Unable to destroy the actor before create",
      );
    if (!streamerFlag.skip) s.DestroyDynamicActor(this.id);
    DynamicActor.actors.delete(this.id);
    this._id = -1;
    return this;
  }
  isValid(): boolean {
    if (streamerFlag.skip && this.id !== -1) return true;
    return s.IsValidDynamicActor(this.id);
  }
  isStreamedIn(forPlayer: Player): boolean {
    if (this.id === -1) return false;
    return s.IsDynamicActorStreamedIn(this.id, forPlayer.id);
  }
  getVirtualWorld(): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerActor]: Unable to get virtual world before create",
      );
    return s.GetDynamicActorVirtualWorld(this.id);
  }
  setVirtualWorld(vWorld: number): number {
    if (this.id === -1)
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
    if (this.id === -1)
      throw new Error(
        "[StreamerActor]: Unable to apply animation before create",
      );
    if (!isValidAnimateName(animLib, animName)) {
      throw new Error("[StreamerActor]: Invalid anim library or name");
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
    if (this.id === -1)
      throw new Error(
        "[StreamerActor]: Unable to clear animation before create",
      );
    return s.ClearDynamicActorAnimations(this.id);
  }
  getFacingAngle(): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerActor]: Unable to get facing angle before create",
      );
    return s.GetDynamicActorFacingAngle(this.id);
  }
  setFacingAngle(ang: number): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerActor]: Unable to set facing angle before create",
      );
    return s.SetDynamicActorFacingAngle(this.id, ang);
  }
  getPos() {
    if (this.id === -1)
      throw new Error("[StreamerActor]: Unable to get pos before create");
    return s.GetDynamicActorPos(this.id);
  }
  setPos(x: number, y: number, z: number): number {
    if (this.id === -1)
      throw new Error("[StreamerActor]: Unable to set pos before create");
    return s.SetDynamicActorPos(this.id, x, y, z);
  }
  getHealth(): number {
    if (this.id === -1)
      throw new Error("[StreamerActor]: Unable to get health before create");
    return s.GetDynamicActorHealth(this.id);
  }
  setHealth(health: number): number {
    if (this.id === -1)
      throw new Error("[StreamerActor]: Unable to set health before create");
    return s.SetDynamicActorHealth(this.id, health);
  }
  isInvulnerable(): boolean {
    if (this.id === -1) return false;
    return s.IsDynamicActorInvulnerable(this.id);
  }
  setInvulnerable(invulnerable = true): number {
    if (this.id === -1)
      throw new Error(
        "[StreamerActor]: Unable to set invulnerable before create",
      );
    return s.SetDynamicActorInvulnerable(this.id, invulnerable);
  }
  getPlayerTarget(player: Player) {
    if (this.id === -1) return undefined;
    const actorId = s.GetPlayerTargetDynamicActor(player.id);
    return DynamicActor.actors.get(actorId);
  }
  getPlayerCameraTarget(player: Player) {
    if (this.id === -1) return undefined;
    const actorId = s.GetPlayerCameraTargetDynActor(player.id);
    return DynamicActor.actors.get(actorId);
  }
  getSkin(): number {
    if (this.id === -1)
      throw new Error("[StreamerActor]: Unable to get skin before create");
    return w.GetActorSkin(this.id);
  }
  setSkin(model: number, ignoreRange = false): number {
    if (this.id === -1)
      throw new Error("[StreamerActor]: Unable to set skin before create");
    if (!ignoreRange && (model < 0 || model > 311 || model === 74)) return 0;
    return w.SetActorSkin(this.id, model);
  }
  getSpawnInfo() {
    if (this.id === -1)
      throw new Error(
        "[StreamerActor]: Unable to get spawn info before create",
      );
    return w.GetActorSpawnInfo(this.id);
  }
  getAnimation() {
    if (this.id === -1)
      throw new Error("[StreamerActor]: Unable to get animation before create");
    return s.GetDynamicActorAnimation(this.id);
  }
  toggleCallbacks(toggle = true): number {
    if (this.id === -1)
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
    if (this.id === -1) return false;
    return Streamer.isToggleItemCallbacks(s.StreamerItemTypes.ACTOR, this.id);
  }

  static getInstance(id: number) {
    return this.actors.get(id);
  }
  static getInstances() {
    return [...this.actors.values()];
  }
}
