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
      Pickup.__inject__.AddStaticPickup(model, type, x, y, z, virtualWorld);
    } else {
      this._id = Pickup.__inject__.CreatePickup(
        model,
        type,
        x,
        y,
        z,
        virtualWorld,
      );

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
      Pickup.__inject__.DestroyPickup(this.id);
    }
    pickupPool.delete(this.id);
  }

  isValid(): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.isValid(this.id);
  }

  isStreamedIn(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.IsPickupStreamedIn(player.id, this.id);
  }

  getPos() {
    return Pickup.__inject__.GetPickupPos(this.id);
  }

  getModel(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__.GetPickupModel(this.id);
  }

  getType(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__.GetPickupType(this.id);
  }

  getVirtualWorld(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__.GetPickupVirtualWorld(this.id);
  }

  setPos(x: number, y: number, z: number, update: boolean): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.SetPickupPos(this.id, x, y, z, update);
  }

  setModel(model: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.SetPickupModel(this.id, model, update);
  }

  setType(type: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.SetPickupType(this.id, type, update);
  }

  setVirtualWorld(virtualWorld: number): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.SetPickupVirtualWorld(this.id, virtualWorld);
  }

  showForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.ShowPickupForPlayer(player.id, this.id);
  }

  hideForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.HidePickupForPlayer(player.id, this.id);
  }

  isHiddenForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.IsPickupHiddenForPlayer(player.id, this.id);
  }

  static isValid(id: number) {
    if (id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__.IsValidPickup(id);
  }

  static getInstance(id: number) {
    return pickupPool.get(id);
  }

  static getInstances() {
    return [...pickupPool.values()];
  }

  static __inject__ = {
    CreatePickup: p.CreatePickup,
    AddStaticPickup: p.AddStaticPickup,
    DestroyPickup: p.DestroyPickup,
    IsPickupStreamedIn: p.IsPickupStreamedIn,
    GetPickupPos: p.GetPickupPos,
    GetPickupModel: p.GetPickupModel,
    GetPickupType: p.GetPickupType,
    GetPickupVirtualWorld: p.GetPickupVirtualWorld,
    SetPickupPos: p.SetPickupPos,
    SetPickupModel: p.SetPickupModel,
    SetPickupType: p.SetPickupType,
    SetPickupVirtualWorld: p.SetPickupVirtualWorld,
    ShowPickupForPlayer: p.ShowPickupForPlayer,
    HidePickupForPlayer: p.HidePickupForPlayer,
    IsPickupHiddenForPlayer: p.IsPickupHiddenForPlayer,
    IsValidPickup: p.IsValidPickup,
  };
}
