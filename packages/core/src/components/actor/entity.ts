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
    this._id = Actor.__inject__CreateActor(skin, x, y, z, rotation);
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
      Actor.__inject__DestroyActor(this._id);
    }
    actorPool.delete(this._id);
    this._id = InvalidEnum.ACTOR_ID;
    return this;
  }

  isStreamIn(forPlayer: Player) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__IsActorStreamedIn(this.id, forPlayer.id);
  }

  setVirtualWorld(vWorld: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__SetActorVirtualWorld(this.id, vWorld);
  }

  getVirtualWorld() {
    if (this._id === InvalidEnum.ACTOR_ID) return 0;
    return Actor.__inject__GetActorVirtualWorld(this.id);
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
    return Actor.__inject__ApplyActorAnimation(
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
    return Actor.__inject__ClearActorAnimations(this.id);
  }

  setPos(x: number, y: number, z: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__SetActorPos(this.id, x, y, z);
  }

  getPos() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getPos before create");
    }
    return Actor.__inject__GetActorPos(this.id);
  }

  setFacingAngle(ang: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__SetActorFacingAngle(this.id, ang);
  }

  getFacingAngle() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getFacingAngle before create");
    }
    return Actor.__inject__GetActorFacingAngle(this.id);
  }

  setHealth(health: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__SetActorHealth(this.id, health);
  }

  getHealth() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getHealth before create");
    }
    return Actor.__inject__GetActorHealth(this.id);
  }

  setInvulnerable(invulnerable: boolean) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__SetActorInvulnerable(this.id, invulnerable);
  }

  isInvulnerable() {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__IsActorInvulnerable(this.id);
  }

  isValid() {
    return Actor.isValid(this._id);
  }

  setSkin(skin: number) {
    if (this._id === InvalidEnum.ACTOR_ID) return false;
    return Actor.__inject__SetActorSkin(this.id, skin);
  }

  getSkin() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getSkin before create");
    }
    if (this.sourceInfo) {
      return this.sourceInfo.skin;
    }
    return Actor.__inject__GetActorSkin(this.id);
  }

  getAnimation() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getAnimation before create");
    }
    return Actor.__inject__GetActorAnimation(this.id);
  }

  getSpawnInfo() {
    if (this._id === InvalidEnum.ACTOR_ID) {
      throw new Error("[Actor]: Cannot getSpawnInfo before create");
    }
    return Actor.__inject__GetActorSpawnInfo(this.id);
  }

  static isValid(id: number) {
    return Actor.__inject__IsValidActor(id);
  }

  static getInstance(id: number) {
    return actorPool.get(id);
  }

  static getInstances() {
    return [...actorPool.values()];
  }

  static __inject__ApplyActorAnimation = a.ApplyActorAnimation;
  static __inject__ClearActorAnimations = a.ClearActorAnimations;
  static __inject__CreateActor = a.CreateActor;
  static __inject__DestroyActor = a.DestroyActor;
  static __inject__GetActorAnimation = a.GetActorAnimation;
  static __inject__GetActorFacingAngle = a.GetActorFacingAngle;
  static __inject__GetActorHealth = a.GetActorHealth;
  static __inject__GetActorPos = a.GetActorPos;
  static __inject__GetActorSkin = a.GetActorSkin;
  static __inject__GetActorSpawnInfo = a.GetActorSpawnInfo;
  static __inject__GetActorVirtualWorld = a.GetActorVirtualWorld;
  static __inject__IsActorInvulnerable = a.IsActorInvulnerable;
  static __inject__IsActorStreamedIn = a.IsActorStreamedIn;
  static __inject__IsValidActor = a.IsValidActor;
  static __inject__SetActorFacingAngle = a.SetActorFacingAngle;
  static __inject__SetActorHealth = a.SetActorHealth;
  static __inject__SetActorInvulnerable = a.SetActorInvulnerable;
  static __inject__SetActorPos = a.SetActorPos;
  static __inject__SetActorSkin = a.SetActorSkin;
  static __inject__SetActorVirtualWorld = a.SetActorVirtualWorld;
}
