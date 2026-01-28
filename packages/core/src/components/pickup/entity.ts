import { InvalidEnum, LimitsEnum } from "core/enums";
import { IPickup } from "core/interfaces";
import * as p from "core/wrapper/native";
import { Player } from "../player";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { pickupPool, playerPickupPool } from "core/utils/pools";
import { PickupException } from "core/exceptions";

export class Pickup {
  private sourceInfo: IPickup | null = null;
  private _player: Player | null = null;
  private _id: number = InvalidEnum.PICKUP_ID;

  get id() {
    return this._id;
  }

  constructor(pickupOrId: IPickup | number, player?: Player) {
    if (typeof pickupOrId === "number") {
      if (pickupOrId === InvalidEnum.PICKUP_ID) {
        throw new PickupException("Invalid id");
      }

      if (player) {
        this._player = player;
      }

      const pickup = Pickup.getInstance(pickupOrId, player);
      if (pickup) return pickup;

      this._id = pickupOrId;
      if (this.isGlobal()) {
        pickupPool.set(this._id, this);
      } else if (player) {
        if (!playerPickupPool.has(player)) {
          playerPickupPool.set(player, new Map());
        }
        playerPickupPool.get(this.getPlayer()!)!.set(this.id, this);
      }
    } else {
      this.sourceInfo = pickupOrId;
      this._player = null;
    }
  }

  create() {
    if (!this.sourceInfo) {
      throw new PickupException("Cannot create with only id");
    }
    if (this.id !== InvalidEnum.PICKUP_ID) {
      throw new PickupException("Cannot be created twice");
    }
    const { model, type, virtualWorld, x, y, z, isStatic } = this.sourceInfo;
    const player = this.getPlayer();
    if (isStatic) {
      if (player) {
        throw new PickupException("Cannot create static pickup for player");
      }
      Pickup.__inject__.addStatic(model, type, x, y, z, virtualWorld);
    } else {
      if (!player) {
        this._id = Pickup.__inject__.create(model, type, x, y, z, virtualWorld);
        if (
          Pickup.getInstances().length === LimitsEnum.MAX_PICKUPS ||
          this._id === InvalidEnum.PICKUP_ID
        ) {
          throw new PickupException("Cannot create pickup");
        }
        pickupPool.set(this.id, this);
      } else {
        this._id = Pickup.__inject__.createPlayer(
          player.id,
          model,
          type,
          x,
          y,
          z,
          virtualWorld,
        );
        if (
          (player &&
            Pickup.getInstances(player).length === LimitsEnum.MAX_PICKUPS) ||
          this._id === InvalidEnum.PICKUP_ID
        ) {
          throw new PickupException("Cannot create player pickup");
        }
        if (!playerPickupPool.has(player)) {
          playerPickupPool.set(player, new Map());
        }
        playerPickupPool.get(player)!.set(this.id, this);
      }
    }
    return this;
  }

  destroy(): void {
    if (this.sourceInfo && this.sourceInfo.isStatic) {
      throw new PickupException("Cannot destroy static pickup");
    }

    if (this.id === InvalidEnum.PICKUP_ID) {
      throw new PickupException("Cannot destroy before create");
    }

    const player = this.getPlayer();
    if (!player) {
      if (!INTERNAL_FLAGS.skip) {
        Pickup.__inject__.destroy(this.id);
      }
      pickupPool.delete(this.id);
    } else {
      if (!INTERNAL_FLAGS.skip) {
        Pickup.__inject__.destroyPlayer(player.id, this.id);
      }
      if (playerPickupPool.has(player)) {
        const perPlayerPickup = playerPickupPool.get(player)!;
        perPlayerPickup.delete(this.id);

        if (!perPlayerPickup.size) {
          playerPickupPool.delete(player);
        }
      }
    }

    this._id = InvalidEnum.PICKUP_ID;
  }

  isGlobal() {
    const player = this.sourceInfo ? this.sourceInfo.player : this._player;
    return !player;
  }

  isPlayer() {
    return !this.isGlobal();
  }

  getPlayer() {
    if (this._player) return this._player;
    if (this.sourceInfo && this.sourceInfo.player) {
      return this.sourceInfo.player;
    }
    return null;
  }

  getPlayerId() {
    const player = this.getPlayer();
    return player ? player.id : InvalidEnum.PLAYER_ID;
  }

  isValid(): boolean {
    if (INTERNAL_FLAGS.skip && this.id !== InvalidEnum.PICKUP_ID) return true;
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.getPlayer();
    if (p) return Pickup.isValidPlayer(p.id, this.id);
    return Pickup.isValidGlobal(this.id);
  }

