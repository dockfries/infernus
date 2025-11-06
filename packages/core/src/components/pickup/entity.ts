import { InvalidEnum, LimitsEnum } from "core/enums";
import { IPickup } from "core/interfaces";
import * as p from "core/wrapper/native";
import { Player } from "../player";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { pickupPool } from "core/utils/pools";

export class Pickup {
  private sourceInfo: IPickup | null = null;

  private _id: number = InvalidEnum.PICKUP_ID;

  get id() {
    return this._id;
  }

  constructor(pickupOrId: IPickup | number) {
    if (typeof pickupOrId === "number") {
      this._id = pickupOrId;
      pickupPool.set(this.id, this);
    } else {
      this.sourceInfo = pickupOrId;
    }
  }

  create() {
    if (this.id !== InvalidEnum.PICKUP_ID || !this.sourceInfo) {
      throw new Error("[Pickup]: Cannot be created twice");
    }
    const { model, type, virtualWorld, x, y, z, isStatic } = this.sourceInfo;
    if (isStatic) {
      Pickup.__inject__.addStatic(model, type, x, y, z, virtualWorld);
    } else {
      this._id = Pickup.__inject__.create(model, type, x, y, z, virtualWorld);

      if (
        Pickup.getInstances().length === LimitsEnum.MAX_PICKUPS ||
        this._id === InvalidEnum.PICKUP_ID
      ) {
        throw new Error("[Pickup]: Unable to create pickup");
      }

      pickupPool.set(this.id, this);
    }
    return this;
  }

  destroy(): void {
    if (this.sourceInfo && this.sourceInfo.isStatic) {
      throw new Error("[Pickup]: Cannot destroy static pickups");
    }

    if (this.id === InvalidEnum.PICKUP_ID) {
      throw new Error("[Pickup]: Cannot be destroyed twice");
    }

    if (!INTERNAL_FLAGS.skip) {
      Pickup.__inject__.destroy(this.id);
    }
    pickupPool.delete(this.id);
  }

  isValid(): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.isValid(this.id);
  }

  isStreamedIn(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.isStreamedIn(player.id, this.id);
  }

  getPos() {
    return Pickup.__inject__.getPos(this.id);
  }

  getModel(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__.getModel(this.id);
  }

  getType(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__.getType(this.id);
  }

  getVirtualWorld(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__.getVirtualWorld(this.id);
  }

  setPos(x: number, y: number, z: number, update: boolean): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.setPos(this.id, x, y, z, update);
  }

  setModel(model: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.setModel(this.id, model, update);
  }

  setType(type: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.setType(this.id, type, update);
  }

  setVirtualWorld(virtualWorld: number): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.setVirtualWorld(this.id, virtualWorld);
  }

  showForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.showForPlayer(player.id, this.id);
  }

  hideForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.hideForPlayer(player.id, this.id);
  }

  isHiddenForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.isHiddenForPlayer(player.id, this.id);
  }

  static isValid(id: number) {
    if (id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.isValid(id);
  }

  static getInstance(id: number) {
    return pickupPool.get(id);
  }

  static getInstances() {
    return [...pickupPool.values()];
  }

  static __inject__ = {
    create: p.CreatePickup,
    addStatic: p.AddStaticPickup,
    destroy: p.DestroyPickup,
    isStreamedIn: p.IsPickupStreamedIn,
    getPos: p.GetPickupPos,
    getModel: p.GetPickupModel,
    getType: p.GetPickupType,
    getVirtualWorld: p.GetPickupVirtualWorld,
    setPos: p.SetPickupPos,
    setModel: p.SetPickupModel,
    setType: p.SetPickupType,
    setVirtualWorld: p.SetPickupVirtualWorld,
    showForPlayer: p.ShowPickupForPlayer,
    hideForPlayer: p.HidePickupForPlayer,
    isHiddenForPlayer: p.IsPickupHiddenForPlayer,
    isValid: p.IsValidPickup,
  };
}
