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
      Pickup.__inject__AddStaticPickup(model, type, x, y, z, virtualWorld);
    } else {
      this._id = Pickup.__inject__CreatePickup(
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
      Pickup.__inject__DestroyPickup(this.id);
    }
    pickupPool.delete(this.id);
  }

  isValid(): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.isValid(this.id);
  }

  isStreamedIn(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__IsPickupStreamedIn(player.id, this.id);
  }

  getPos() {
    return Pickup.__inject__GetPickupPos(this.id);
  }

  getModel(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__GetPickupModel(this.id);
  }

  getType(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__GetPickupType(this.id);
  }

  getVirtualWorld(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    return Pickup.__inject__GetPickupVirtualWorld(this.id);
  }

  setPos(x: number, y: number, z: number, update: boolean): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__SetPickupPos(this.id, x, y, z, update);
  }

  setModel(model: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__SetPickupModel(this.id, model, update);
  }

  setType(type: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__SetPickupType(this.id, type, update);
  }

  setVirtualWorld(virtualWorld: number): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__SetPickupVirtualWorld(this.id, virtualWorld);
  }

  showForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__ShowPickupForPlayer(player.id, this.id);
  }

  hideForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__HidePickupForPlayer(player.id, this.id);
  }

  isHiddenForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__IsPickupHiddenForPlayer(player.id, this.id);
  }

  static isValid(id: number) {
    if (id === InvalidEnum.PICKUP_ID) return false;
    return Pickup.__inject__IsValidPickup(id);
  }

  static getInstance(id: number) {
    return pickupPool.get(id);
  }

  static getInstances() {
    return [...pickupPool.values()];
  }

  static __inject__CreatePickup = p.CreatePickup;
  static __inject__AddStaticPickup = p.AddStaticPickup;
  static __inject__DestroyPickup = p.DestroyPickup;
  static __inject__IsPickupStreamedIn = p.IsPickupStreamedIn;
  static __inject__GetPickupPos = p.GetPickupPos;
  static __inject__GetPickupModel = p.GetPickupModel;
  static __inject__GetPickupType = p.GetPickupType;
  static __inject__GetPickupVirtualWorld = p.GetPickupVirtualWorld;
  static __inject__SetPickupPos = p.SetPickupPos;
  static __inject__SetPickupModel = p.SetPickupModel;
  static __inject__SetPickupType = p.SetPickupType;
  static __inject__SetPickupVirtualWorld = p.SetPickupVirtualWorld;
  static __inject__ShowPickupForPlayer = p.ShowPickupForPlayer;
  static __inject__HidePickupForPlayer = p.HidePickupForPlayer;
  static __inject__IsPickupHiddenForPlayer = p.IsPickupHiddenForPlayer;
  static __inject__IsValidPickup = p.IsValidPickup;
}
