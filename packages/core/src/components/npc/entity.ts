import * as w from "core/wrapper/native";
import {
  RecordTypesEnum,
  InvalidEnum,
  NPCMoveTypeEnum,
  NPCMoveSpeedEnum,
  StreamerItemTypes,
  NPCEntityCheckEnum,
  BulletHitTypesEnum,
  FightingStylesEnum,
  WeaponEnum,
  WeaponSkillsEnum,
  WeaponStatesEnum,
} from "core/enums";
import { Player } from "../player";
import { Vehicle } from "../vehicle";
import { internalPlayerProps, npcPool } from "core/utils/pools";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { DynamicObject } from "core/wrapper/streamer/object";
import { Streamer } from "core/wrapper/streamer";
import { NpcRecord } from "./record";
import { NpcNode } from "./node";
import { ObjectMp } from "../object/entity";

export class Npc {
  private _id: number = InvalidEnum.NPC_ID;
  private _name = "";

  get id() {
    return this._id;
  }

  constructor(nameOrId: string | number) {
    if (typeof nameOrId === "string") {
      this._name = nameOrId;
    }
    if (typeof nameOrId === "number") {
      if (nameOrId === InvalidEnum.NPC_ID) {
        throw new Error("[Npc]: Invalid id");
      }

      this._id = nameOrId;
      const npc = Npc.getInstance(this._id);
      if (npc) return npc;
      npcPool.set(this._id, this);
    }
    return this;
  }
  create() {
    if (this.id !== InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot create again");
    }
    this._id = Npc.__inject__.create(this._name);
    if (this._id !== InvalidEnum.NPC_ID) {
      if (!this.getPlayer()) {
        new Player(this._id);
      }
      npcPool.set(this._id, this);
    }
    return this;
  }
  destroy() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot destroy before create");
    }
    if (!INTERNAL_FLAGS.skip) {
      Npc.__inject__.destroy(this._id);
    }
    npcPool.delete(this._id);
    this._id = InvalidEnum.NPC_ID;
    return this;
  }
  getPlayer() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getPlayer before create");
    }
    return Player.getInstance(this._id)!;
  }
  getName() {
    if (this._id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getName before create");
    }
    if (!this._name) {
      return this.getPlayer().getName().name;
    }
    return this._name;
  }
  isValid() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    if (INTERNAL_FLAGS.skip && this._id !== InvalidEnum.NPC_ID) return true;
    return Npc.isValid(this._id);
  }
  spawn() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot spawn before create");
    }
    Npc.__inject__.spawn(this._id);
    return this;
  }
  respawn() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot respawn before create");
    }
    Npc.__inject__.respawn(this._id);
    return this;
  }
  setPos(x: number, y: number, z: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setPos before create");
    }
    Npc.__inject__.setPos(this._id, x, y, z);
    return this;
  }
  setRot(rX: number, rY: number, rZ: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setRot before create");
    }
    Npc.__inject__.setRot(this._id, rX, rY, rZ);
    return this;
  }
  getRot() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getRot before create");
    }
    return Npc.__inject__.getRot(this._id);
  }
  setFacingAngle(angle: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setFacingAngle before create");
    }
    Npc.__inject__.setFacingAngle(this._id, angle);
    return this;
  }
  getFacingAngle() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getFacingAngle before create");
    }
    return Npc.__inject__.getFacingAngle(this._id);
  }
  setVirtualWorld(virtualWorld: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setVirtualWorld before create");
    }
    Npc.__inject__.setVirtualWorld(this._id, virtualWorld);
    return this;
  }
  getVirtualWorld() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getVirtualWorld before create");
    }
    return Npc.__inject__.getVirtualWorld(this._id);
  }
  move(
    targetPosX: number,
    targetPosY: number,
    targetPosZ: number,
    moveType = NPCMoveTypeEnum.AUTO,
    moveSpeed: number = NPCMoveSpeedEnum.AUTO,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot move before create");
    }
    return Npc.__inject__.move(
      this._id,
      targetPosX,
      targetPosY,
      targetPosZ,
      moveType,
      moveSpeed,
    );
  }
  moveToPlayer(
    player: Player,
    moveType = NPCMoveTypeEnum.AUTO,
    moveSpeed: number = NPCMoveSpeedEnum.AUTO,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot moveToPlayer before create");
    }
    return Npc.__inject__.moveToPlayer(
      this._id,
      player.id,
      moveType,
      moveSpeed,
    );
  }
  stopMove() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot stopMove before create");
    }
    Npc.__inject__.stopMove(this._id);
    return this;
  }
  isMoving() {
    if (this.id === InvalidEnum.NPC_ID) {
      return false;
    }
    return Npc.__inject__.isMoving(this._id);
  }
  isMovingToPlayer(player: Player) {
    if (this.id === InvalidEnum.NPC_ID) {
      return false;
    }
    return Npc.__inject__.isMovingToPlayer(this._id, player.id);
  }
  setSkin(model: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setSkin before create");
    }
    Npc.__inject__.setSkin(this._id, model);
    return this;
  }
  getSkin() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getSkin before create");
    }
    return Npc.__inject__.getSkin(this._id);
  }
  isStreamedIn(player: Player) {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isStreamedIn(this._id, player.id);
  }
  isAnyStreamedIn() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isAnyStreamedIn(this._id);
  }
  setInterior(interior: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setInterior before create");
    }
    Npc.__inject__.setInterior(this._id, interior);
    return this;
  }
  getInterior() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getInterior(this._id);
  }
  setHealth(health: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setHealth before create");
    }
    Npc.__inject__.setHealth(this._id, health);
    return this;
  }
  getHealth() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getHealth(this._id);
  }
  setArmour(armour: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setArmour before create");
    }
    Npc.__inject__.setArmour(this._id, armour);
    return this;
  }
  getArmour() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getArmour(this._id);
  }
  isDead() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isDead(this._id);
  }
  applyAnimation(
    animLib: string,
    animName: string,
    delta: number,
    loop: boolean,
    lockX: boolean,
    lockY: boolean,
    freeze: boolean,
    time: number,
    sync: number,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot applyAnimation before create");
    }
    Npc.__inject__.applyAnimation(
      this._id,
      animLib,
      animName,
      delta,
      loop,
      lockX,
      lockY,
      freeze,
      time,
      sync,
    );
    return this;
  }
  setWeapon(weapon: WeaponEnum) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setWeapon before create");
    }
    Npc.__inject__.setWeapon(this._id, weapon);
    return this;
  }
  getWeapon() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getWeapon(this._id);
  }
  setAmmo(ammo: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setAmmo before create");
    }
    Npc.__inject__.setAmmo(this._id, ammo);
    return this;
  }
  getAmmo() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getAmmo(this._id);
  }
  setKeys(upAndDown: number, leftAndDown: number, keys: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setKeys before create");
    }
    Npc.__inject__.setKeys(this._id, upAndDown, leftAndDown, keys);
    return this;
  }
  getKeys() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getKeys before create");
    }
    return Npc.__inject__.getKeys(this._id);
  }
  setWeaponSkillLevel(skill: WeaponSkillsEnum, level: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setWeaponSkillLevel before create");
    }
    Npc.__inject__.setWeaponSkillLevel(this._id, skill, level);
    return this;
  }
  getWeaponSkillLevel(skill: WeaponSkillsEnum) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getWeaponSkillLevel before create");
    }
    return Npc.__inject__.getWeaponSkillLevel(this._id, skill);
  }
  meleeAttack(time: number, secondaryAttack: boolean) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot meleeAttack before create");
    }
    Npc.__inject__.meleeAttack(this._id, time, secondaryAttack);
    return this;
  }
  stopMeleeAttack() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot stopMeleeAttack before create");
    }
    Npc.__inject__.stopMeleeAttack(this._id);
    return this;
  }
  isMeleeAttacking() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isMeleeAttacking(this._id);
  }
  setFightingStyle(style: FightingStylesEnum) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setFightingStyle before create");
    }
    Npc.__inject__.setFightingStyle(this._id, style);
    return this;
  }
  getFightingStyle() {
    if (this.id === InvalidEnum.NPC_ID) return FightingStylesEnum.NORMAL;
    return Npc.__inject__.getFightingStyle(this._id);
  }
  enableReloading(enable: boolean) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot enableReloading before create");
    }
    Npc.__inject__.enableReloading(this._id, enable);
    return this;
  }
  isReloadEnabled() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isReloadEnabled(this._id);
  }
  isReloading() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isReloading(this._id);
  }
  enableInfiniteAmmo(enable: boolean) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot enableInfiniteAmmo before create");
    }
    Npc.__inject__.enableInfiniteAmmo(this._id, enable);
    return this;
  }
  isInfiniteAmmoEnabled() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isInfiniteAmmoEnabled(this._id);
  }
  setWeaponState(weaponState: WeaponStatesEnum) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setWeaponState before create");
    }
    return Npc.__inject__.setWeaponState(this._id, weaponState);
  }
  getWeaponState() {
    if (this.id === InvalidEnum.NPC_ID) return WeaponStatesEnum.UNKNOWN;
    return Npc.__inject__.getWeaponState(this._id);
  }
  setAmmoInClip(ammo: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setAmmoInClip before create");
    }
    Npc.__inject__.setAmmoInClip(this._id, ammo);
    return this;
  }
  getAmmoInClip() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getAmmoInClip(this._id);
  }
  shoot(
    weapon: WeaponStatesEnum,
    hitId: number,
    hitType: BulletHitTypesEnum,
    endPointX: number,
    endPointY: number,
    endPointZ: number,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
    isHit: boolean,
    checkInBetweenFlags = NPCEntityCheckEnum.ALL,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot shoot before create");
    }
    Npc.__inject__.shoot(
      this._id,
      weapon,
      hitId,
      hitType,
      endPointX,
      endPointY,
      endPointZ,
      offsetX,
      offsetY,
      offsetZ,
      isHit,
      checkInBetweenFlags,
    );
    return this;
  }
  isShooting() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isShooting(this._id);
  }
  aimAt(
    pointX: number,
    pointY: number,
    pointZ: number,
    shoot: boolean,
    shootDelay: number,
    updateAngle: boolean,
    offsetFromX: number,
    offsetFromY: number,
    offsetFromZ: number,
    checkInBetweenFlags = NPCEntityCheckEnum.ALL,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot aimAt before create");
    }
    Npc.__inject__.aimAt(
      this._id,
      pointX,
      pointY,
      pointZ,
      shoot,
      shootDelay,
      updateAngle,
      offsetFromX,
      offsetFromY,
      offsetFromZ,
      checkInBetweenFlags,
    );
    return this;
  }
  aimAtPlayer(
    player: Player,
    shoot: boolean,
    shootDelay: number,
    updateAngle: boolean,
    offsetX: number,
    offsetY: number,
    offsetZ: number,
    offsetFromX: number,
    offsetFromY: number,
    offsetFromZ: number,
    checkInBetweenFlags = NPCEntityCheckEnum.ALL,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot aimAtPlayer before create");
    }
    Npc.__inject__.aimAtPlayer(
      this._id,
      player.id,
      shoot,
      shootDelay,
      updateAngle,
      offsetX,
      offsetY,
      offsetZ,
      offsetFromX,
      offsetFromY,
      offsetFromZ,
      checkInBetweenFlags,
    );
    return this;
  }
  stopAim() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot stopAim before create");
    }
    Npc.__inject__.stopAim(this._id);
    return this;
  }
  isAiming() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isAiming(this._id);
  }
  isAimingAtPlayer(player: Player) {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isAimingAtPlayer(this._id, player.id);
  }
  setWeaponAccuracy(weapon: WeaponEnum, accuracy: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setWeaponAccuracy before create");
    }
    Npc.__inject__.setWeaponAccuracy(this._id, weapon, accuracy);
    return this;
  }
  getWeaponAccuracy(weapon: number) {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getWeaponAccuracy(this._id, weapon);
  }
  setWeaponReloadTime(weapon: number, time: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setWeaponReloadTime before create");
    }
    return Npc.__inject__.setWeaponReloadTime(this._id, weapon, time);
  }
  getWeaponReloadTime(weapon: number) {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getWeaponReloadTime(this._id, weapon);
  }
  getWeaponActualReloadTime(weapon: number) {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getWeaponActualReloadTime(this._id, weapon);
  }
  setWeaponShootTime(weapon: number, time: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setWeaponShootTime before create");
    }
    return Npc.__inject__.setWeaponShootTime(this._id, weapon, time);
  }
  getWeaponShootTime(weapon: number) {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getWeaponShootTime(this._id, weapon);
  }
  setWeaponClipSize(weapon: number, size: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setWeaponClipSize before create");
    }
    return Npc.__inject__.setWeaponClipSize(this._id, weapon, size);
  }
  getWeaponClipSize(weapon: number) {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getWeaponClipSize(this._id, weapon);
  }
  getWeaponActualClipSize(weapon: number) {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getWeaponActualClipSize(this._id, weapon);
  }
  enterVehicle(
    vehicle: Vehicle,
    seatId: number,
    moveType = NPCMoveTypeEnum.AUTO,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot enterVehicle before create");
    }
    Npc.__inject__.enterVehicle(this._id, vehicle.id, seatId, moveType);
    return this;
  }
  exitVehicle() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot exitVehicle before create");
    }
    Npc.__inject__.exitVehicle(this._id);
    return this;
  }
  putInVehicle(vehicle: Vehicle, seat: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot putInVehicle before create");
    }
    return Npc.__inject__.putInVehicle(this._id, vehicle.id, seat);
  }
  removeFromVehicle() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot removeFromVehicle before create");
    }
    return Npc.__inject__.removeFromVehicle(this._id);
  }
  getVehicle() {
    return Vehicle.getInstance(this.getVehicleID());
  }
  getVehicleID() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getVehicle before create");
    }
    return Npc.__inject__.getVehicle(this._id);
  }
  getVehicleSeat() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getVehicleSeat(this._id);
  }
  getEnteringVehicle() {
    return Vehicle.getInstance(this.getEnteringVehicleId());
  }
  getEnteringVehicleId() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getEnteringVehicle before create");
    }
    return Npc.__inject__.getEnteringVehicle(this._id);
  }
  getEnteringVehicleSeat() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getEnteringVehicleSeat(this._id);
  }
  isEnteringVehicle() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isEnteringVehicle(this._id);
  }
  useVehicleSiren(use = true) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot useVehicleSiren before create");
    }
    return Npc.__inject__.useVehicleSiren(this._id, use);
  }
  isVehicleSirenUsed() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isVehicleSirenUsed(this._id);
  }
  setVehicleHealth(health: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setVehicleHealth before create");
    }
    return Npc.__inject__.setVehicleHealth(this._id, health);
  }
  getVehicleHealth() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getVehicleHealth(this._id);
  }
  setVehicleHydraThrusters(direction: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setVehicleHydraThrusters before create");
    }
    return Npc.__inject__.setVehicleHydraThrusters(this._id, direction);
  }
  getVehicleHydraThrusters() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getVehicleHydraThrusters(this._id);
  }
  setVehicleGearState(gearState: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setVehicleGearState before create");
    }
    return Npc.__inject__.setVehicleGearState(this._id, gearState);
  }
  getVehicleGearState() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getVehicleGearState(this._id);
  }
  setVehicleTrainSpeed(speed: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setVehicleTrainSpeed before create");
    }
    return Npc.__inject__.setVehicleTrainSpeed(this._id, speed);
  }
  getVehicleTrainSpeed() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getVehicleTrainSpeed(this._id);
  }
  resetAnimation() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot resetAnimation before create");
    }
    return Npc.__inject__.resetAnimation(this._id);
  }
  setAnimation(
    animationId: number,
    delta: number,
    loop: boolean,
    lockX: boolean,
    lockY: boolean,
    freeze: boolean,
    time: number,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setAnimation before create");
    }
    return Npc.__inject__.setAnimation(
      this._id,
      animationId,
      delta,
      loop,
      lockX,
      lockY,
      freeze,
      time,
    );
  }
  getAnimation() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getAnimation(this._id);
  }
  clearAnimations() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot clearAnimations before create");
    }
    return Npc.__inject__.clearAnimations(this._id);
  }
  setSpecialAction(action: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setSpecialAction before create");
    }
    return Npc.__inject__.setSpecialAction(this._id, action);
  }
  getSpecialAction() {
    if (this.id === InvalidEnum.NPC_ID) return 0;
    return Npc.__inject__.getSpecialAction(this._id);
  }
  startPlayback(
    recordName: string,
    autoUnload: boolean,
    startX: number,
    startY: number,
    startZ: number,
    rotX: number,
    rotY: number,
    rotZ: number,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot startPlayback before create");
    }
    return Npc.__inject__.startPlayback(
      this._id,
      recordName,
      autoUnload,
      startX,
      startY,
      startZ,
      rotX,
      rotY,
      rotZ,
    );
  }
  startPlaybackEx(
    record: NpcRecord,
    autoUnload: boolean,
    startX: number,
    startY: number,
    startZ: number,
    rotX: number,
    rotY: number,
    rotZ: number,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot startPlaybackEx before create");
    }
    return Npc.__inject__.startPlaybackEx(
      this._id,
      record.id,
      autoUnload,
      startX,
      startY,
      startZ,
      rotX,
      rotY,
      rotZ,
    );
  }
  stopPlayback() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot stopPlayback before create");
    }
    return Npc.__inject__.stopPlayback(this._id);
  }
  pausePlayback(paused: boolean) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot pausePlayback before create");
    }
    return Npc.__inject__.pausePlayback(this._id, paused);
  }
  isPlayingPlayback() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isPlayingPlayback(this._id);
  }
  isPlaybackPaused() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isPlaybackPaused(this._id);
  }
  playNode(
    node: NpcNode,
    moveType = NPCMoveTypeEnum.AUTO,
    speed: number = NPCMoveSpeedEnum.AUTO,
    radius = 0.0,
    setAngle = true,
  ) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot playNode before create");
    }
    return Npc.__inject__.playNode(
      this._id,
      node.id,
      moveType,
      speed,
      radius,
      setAngle,
    );
  }
  stopPlayingNode() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot stopPlayingNode before create");
    }
    return Npc.__inject__.stopPlayingNode(this._id);
  }
  pausePlayingNode() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot pausePlayingNode before create");
    }
    return Npc.__inject__.pausePlayingNode(this._id);
  }
  resumePlayingNode() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot resumePlayingNode before create");
    }
    return Npc.__inject__.resumePlayingNode(this._id);
  }
  isPlayingNodePaused() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isPlayingNodePaused(this._id);
  }
  isPlayingNode() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isPlayingNode(this._id);
  }
  changeNode(node: NpcNode, link: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot changeNode before create");
    }
    return Npc.__inject__.changeNode(this._id, node.id, link);
  }
  updateNodePoint(pointId: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot updateNodePoint before create");
    }
    return Npc.__inject__.updateNodePoint(this._id, pointId);
  }
  setInvulnerable(toggle: boolean) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setInvulnerable before create");
    }
    return Npc.__inject__.setInvulnerable(this._id, toggle);
  }
  isInvulnerable() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isInvulnerable(this._id);
  }
  setSurfingOffsets(x: number, y: number, z: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setSurfingOffsets before create");
    }
    return Npc.__inject__.setSurfingOffsets(this._id, x, y, z);
  }
  getSurfingOffsets() {
    return Npc.__inject__.getSurfingOffsets(this._id);
  }
  setSurfingVehicle(vehicle: Vehicle) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setSurfingVehicle before create");
    }
    return Npc.__inject__.setSurfingVehicle(this._id, vehicle.id);
  }
  getSurfingVehicle() {
    return Vehicle.getInstance(this.getSurfingVehicleId());
  }
  getSurfingVehicleId() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getSurfingVehicle before create");
    }
    return Npc.__inject__.getSurfingVehicle(this._id);
  }
  setSurfingObject(objectMp: ObjectMp) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setSurfingObject before create");
    }
    if (!objectMp.isGlobal()) {
      return 0;
    }
    return Npc.__inject__.setSurfingObject(this._id, objectMp.id);
  }
  getSurfingObject() {
    return ObjectMp.getInstance(this.getSurfingObjectId());
  }
  private getSurfingObjectId() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getSurfingObject before create");
    }
    return Npc.__inject__.getSurfingObject(this._id);
  }
  setSurfingPlayerObject(objectMp: ObjectMp) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setSurfingPlayerObject before create");
    }
    if (objectMp.isGlobal()) {
      return 0;
    }
    return this._setSurfingPlayerObject(objectMp.id);
  }
  getSurfingPlayerObject() {
    return ObjectMp.getInstance(
      this.getSurfingPlayerObjectId(),
      this.getPlayer(),
    );
  }
  private _setSurfingPlayerObject(objectId: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setSurfingPlayerObject before create");
    }
    return Npc.__inject__.setSurfingPlayerObject(this._id, objectId);
  }
  private getSurfingPlayerObjectId() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getSurfingPlayerObject before create");
    }
    return Npc.__inject__.getSurfingPlayerObject(this._id);
  }
  resetSurfingData() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot resetSurfingData before create");
    }
    return Npc.__inject__.resetSurfingData(this._id);
  }
  setSurfingDynamicObject(object: DynamicObject) {
    return this._setSurfingPlayerObject(
      Streamer.getItemInternalID(
        new Player(this._id),
        StreamerItemTypes.OBJECT,
        object.id,
      ),
    );
  }
  getSurfingDynamicObject() {
    return DynamicObject.getInstance(this.getSurfingDynamicObjectId());
  }
  getSurfingDynamicObjectId() {
    return Streamer.getItemStreamerID(
      new Player(this._id),
      StreamerItemTypes.OBJECT,
      this.getSurfingPlayerObjectId(),
    );
  }
  isSpawned() {
    if (this.id === InvalidEnum.NPC_ID) return false;
    return Npc.__inject__.isSpawned(this._id);
  }
  kill(killer: Player | number, reason: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot kill before create");
    }
    return Npc.__inject__.kill(
      this._id,
      typeof killer === "number" ? killer : killer.id,
      reason,
    );
  }
  setVelocity(x: number, y: number, z: number) {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot setVelocity before create");
    }
    return Npc.__inject__.setVelocity(this._id, x, y, z);
  }
  getVelocity() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getVelocity before create");
    }
    return Npc.__inject__.getVelocity(this._id);
  }
  getPlayerAimingAt() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getPlayerAimingAt before create");
    }
    const playerId = Npc.__inject__.getPlayerAimingAt(this._id);
    if (playerId !== InvalidEnum.PLAYER_ID)
      return Player.getInstance(playerId)!;
    return null;
  }
  getPlayerMovingTo() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getPlayerMovingTo before create");
    }
    const playerId = Npc.__inject__.getPlayerMovingTo(this._id);
    if (playerId !== InvalidEnum.PLAYER_ID)
      return Player.getInstance(playerId)!;
    return null;
  }
  getPosMovingTo() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getPosMovingTo before create");
    }
    return Npc.__inject__.getPosMovingTo(this._id);
  }
  getCustomSkin() {
    if (this.id === InvalidEnum.NPC_ID) {
      throw new Error("[Npc]: Cannot getCustomSkin before create");
    }
    return Npc.__inject__.getCustomSkin(this._id);
  }
  static startRecordingPlayerData(
    player: Player,
    recordType: RecordTypesEnum,
    recordName: string,
  ): void {
    if (player.isRecording)
      throw new Error("[NpcFunc]: It should be stopped before recording");
    Npc.__inject__.startRecordingPlayerData(player.id, recordType, recordName);
    player[internalPlayerProps].isRecording = true;
  }
  static stopRecordingPlayerData(player: Player): void {
    if (!player.isRecording)
      throw new Error("[NpcFunc]: It should be started before stop");
    Npc.__inject__.stopRecordingPlayerData(player.id);
    player[internalPlayerProps].isRecording = false;
  }
  static isValid(id: number) {
    return Npc.__inject__.isValid(id);
  }
  static getInstance(id: number) {
    return npcPool.get(id);
  }
  static getInstances() {
    return [...npcPool.values()];
  }

  static __inject__ = {
    create: w.NPC_Create,
    destroy: w.NPC_Destroy,
    isValid: w.NPC_IsValid,
    spawn: w.NPC_Spawn,
    respawn: w.NPC_Respawn,
    setPos: w.NPC_SetPos,
    setRot: w.NPC_SetRot,
    getRot: w.NPC_GetRot,
    setFacingAngle: w.NPC_SetFacingAngle,
    getFacingAngle: w.NPC_GetFacingAngle,
    setVirtualWorld: w.NPC_SetVirtualWorld,
    getVirtualWorld: w.NPC_GetVirtualWorld,
    move: w.NPC_Move,
    moveToPlayer: w.NPC_MoveToPlayer,
    stopMove: w.NPC_StopMove,
    isMoving: w.NPC_IsMoving,
    isMovingToPlayer: w.NPC_IsMovingToPlayer,
    setSkin: w.NPC_SetSkin,
    getSkin: w.NPC_GetSkin,
    isStreamedIn: w.NPC_IsStreamedIn,
    isAnyStreamedIn: w.NPC_IsAnyStreamedIn,
    setInterior: w.NPC_SetInterior,
    getInterior: w.NPC_GetInterior,
    setHealth: w.NPC_SetHealth,
    getHealth: w.NPC_GetHealth,
    setArmour: w.NPC_SetArmour,
    getArmour: w.NPC_GetArmour,
    isDead: w.NPC_IsDead,
    applyAnimation: w.NPC_ApplyAnimation,
    setWeapon: w.NPC_SetWeapon,
    getWeapon: w.NPC_GetWeapon,
    setAmmo: w.NPC_SetAmmo,
    getAmmo: w.NPC_GetAmmo,
    setKeys: w.NPC_SetKeys,
    getKeys: w.NPC_GetKeys,
    setWeaponSkillLevel: w.NPC_SetWeaponSkillLevel,
    getWeaponSkillLevel: w.NPC_GetWeaponSkillLevel,
    meleeAttack: w.NPC_MeleeAttack,
    stopMeleeAttack: w.NPC_StopMeleeAttack,
    isMeleeAttacking: w.NPC_IsMeleeAttacking,
    setFightingStyle: w.NPC_SetFightingStyle,
    getFightingStyle: w.NPC_GetFightingStyle,
    enableReloading: w.NPC_EnableReloading,
    isReloadEnabled: w.NPC_IsReloadEnabled,
    isReloading: w.NPC_IsReloading,
    enableInfiniteAmmo: w.NPC_EnableInfiniteAmmo,
    isInfiniteAmmoEnabled: w.NPC_IsInfiniteAmmoEnabled,
    setWeaponState: w.NPC_SetWeaponState,
    getWeaponState: w.NPC_GetWeaponState,
    setAmmoInClip: w.NPC_SetAmmoInClip,
    getAmmoInClip: w.NPC_GetAmmoInClip,
    shoot: w.NPC_Shoot,
    isShooting: w.NPC_IsShooting,
    aimAt: w.NPC_AimAt,
    aimAtPlayer: w.NPC_AimAtPlayer,
    stopAim: w.NPC_StopAim,
    isAiming: w.NPC_IsAiming,
    isAimingAtPlayer: w.NPC_IsAimingAtPlayer,
    setWeaponAccuracy: w.NPC_SetWeaponAccuracy,
    getWeaponAccuracy: w.NPC_GetWeaponAccuracy,
    setWeaponReloadTime: w.NPC_SetWeaponReloadTime,
    getWeaponReloadTime: w.NPC_GetWeaponReloadTime,
    getWeaponActualReloadTime: w.NPC_GetWeaponActualReloadTime,
    setWeaponShootTime: w.NPC_SetWeaponShootTime,
    getWeaponShootTime: w.NPC_GetWeaponShootTime,
    setWeaponClipSize: w.NPC_SetWeaponClipSize,
    getWeaponClipSize: w.NPC_GetWeaponClipSize,
    getWeaponActualClipSize: w.NPC_GetWeaponActualClipSize,
    enterVehicle: w.NPC_EnterVehicle,
    exitVehicle: w.NPC_ExitVehicle,
    putInVehicle: w.NPC_PutInVehicle,
    removeFromVehicle: w.NPC_RemoveFromVehicle,
    getVehicle: w.NPC_GetVehicle,
    getVehicleSeat: w.NPC_GetVehicleSeat,
    getEnteringVehicle: w.NPC_GetEnteringVehicle,
    getEnteringVehicleSeat: w.NPC_GetEnteringVehicleSeat,
    isEnteringVehicle: w.NPC_IsEnteringVehicle,
    useVehicleSiren: w.NPC_UseVehicleSiren,
    isVehicleSirenUsed: w.NPC_IsVehicleSirenUsed,
    setVehicleHealth: w.NPC_SetVehicleHealth,
    getVehicleHealth: w.NPC_GetVehicleHealth,
    setVehicleHydraThrusters: w.NPC_SetVehicleHydraThrusters,
    getVehicleHydraThrusters: w.NPC_GetVehicleHydraThrusters,
    setVehicleGearState: w.NPC_SetVehicleGearState,
    getVehicleGearState: w.NPC_GetVehicleGearState,
    setVehicleTrainSpeed: w.NPC_SetVehicleTrainSpeed,
    getVehicleTrainSpeed: w.NPC_GetVehicleTrainSpeed,
    resetAnimation: w.NPC_ResetAnimation,
    setAnimation: w.NPC_SetAnimation,
    getAnimation: w.NPC_GetAnimation,
    clearAnimations: w.NPC_ClearAnimations,
    setSpecialAction: w.NPC_SetSpecialAction,
    getSpecialAction: w.NPC_GetSpecialAction,
    startPlayback: w.NPC_StartPlayback,
    startPlaybackEx: w.NPC_StartPlaybackEx,
    stopPlayback: w.NPC_StopPlayback,
    pausePlayback: w.NPC_PausePlayback,
    isPlayingPlayback: w.NPC_IsPlayingPlayback,
    isPlaybackPaused: w.NPC_IsPlaybackPaused,
    playNode: w.NPC_PlayNode,
    stopPlayingNode: w.NPC_StopPlayingNode,
    pausePlayingNode: w.NPC_PausePlayingNode,
    resumePlayingNode: w.NPC_ResumePlayingNode,
    isPlayingNodePaused: w.NPC_IsPlayingNodePaused,
    isPlayingNode: w.NPC_IsPlayingNode,
    changeNode: w.NPC_ChangeNode,
    updateNodePoint: w.NPC_UpdateNodePoint,
    setInvulnerable: w.NPC_SetInvulnerable,
    isInvulnerable: w.NPC_IsInvulnerable,
    setSurfingOffsets: w.NPC_SetSurfingOffsets,
    getSurfingOffsets: w.NPC_GetSurfingOffsets,
    setSurfingVehicle: w.NPC_SetSurfingVehicle,
    getSurfingVehicle: w.NPC_GetSurfingVehicle,
    setSurfingObject: w.NPC_SetSurfingObject,
    getSurfingObject: w.NPC_GetSurfingObject,
    setSurfingPlayerObject: w.NPC_SetSurfingPlayerObject,
    getSurfingPlayerObject: w.NPC_GetSurfingPlayerObject,
    resetSurfingData: w.NPC_ResetSurfingData,
    isSpawned: w.NPC_IsSpawned,
    kill: w.NPC_Kill,
    setVelocity: w.NPC_SetVelocity,
    getVelocity: w.NPC_GetVelocity,
    getPlayerAimingAt: w.NPC_GetPlayerAimingAt,
    getPlayerMovingTo: w.NPC_GetPlayerMovingTo,
    getPosMovingTo: w.NPC_GetPosMovingTo,
    getCustomSkin: w.NPC_GetCustomSkin,

    startRecordingPlayerData: w.StartRecordingPlayerData,
    stopRecordingPlayerData: w.StopRecordingPlayerData,
  };
}
