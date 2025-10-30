import { InvalidEnum, LimitsEnum } from "core/enums";
import { IActor } from "core/interfaces";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { actorPool } from "core/utils/pools";
import {
  ApplyActorAnimation,
  ClearActorAnimations,
  CreateActor,
  DestroyActor,
  GetActorAnimation,
  GetActorFacingAngle,
  GetActorHealth,
  GetActorPos,
  GetActorSkin,
  GetActorSpawnInfo,
  GetActorVirtualWorld,
  IsActorInvulnerable,
  IsActorStreamedIn,
  IsValidActor,
  SetActorFacingAngle,
  SetActorHealth,
  SetActorInvulnerable,
  SetActorPos,
  SetActorSkin,
  SetActorVirtualWorld,
} from "core/wrapper/native";
import { Player } from "../player/entity";

export class Actor {
  private _id: number = InvalidEnum.ACTOR_ID;

  readonly sourceInfo: IActor | null = null;

  get id() {
    return this._id;
  }

  constructor(actorOrId: IActor | number) {
    if (typeof actorOrId === "number") {
      this._id = actorOrId;
    } else {
      this.sourceInfo = actorOrId;
    }
  }

  create() {
    if (this._id !== InvalidEnum.ACTOR_ID)
      throw new Error("[Actor]: Cannot be created twice");
    if (Actor.getInstances().length === LimitsEnum.MAX_ACTORS) {
      throw new Error("[Actor]: Maximum number of actors reached");
    }
    const { skin, x, y, z, rotation } = this.sourceInfo!;
    this._id = CreateActor(skin, x, y, z, rotation);
    actorPool.set(this._id, this);
    return this;
  }

  destroy() {
    if (this._id === InvalidEnum.ACTOR_ID)
      throw new Error("[Actor]: Cannot before create");
    if (!INTERNAL_FLAGS.skip) {
      DestroyActor(this._id);
    }
    actorPool.delete(this._id);
    this._id = InvalidEnum.ACTOR_ID;
    return this;
  }

  isStreamIn(forPlayer: Player) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return IsActorStreamedIn(this.id, forPlayer.id);
  }

  setVirtualWorld(vWorld: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return SetActorVirtualWorld(this.id, vWorld);
  }

  getVirtualWorld() {
    if (this._id === InvalidEnum.ACTOR_ID) return 0;
    return GetActorVirtualWorld(this.id);
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
    return ApplyActorAnimation(
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
    return ClearActorAnimations(this.id);
  }

  setPos(x: number, y: number, z: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return SetActorPos(this.id, x, y, z);
  }

  getPos() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getPos before create");
    }
    return GetActorPos(this.id);
  }

  setFacingAngle(ang: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return SetActorFacingAngle(this.id, ang);
  }

  getFacingAngle() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getFacingAngle before create");
    }
    return GetActorFacingAngle(this.id);
  }

  setHealth(health: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return SetActorHealth(this.id, health);
  }

  getHealth() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getHealth before create");
    }
    return GetActorHealth(this.id);
  }

  setInvulnerable(invulnerable: boolean) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return SetActorInvulnerable(this.id, invulnerable);
  }

  isInvulnerable() {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return IsActorInvulnerable(this.id);
  }

  isValid() {
    return Actor.isValid(this._id);
  }

  setSkin(skin: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return SetActorSkin(this.id, skin);
  }

  getSkin() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getSkin before create");
    }
    if (this.sourceInfo) {
      return this.sourceInfo.skin;
    }
    return GetActorSkin(this.id);
  }

  getAnimation() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getAnimation before create");
    }
    return GetActorAnimation(this.id);
  }

  getSpawnInfo() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getSpawnInfo before create");
    }
    return GetActorSpawnInfo(this.id);
  }

  static isValid(id: number) {
    return IsValidActor(id);
  }

  static getInstance(id: number) {
    return actorPool.get(id);
  }

  static getInstances() {
    return [...actorPool.values()];
  }
}
