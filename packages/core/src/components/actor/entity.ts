import { InvalidEnum, LimitsEnum } from "core/enums";
import { IActor } from "core/interfaces";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { actorPool } from "core/utils/pools";
import * as a from "core/wrapper/native";
import { Player } from "../player/entity";

export class Actor {
  private _id: number = InvalidEnum.ACTOR_ID;

  readonly sourceInfo: IActor | null = null;

  get id() {
    return this._id;
  }

  constructor(actorOrId: IActor | number) {
    if (typeof actorOrId === "number") {
      if (actorOrId === InvalidEnum.ACTOR_ID) {
        throw new Error("[Actor]: Invalid id");
      }

      const actor = Actor.getInstance(actorOrId);
      if (actor) return actor;

      this._id = actorOrId;
    } else {
      this.sourceInfo = actorOrId;
    }
  }

  create() {
    if (this._id !== InvalidEnum.ACTOR_ID)
      throw new Error("[Actor]: Cannot be created twice");
    const { skin, x, y, z, rotation } = this.sourceInfo!;
    this._id = Actor.__inject__.create(skin, x, y, z, rotation);
    if (
      this._id === InvalidEnum.ACTOR_ID ||
      Actor.getInstances().length === LimitsEnum.MAX_ACTORS
    ) {
      throw new Error("[Actor]: Unable to create actor");
    }
    actorPool.set(this._id, this);
    return this;
  }

  destroy() {
    if (this._id === InvalidEnum.ACTOR_ID)
      throw new Error("[Actor]: Cannot before create");
    if (!INTERNAL_FLAGS.skip) {
      Actor.__inject__.destroy(this._id);
    }
    actorPool.delete(this._id);
    this._id = InvalidEnum.ACTOR_ID;
    return this;
  }

  isStreamIn(forPlayer: Player) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.isStreamedIn(this.id, forPlayer.id);
  }

  setVirtualWorld(vWorld: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.setVirtualWorld(this.id, vWorld);
  }

  getVirtualWorld() {
    if (this._id === InvalidEnum.ACTOR_ID) return 0;
    return Actor.__inject__.getVirtualWorld(this.id);
  }

  applyAnimation(
    animLib: string,
    animName: string,
    fDelta: number,
    loop: boolean,
    lockX: boolean,
    lockY: boolean,
    freeze: boolean,
    time: number,
  ) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.applyAnimation(
      this.id,
      animLib,
      animName,
      fDelta,
      loop,
      lockX,
      lockY,
      freeze,
      time,
    );
  }

  clearAnimations() {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.clearAnimations(this.id);
  }

  setPos(x: number, y: number, z: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.setPos(this.id, x, y, z);
  }

  getPos() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getPos before create");
    }
    return Actor.__inject__.getPos(this.id);
  }

  setFacingAngle(ang: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.setFacingAngle(this.id, ang);
  }

  getFacingAngle() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getFacingAngle before create");
    }
    return Actor.__inject__.getFacingAngle(this.id);
  }

  setHealth(health: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.setHealth(this.id, health);
  }

  getHealth() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getHealth before create");
    }
    return Actor.__inject__.getHealth(this.id);
  }

  setInvulnerable(invulnerable: boolean) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.setInvulnerable(this.id, invulnerable);
  }

  isInvulnerable() {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.isInvulnerable(this.id);
  }

  isValid() {
    return Actor.isValid(this._id);
  }

  setSkin(skin: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__.setSkin(this.id, skin);
  }

  getSkin() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getSkin before create");
    }
    if (this.sourceInfo) {
      return this.sourceInfo.skin;
    }
    return Actor.__inject__.getSkin(this.id);
  }

  getAnimation() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getAnimation before create");
    }
    return Actor.__inject__.getAnimation(this.id);
  }

  getSpawnInfo() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getSpawnInfo before create");
    }
    return Actor.__inject__.getSpawnInfo(this.id);
  }

  static isValid(id: number) {
    return Actor.__inject__.isValid(id);
  }

  static getInstance(id: number) {
    return actorPool.get(id);
  }

  static getInstances() {
    return [...actorPool.values()];
  }

  static __inject__ = {
    create: a.CreateActor,
    destroy: a.DestroyActor,
    applyAnimation: a.ApplyActorAnimation,
    clearAnimations: a.ClearActorAnimations,
    getAnimation: a.GetActorAnimation,
    getFacingAngle: a.GetActorFacingAngle,
    getHealth: a.GetActorHealth,
    getPos: a.GetActorPos,
    getSkin: a.GetActorSkin,
    getSpawnInfo: a.GetActorSpawnInfo,
    getVirtualWorld: a.GetActorVirtualWorld,
    isInvulnerable: a.IsActorInvulnerable,
    isStreamedIn: a.IsActorStreamedIn,
    isValid: a.IsValidActor,
    setFacingAngle: a.SetActorFacingAngle,
    setHealth: a.SetActorHealth,
    setInvulnerable: a.SetActorInvulnerable,
    setPos: a.SetActorPos,
    setSkin: a.SetActorSkin,
    setVirtualWorld: a.SetActorVirtualWorld,
  };
}
