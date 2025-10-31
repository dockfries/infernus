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
      p.AddStaticPickup(model, type, x, y, z, virtualWorld);
    } else {
      this._id = p.CreatePickup(model, type, x, y, z, virtualWorld);

      if (
        Pickup.getInstances().length === LimitsEnum.MAX_PICKUPS ||
        this._id === InvalidEnum.PICKUP_ID
      ) {
        throw new Error("[Pickup]: Maximum number of pickups reached");
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
      p.DestroyPickup(this.id);
    }
    pickupPool.delete(this.id);
  }

  isValid(): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.isValid(this.id);
  }

  isStreamedIn(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return p.IsPickupStreamedIn(player.id, this.id);
  }

  getPos() {
    return p.GetPickupPos(this.id);
  }

  getModel(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return p.GetPickupModel(this.id);
  }

  getType(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return p.GetPickupType(this.id);
  }

  getVirtualWorld(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return p.GetPickupVirtualWorld(this.id);
  }

  setPos(x: number, y: number, z: number, update: boolean): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return p.SetPickupPos(this.id, x, y, z, update);
  }

  setModel(model: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return p.SetPickupModel(this.id, model, update);
  }

  setType(type: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return p.SetPickupType(this.id, type, update);
  }

  setVirtualWorld(virtualWorld: number): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return p.SetPickupVirtualWorld(this.id, virtualWorld);
  }

  showForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return p.ShowPickupForPlayer(player.id, this.id);
  }

  hideForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return p.HidePickupForPlayer(player.id, this.id);
  }

  isHiddenForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return p.IsPickupHiddenForPlayer(player.id, this.id);
  }

  static isValid(id: number) {
    if (id === InvalidEnum.PICKUP_ID) return false;
    return p.IsValidPickup(id);
  }

  static getInstance(id: number) {
    return pickupPool.get(id);
  }

  static getInstances() {
    return [...pickupPool.values()];
  }
}
