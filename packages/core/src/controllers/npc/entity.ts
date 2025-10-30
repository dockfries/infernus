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
import { innerPlayerProps, npcPool } from "core/utils/pools";
import { INTERNAL_FLAGS } from "core/utils/flags";
import { DynamicObject } from "core/wrapper/streamer/object";
import { Streamer } from "core/wrapper/streamer";
import { NpcRecord } from "./record";
import { NpcNode } from "./node";

export class Npc {
  private _id: number = InvalidEnum.NPC_ID;
  private _name = "";

  get id() {
    return this._id;
  }

  constructor(name: string) {
    this._id = samp.callNative("NPC_Create", "s", name);
    this._name = name;
    if (this._id !== InvalidEnum.NPC_ID) {
      if (!this.getPlayer()) {
        new Player(this._id);
      }
      npcPool.set(this._id, this);
    }
    return this;
  }
  getPlayer() {
    return Player.getInstance(this._id)!;
  }
  getName() {
    return this._name;
  }
  destroy() {
    if (!INTERNAL_FLAGS.skip) {
      samp.callNative("NPC_Destroy", "i", this._id);
    }
    npcPool.delete(this._id);
    this._id = InvalidEnum.NPC_ID;
    return this;
  }
  isValid() {
    if (INTERNAL_FLAGS.skip && this._id !== InvalidEnum.NPC_ID) return true;
    return Npc.isValid(this._id);
  }
  spawn() {
    samp.callNative("NPC_Spawn", "i", this._id);
    return this;
  }
  respawn() {
    samp.callNative("NPC_Respawn", "i", this._id);
    return this;
  }
  setPos(x: number, y: number, z: number) {
    samp.callNative("NPC_SetPos", "ifff", this._id, x, y, z);
    return this;
  }
  setRot(rX: number, rY: number, rZ: number) {
    samp.callNative("NPC_SetRot", "ifff", this._id, rX, rY, rZ);
    return this;
  }
  getRot() {
    const [rX, rY, rZ, ret]: [number, number, number, number] = samp.callNative(
      "NPC_GetRot",
      "iFFF",
      this._id,
    );
    return { rX, rY, rZ, ret };
  }
  setFacingAngle(angle: number) {
    samp.callNative("NPC_SetFacingAngle", "if", this._id, angle);
    return this;
  }
  getFacingAngle() {
    const [angle, ret]: [number, number] = samp.callNative(
      "NPC_GetFacingAngle",
      "iF",
      this._id,
    );
    return { angle, ret };
  }
  setVirtualWorld(virtualWorld: number) {
    samp.callNative("NPC_SetVirtualWorld", "ii", this._id, virtualWorld);
    return this;
  }
  getVirtualWorld() {
    return samp.callNative("NPC_GetVirtualWorld", "i", this._id) as number;
  }
  move(
    targetPosX: number,
    targetPosY: number,
    targetPosZ: number,
    moveType: number,
    moveSpeed: number = NPCMoveSpeedEnum.AUTO,
  ) {
    return !!samp.callNative(
      "NPC_Move",
      "ifffif",
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
    moveType: number,
    moveSpeed: number = NPCMoveSpeedEnum.AUTO,
  ) {
    return !!samp.callNative(
      "NPC_MoveToPlayer",
      "iiif",
      this._id,
      player.id,
      moveType,
      moveSpeed,
    );
  }
  stopMove() {
    samp.callNative("NPC_StopMove", "i", this._id);
    return this;
  }
  isMoving() {
    return !!samp.callNative("NPC_IsMoving", "i", this._id);
  }
  isMovingToPlayer(player: Player) {
    return !!samp.callNative("NPC_IsMovingToPlayer", "ii", this._id, player.id);
  }
  setSkin(model: number) {
    samp.callNative("NPC_SetSkin", "ii", this._id, model);
    return this;
  }
  getSkin() {
    return samp.callNative("NPC_GetSkin", "i", this._id) as number;
  }
  isStreamedIn(player: Player) {
    return !!samp.callNative("NPC_IsStreamedIn", "ii", this._id, player.id);
  }
  isAnyStreamedIn() {
    return !!samp.callNative("NPC_IsAnyStreamedIn", "i", this._id);
  }
  setInterior(interior: number) {
    samp.callNative("NPC_SetInterior", "ii", this._id, interior);
    return this;
  }
  getInterior() {
    return samp.callNative("NPC_GetInterior", "i", this._id) as number;
  }
  setHealth(health: number) {
    samp.callNative("NPC_SetHealth", "if", this._id, health);
    return this;
  }
  getHealth() {
    return samp.callNativeFloat("NPC_GetHealth", "i", this._id) as number;
  }
  setArmour(armour: number) {
    samp.callNative("NPC_SetArmour", "if", this._id, armour);
    return this;
  }
  getArmour() {
    return samp.callNativeFloat("NPC_GetArmour", "i", this._id) as number;
  }
  isDead() {
    return !!samp.callNative("NPC_IsDead", "i", this._id);
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
    samp.callNative(
      "NPC_ApplyAnimation",
      "issfiiiiii",
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
    samp.callNative("NPC_SetWeapon", "ii", this._id, weapon);
    return this;
  }
  getWeapon() {
    return samp.callNative("NPC_GetWeapon", "i", this._id) as WeaponEnum;
  }
  setAmmo(ammo: number) {
    samp.callNative("NPC_SetAmmo", "ii", this._id, ammo);
    return this;
  }
  getAmmo() {
    return samp.callNative("NPC_GetAmmo", "i", this._id) as number;
  }
  setKeys(upAndDown: number, leftAndDown: number, keys: number) {
    samp.callNative(
      "NPC_SetKeys",
      "iiii",
      this._id,
      upAndDown,
      leftAndDown,
      keys,
    );
    return this;
  }
  getKeys() {
    const [upAndDown, leftAndDown, keys, ret]: [
      number,
      number,
      number,
      number,
    ] = samp.callNative("NPC_GetKeys", "iIII", this._id);
    return { upAndDown, leftAndDown, keys, ret };
  }
  setWeaponSkillLevel(skill: WeaponSkillsEnum, level: number) {
    samp.callNative("NPC_SetWeaponSkillLevel", "iii", this._id, skill, level);
    return this;
  }
  getWeaponSkillLevel(skill: WeaponSkillsEnum) {
    return samp.callNative(
      "NPC_GetWeaponSkillLevel",
      "ii",
      this._id,
      skill,
    ) as number;
  }
  meleeAttack(time: number, secondaryAttack: boolean) {
    samp.callNative("NPC_MeleeAttack", "iii", this._id, time, secondaryAttack);
    return this;
  }
  stopMeleeAttack() {
    samp.callNative("NPC_StopMeleeAttack", "i", this._id);
    return this;
  }
  isMeleeAttacking() {
    return !!samp.callNative("NPC_IsMeleeAttacking", "i", this._id);
  }
  setFightingStyle(style: FightingStylesEnum) {
    samp.callNative("NPC_SetFightingStyle", "ii", this._id, style);
    return this;
  }
  getFightingStyle() {
    return samp.callNative(
      "NPC_GetFightingStyle",
      "i",
      this._id,
    ) as FightingStylesEnum;
  }
  enableReloading(enable: boolean) {
    samp.callNative("NPC_EnableReloading", "ii", this._id, enable);
    return this;
  }
  isReloadEnabled() {
    return !!samp.callNative("NPC_IsReloadEnabled", "i", this._id);
  }
  isReloading() {
    return !!samp.callNative("NPC_IsReloading", "i", this._id);
  }
  enableInfiniteAmmo(enable: boolean) {
    samp.callNative("NPC_EnableInfiniteAmmo", "ii", this._id, enable);
    return this;
  }
  isInfiniteAmmoEnabled() {
    return !!samp.callNative("NPC_IsInfiniteAmmoEnabled", "i", this._id);
  }
  setWeaponState(weaponState: WeaponStatesEnum) {
    return !!samp.callNative("NPC_SetWeaponState", "ii", this._id, weaponState);
  }
  getWeaponState() {
    return samp.callNative(
      "NPC_GetWeaponState",
      "i",
      this._id,
    ) as WeaponStatesEnum;
  }
  setAmmoInClip(ammo: number) {
    samp.callNative("NPC_SetAmmoInClip", "ii", this._id, ammo);
    return this;
  }
  getAmmoInClip() {
    return samp.callNative("NPC_GetAmmoInClip", "i", this._id) as number;
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
    samp.callNative(
      "NPC_Shoot",
      "iiiffffffii",
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
    return !!samp.callNative("NPC_IsShooting", "i", this._id);
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
    samp.callNative(
      "NPC_AimAt",
      "ifffiiifffi",
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
    samp.callNative(
      "NPC_AimAtPlayer",
      "iiiiiffffffi",
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
    samp.callNative("NPC_StopAim", "i", this._id);
    return this;
  }
  isAiming() {
    return !!samp.callNative("NPC_IsAiming", "i", this._id);
  }
  isAimingAtPlayer(player: Player) {
    return !!samp.callNative("NPC_IsAimingAtPlayer", "ii", this._id, player.id);
  }
  setWeaponAccuracy(weapon: WeaponEnum, accuracy: number) {
    samp.callNative("NPC_SetWeaponAccuracy", "iif", this._id, weapon, accuracy);
    return this;
  }
  getWeaponAccuracy(weapon: number) {
    return samp.callNativeFloat(
      "NPC_GetWeaponAccuracy",
      "ii",
      this._id,
      weapon,
    ) as number;
  }
  setWeaponReloadTime(weapon: number, time: number) {
    return samp.callNative(
      "NPC_SetWeaponReloadTime",
      "iii",
      this._id,
      weapon,
      time,
    ) as number;
  }
  getWeaponReloadTime(weapon: number) {
    return samp.callNative(
      "NPC_GetWeaponReloadTime",
      "ii",
      this._id,
      weapon,
    ) as number;
  }
  getWeaponActualReloadTime(weapon: number) {
    return samp.callNative(
      "NPC_GetWeaponActualReloadTime",
      "ii",
      this._id,
      weapon,
    ) as number;
  }
  setWeaponShootTime(weapon: number, time: number) {
    return samp.callNative(
      "NPC_SetWeaponShootTime",
      "iii",
      this._id,
      weapon,
      time,
    ) as number;
  }
  getWeaponShootTime(weapon: number) {
    return samp.callNative(
      "NPC_GetWeaponShootTime",
      "ii",
      this._id,
      weapon,
    ) as number;
  }
  setWeaponClipSize(weapon: number, size: number) {
    return samp.callNative(
      "NPC_SetWeaponClipSize",
      "iii",
      this._id,
      weapon,
      size,
    ) as number;
  }
  getWeaponClipSize(weapon: number) {
    return samp.callNative(
      "NPC_GetWeaponClipSize",
      "ii",
      this._id,
      weapon,
    ) as number;
  }
  getWeaponActualClipSize(weapon: number) {
    return samp.callNative(
      "NPC_GetWeaponActualClipSize",
      "ii",
      this._id,
      weapon,
    ) as number;
  }
  enterVehicle(vehicle: Vehicle, seatId: number, moveType: number) {
    samp.callNative(
      "NPC_EnterVehicle",
      "iiii",
      this._id,
      vehicle.id,
      seatId,
      moveType,
    );
    return this;
  }
  exitVehicle() {
    samp.callNative("NPC_ExitVehicle", "i", this._id);
    return this;
  }
  putInVehicle(vehicle: Vehicle, seat: number) {
    return samp.callNative(
      "NPC_PutInVehicle",
      "iii",
      this._id,
      vehicle.id,
      seat,
    ) as number;
  }
  removeFromVehicle() {
    return samp.callNative("NPC_RemoveFromVehicle", "i", this._id) as number;
  }
  getVehicle() {
    return Vehicle.getInstance(this.getVehicleID());
  }
  getVehicleID() {
    return samp.callNative("NPC_GetVehicle", "i", this._id) as number;
  }
  getVehicleSeat() {
    return samp.callNative("NPC_GetVehicleSeat", "i", this._id) as number;
  }
  getEnteringVehicle() {
    return Vehicle.getInstance(this.getEnteringVehicleId());
  }
  getEnteringVehicleId() {
    return samp.callNative("NPC_GetEnteringVehicle", "i", this._id) as number;
  }
  getEnteringVehicleSeat() {
    return samp.callNative(
      "NPC_GetEnteringVehicleSeat",
      "i",
      this._id,
    ) as number;
  }
  isEnteringVehicle() {
    return !!samp.callNative("NPC_IsEnteringVehicle", "i", this._id);
  }
  useVehicleSiren(use = true) {
    return samp.callNative(
      "NPC_UseVehicleSiren",
      "ii",
      this._id,
      use,
    ) as number;
  }
  isVehicleSirenUsed() {
    return !!samp.callNative("NPC_IsVehicleSirenUsed", "i", this._id);
  }
  setVehicleHealth(health: number) {
    return samp.callNative(
      "NPC_SetVehicleHealth",
      "if",
      this._id,
      health,
    ) as number;
  }
  getVehicleHealth() {
    return samp.callNativeFloat(
      "NPC_GetVehicleHealth",
      "i",
      this._id,
    ) as number;
  }
  setVehicleHydraThrusters(direction: number) {
    return samp.callNative(
      "NPC_SetVehicleHydraThrusters",
      "ii",
      this._id,
      direction,
    ) as number;
  }
  getVehicleHydraThrusters() {
    return samp.callNative(
      "NPC_GetVehicleHydraThrusters",
      "i",
      this._id,
    ) as number;
  }
  setVehicleGearState(gearState: number) {
    return samp.callNative(
      "NPC_SetVehicleGearState",
      "ii",
      this._id,
      gearState,
    ) as number;
  }
  getVehicleGearState() {
    return samp.callNative("NPC_GetVehicleGearState", "i", this._id) as number;
  }
  setVehicleTrainSpeed(speed: number) {
    return samp.callNative(
      "NPC_SetVehicleTrainSpeed",
      "if",
      this._id,
      speed,
    ) as number;
  }
  getVehicleTrainSpeed() {
    return samp.callNativeFloat(
      "NPC_GetVehicleTrainSpeed",
      "i",
      this._id,
    ) as number;
  }
  resetAnimation() {
    return samp.callNative("NPC_ResetAnimation", "i", this._id) as number;
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
    return samp.callNative(
      "NPC_SetAnimation",
      "iifiiiii",
      this._id,
      animationId,
      delta,
      loop,
      lockX,
      lockY,
      freeze,
      time,
    ) as number;
  }
  getAnimation() {
    const [
      animationId,
      delta,
      loop,
      lockX,
      lockY,
      freeze,
      time,
      ret,
    ]: number[] = samp.callNative("NPC_GetAnimation", "iIFIIIII", this._id);
    return {
      animationId,
      delta,
      loop: !!loop,
      lockX: !!lockX,
      lockY: !!lockY,
      freeze: !!freeze,
      time,
      ret,
    };
  }
  clearAnimations() {
    return samp.callNative("NPC_ClearAnimations", "i", this._id) as number;
  }
  setSpecialAction(action: number) {
    return samp.callNative(
      "NPC_SetSpecialAction",
      "ii",
      this._id,
      action,
    ) as number;
  }
  getSpecialAction() {
    return samp.callNative("NPC_SetSpecialAction", "i", this._id) as number;
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
    return samp.callNative(
      "NPC_StartPlayback",
      "isiffffff",
      this._id,
      recordName,
      autoUnload,
      startX,
      startY,
      startZ,
      rotX,
      rotY,
      rotZ,
    ) as number;
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
    return samp.callNative(
      "NPC_StartPlaybackEx",
      "iiiffffff",
      this._id,
      record.id,
      autoUnload,
      startX,
      startY,
      startZ,
      rotX,
      rotY,
      rotZ,
    ) as number;
  }
  stopPlayback() {
    return samp.callNative("NPC_StopPlayback", "i", this._id) as number;
  }
  pausePlayback(paused: boolean) {
    return samp.callNative(
      "NPC_PausePlayback",
      "ii",
      this._id,
      paused,
    ) as number;
  }
  isPlayingPlayback() {
    return !!samp.callNative("NPC_IsPlayingPlayback", "i", this._id);
  }
  isPlaybackPaused() {
    return !!samp.callNative("NPC_IsPlaybackPaused", "i", this._id);
  }
  playNode(
    node: NpcNode,
    moveType = NPCMoveTypeEnum.JOG,
    speed: number = NPCMoveSpeedEnum.AUTO,
    radius = 0.0,
    setAngle = true,
  ) {
    return !!samp.callNative(
      "NPC_PlayNode",
      "iiiffi",
      this._id,
      node.id,
      moveType,
      speed,
      radius,
      setAngle,
    );
  }
  stopPlayingNode() {
    return !!samp.callNative("NPC_StopPlayingNode", "i", this._id);
  }
  pausePlayingNode() {
    return !!samp.callNative("NPC_PausePlayingNode", "i", this._id);
  }
  resumePlayingNode() {
    return !!samp.callNative("NPC_ResumePlayingNode", "i", this._id);
  }
  isPlayingNodePaused() {
    return !!samp.callNative("NPC_IsPlayingNodePaused", "i", this._id);
  }
  isPlayingNode() {
    return !!samp.callNative("NPC_IsPlayingNode", "i", this._id);
  }
  changeNode(node: NpcNode, link: number) {
    return samp.callNative(
      "NPC_ChangeNode",
      "iii",
      this._id,
      node.id,
      link,
    ) as number;
  }
  updateNodePoint(pointId: number) {
    return !!samp.callNative("NPC_UpdateNodePoint", "ii", this._id, pointId);
  }
  setInvulnerable(toggle: boolean) {
    return samp.callNative(
      "NPC_SetInvulnerable",
      "ii",
      this._id,
      toggle,
    ) as number;
  }
  isInvulnerable() {
    return !!samp.callNative("NPC_IsInvulnerable", "i", this._id);
  }
  setSurfingOffsets(x: number, y: number, z: number) {
    return samp.callNative(
      "NPC_SetSurfingOffsets",
      "ifff",
      this._id,
      x,
      y,
      z,
    ) as number;
  }
  getSurfingOffsets() {
    const [x, y, z, ret]: number[] = samp.callNative(
      "NPC_GetSurfingOffsets",
      "iFFF",
      this._id,
    );
    return { x, y, z, ret };
  }
  setSurfingVehicle(vehicle: Vehicle) {
    return samp.callNative(
      "NPC_SetSurfingVehicle",
      "ii",
      this._id,
      vehicle.id,
    ) as number;
  }
  getSurfingVehicle() {
    return Vehicle.getInstance(this.getSurfingVehicleId());
  }
  getSurfingVehicleId() {
    return samp.callNative("NPC_GetSurfingVehicle", "i", this._id) as number;
  }
  private setSurfingPlayerObject(objectId: number) {
    return samp.callNative(
      "NPC_SetSurfingPlayerObject",
      "ii",
      this._id,
      objectId,
    ) as number;
  }
  private getSurfingPlayerObject() {
    return samp.callNative(
      "NPC_GetSurfingPlayerObject",
      "i",
      this._id,
    ) as number;
  }
  resetSurfingData() {
    return samp.callNative("NPC_ResetSurfingData", "i", this._id) as number;
  }
  setSurfingDynamicObject(object: DynamicObject) {
    return this.setSurfingPlayerObject(
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
      this.getSurfingPlayerObject(),
    );
  }
  isSpawned() {
    return !!samp.callNative("NPC_IsSpawned", "i", this._id);
  }
  kill(killer: Player | number, reason: number) {
    return !!samp.callNative(
      "NPC_Kill",
      "iii",
      this._id,
      typeof killer === "number" ? killer : killer.id,
      reason,
    );
  }
  setVelocity(x: number, y: number, z: number) {
    return !!samp.callNative("NPC_SetVelocity", "ifff", this._id, x, y, z);
  }
  getVelocity() {
    const [x, y, z, ret]: number[] = samp.callNative(
      "NPC_GetVelocity",
      "iFFF",
      this._id,
    );
    return { x, y, z, ret };
  }
  getPlayerAimingAt() {
    const playerId: number = samp.callNative(
      "NPC_GetPlayerAimingAt",
      "i",
      this._id,
    );
    if (playerId !== InvalidEnum.PLAYER_ID)
      return Player.getInstance(playerId)!;
    return null;
  }
  getPlayerMovingTo() {
    const playerId: number = samp.callNative(
      "NPC_GetPlayerMovingTo",
      "i",
      this._id,
    );
    if (playerId !== InvalidEnum.PLAYER_ID)
      return Player.getInstance(playerId)!;
    return null;
  }
  static startRecordingPlayerData(
    player: Player,
    recordType: RecordTypesEnum,
    recordName: string,
  ): void {
    if (player.isRecording)
      throw new Error("[NpcFunc]: It should be stopped before recording");
    w.StartRecordingPlayerData(player.id, recordType, recordName);
    player[innerPlayerProps].isRecording = true;
  }
  static stopRecordingPlayerData(player: Player): void {
    if (!player.isRecording)
      throw new Error("[NpcFunc]: It should be started before stop");
    w.StopRecordingPlayerData(player.id);
    player[innerPlayerProps].isRecording = false;
  }
  static isValid(id: number) {
    return !!samp.callNative("NPC_IsValid", "i", id);
  }
  static getInstance(id: number) {
    return npcPool.get(id);
  }
  static getInstances() {
    return [...npcPool.values()];
  }
}