  isStreamedIn(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.getPlayer();
    if (p) return Pickup.__inject__.isStreamedInPlayer(p.id, this.id);
    return Pickup.__inject__.isStreamedIn(player.id, this.id);
  }

  getPos() {
    const p = this.getPlayer();
    if (p) return Pickup.__inject__.getPosPlayer(p.id, this.id);
    return Pickup.__inject__.getPos(this.id);
  }

  getModel(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    const p = this.getPlayer();
    if (p) return Pickup.__inject__.getModelPlayer(p.id, this.id);
    return Pickup.__inject__.getModel(this.id);
  }

  getType(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    const p = this.getPlayer();
    if (p) return Pickup.__inject__.getTypePlayer(p.id, this.id);
    return Pickup.__inject__.getType(this.id);
  }

  getVirtualWorld(): number {
    if (this.id === InvalidEnum.PICKUP_ID) return 0;
    const p = this.getPlayer();
    if (p) return Pickup.__inject__.getVirtualWorldPlayer(p.id, this.id);
    return Pickup.__inject__.getVirtualWorld(this.id);
  }

  setPos(x: number, y: number, z: number, update: boolean): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.getPlayer();
    if (p)
      return Pickup.__inject__.setPosPlayer(p.id, this.id, x, y, z, update);
    return Pickup.__inject__.setPos(this.id, x, y, z, update);
  }

  setModel(model: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.getPlayer();
    if (p)
      return Pickup.__inject__.setModelPlayer(p.id, this.id, model, update);
    return Pickup.__inject__.setModel(this.id, model, update);
  }

  setType(type: number, update = true): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.getPlayer();
    if (p) return Pickup.__inject__.setTypePlayer(p.id, this.id, type, update);
    return Pickup.__inject__.setType(this.id, type, update);
  }

  setVirtualWorld(virtualWorld: number): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.getPlayer();
    if (p)
      return Pickup.__inject__.setVirtualWorldPlayer(
        p.id,
        this.id,
        virtualWorld,
      );
    return Pickup.__inject__.setVirtualWorld(this.id, virtualWorld);
  }

  showForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.getPlayer();
    if (p) {
      throw new PickupException("Cannot show for player pickup");
    }
    return Pickup.__inject__.showForPlayer(player.id, this.id);
  }

  hideForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.getPlayer();
    if (p) {
      throw new PickupException("Cannot hide for player pickup");
    }
    return Pickup.__inject__.hideForPlayer(player.id, this.id);
  }

  isHiddenForPlayer(player: Player): boolean {
    if (this.id === InvalidEnum.PICKUP_ID) return false;
    const p = this.isPlayer();
    if (p) {
      throw new PickupException("Cannot isHiddenForPlayer for player pickup");
    }
    return Pickup.__inject__.isHiddenForPlayer(player.id, this.id);
  }

  static isValidPlayer(playerId: number, zoneId: number) {
    return Pickup.__inject__.isValidPlayer(playerId, zoneId);
  }
  static isValidGlobal(zoneId: number) {
    return Pickup.__inject__.isValidGlobal(zoneId);
  }

  static getInstance(pickupId: number, player?: Player) {
    if (!player) return pickupPool.get(pickupId);

    if (player.id === InvalidEnum.PLAYER_ID) return;
    return playerPickupPool.get(player)?.get(pickupId);
  }

  static getInstances(player?: Player) {
    if (!player) return [...pickupPool.values()];

    if (player.id === InvalidEnum.PLAYER_ID) return [];
    return [...(playerPickupPool.get(player)?.values() || [])];
  }

  static getPlayersInstances(): [Player, Pickup[]][] {
    return Array.from(playerPickupPool.entries()).map(([player, pickups]) => {
      return [player, Array.from(pickups.values())];
    });
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
    isValidGlobal: p.IsValidPickup,
    createPlayer: p.CreatePlayerPickup,
    destroyPlayer: p.DestroyPlayerPickup,
    isStreamedInPlayer: p.IsPlayerPickupStreamedIn,
    getPosPlayer: p.GetPlayerPickupPos,
    getModelPlayer: p.GetPlayerPickupModel,
    getTypePlayer: p.GetPlayerPickupType,
    getVirtualWorldPlayer: p.GetPlayerPickupVirtualWorld,
    setPosPlayer: p.SetPlayerPickupPos,
    setModelPlayer: p.SetPlayerPickupModel,
    setTypePlayer: p.SetPlayerPickupType,
    setVirtualWorldPlayer: p.SetPlayerPickupVirtualWorld,
    isValidPlayer: p.IsValidPlayerPickup,
  };
}
