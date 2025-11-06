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

  constructor(name: string) {
    this._id = Npc.__inject__.NPC_Create(name);
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
      Npc.__inject__.NPC_Destroy(this._id);
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
    Npc.__inject__.NPC_Spawn(this._id);
    return this;
  }
  respawn() {
    Npc.__inject__.NPC_Respawn(this._id);
    return this;
  }
  setPos(x: number, y: number, z: number) {
    Npc.__inject__.NPC_SetPos(this._id, x, y, z);
    return this;
  }
  setRot(rX: number, rY: number, rZ: number) {
    Npc.__inject__.NPC_SetRot(this._id, rX, rY, rZ);
    return this;
  }
  getRot() {
    return Npc.__inject__.NPC_GetRot(this._id);
  }
  setFacingAngle(angle: number) {
    Npc.__inject__.NPC_SetFacingAngle(this._id, angle);
    return this;
  }
  getFacingAngle() {
    return Npc.__inject__.NPC_GetFacingAngle(this._id);
  }
  setVirtualWorld(virtualWorld: number) {
    Npc.__inject__.NPC_SetVirtualWorld(this._id, virtualWorld);
    return this;
  }
  getVirtualWorld() {
    return Npc.__inject__.NPC_GetVirtualWorld(this._id);
  }
  move(
    targetPosX: number,
    targetPosY: number,
    targetPosZ: number,
    moveType: number,
    moveSpeed: number = NPCMoveSpeedEnum.AUTO,
  ) {
    return Npc.__inject__.NPC_Move(
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
    return Npc.__inject__.NPC_MoveToPlayer(
      this._id,
      player.id,
      moveType,
      moveSpeed,
    );
  }
  stopMove() {
    Npc.__inject__.NPC_StopMove(this._id);
    return this;
  }
  isMoving() {
    return Npc.__inject__.NPC_IsMoving(this._id);
  }
  isMovingToPlayer(player: Player) {
    return Npc.__inject__.NPC_IsMovingToPlayer(this._id, player.id);
  }
  setSkin(model: number) {
    Npc.__inject__.NPC_SetSkin(this._id, model);
    return this;
  }
  getSkin() {
    return Npc.__inject__.NPC_GetSkin(this._id);
  }
  isStreamedIn(player: Player) {
    return Npc.__inject__.NPC_IsStreamedIn(this._id, player.id);
  }
  isAnyStreamedIn() {
    return Npc.__inject__.NPC_IsAnyStreamedIn(this._id);
  }
  setInterior(interior: number) {
    Npc.__inject__.NPC_SetInterior(this._id, interior);
    return this;
  }
  getInterior() {
    return Npc.__inject__.NPC_GetInterior(this._id);
  }
  setHealth(health: number) {
    Npc.__inject__.NPC_SetHealth(this._id, health);
    return this;
  }
  getHealth() {
    return Npc.__inject__.NPC_GetHealth(this._id);
  }
  setArmour(armour: number) {
    Npc.__inject__.NPC_SetArmour(this._id, armour);
    return this;
  }
  getArmour() {
    return Npc.__inject__.NPC_GetArmour(this._id);
  }
  isDead() {
    return Npc.__inject__.NPC_IsDead(this._id);
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
    Npc.__inject__.NPC_ApplyAnimation(
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
    Npc.__inject__.NPC_SetWeapon(this._id, weapon);
    return this;
  }
  getWeapon() {
    return Npc.__inject__.NPC_GetWeapon(this._id);
  }
  setAmmo(ammo: number) {
    Npc.__inject__.NPC_SetAmmo(this._id, ammo);
    return this;
  }
  getAmmo() {
    return Npc.__inject__.NPC_GetAmmo(this._id);
  }
  setKeys(upAndDown: number, leftAndDown: number, keys: number) {
    Npc.__inject__.NPC_SetKeys(this._id, upAndDown, leftAndDown, keys);
    return this;
  }
  getKeys() {
    return Npc.__inject__.NPC_GetKeys(this._id);
  }
  setWeaponSkillLevel(skill: WeaponSkillsEnum, level: number) {
    Npc.__inject__.NPC_SetWeaponSkillLevel(this._id, skill, level);
    return this;
  }
  getWeaponSkillLevel(skill: WeaponSkillsEnum) {
    return Npc.__inject__.NPC_GetWeaponSkillLevel(this._id, skill);
  }
  meleeAttack(time: number, secondaryAttack: boolean) {
    Npc.__inject__.NPC_MeleeAttack(this._id, time, secondaryAttack);
    return this;
  }
  stopMeleeAttack() {
    Npc.__inject__.NPC_StopMeleeAttack(this._id);
    return this;
  }
  isMeleeAttacking() {
    return Npc.__inject__.NPC_IsMeleeAttacking(this._id);
  }
  setFightingStyle(style: FightingStylesEnum) {
    Npc.__inject__.NPC_SetFightingStyle(this._id, style);
    return this;
  }
  getFightingStyle() {
    return Npc.__inject__.NPC_GetFightingStyle(this._id);
  }
  enableReloading(enable: boolean) {
    Npc.__inject__.NPC_EnableReloading(this._id, enable);
    return this;
  }
  isReloadEnabled() {
    return Npc.__inject__.NPC_IsReloadEnabled(this._id);
  }
  isReloading() {
    return Npc.__inject__.NPC_IsReloading(this._id);
  }
  enableInfiniteAmmo(enable: boolean) {
    Npc.__inject__.NPC_EnableInfiniteAmmo(this._id, enable);
    return this;
  }
  isInfiniteAmmoEnabled() {
    return Npc.__inject__.NPC_IsInfiniteAmmoEnabled(this._id);
  }
  setWeaponState(weaponState: WeaponStatesEnum) {
    return Npc.__inject__.NPC_SetWeaponState(this._id, weaponState);
  }
  getWeaponState() {
    return Npc.__inject__.NPC_GetWeaponState(this._id);
  }
  setAmmoInClip(ammo: number) {
    Npc.__inject__.NPC_SetAmmoInClip(this._id, ammo);
    return this;
  }
  getAmmoInClip() {
    return Npc.__inject__.NPC_GetAmmoInClip(this._id);
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
    Npc.__inject__.NPC_Shoot(
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
    return Npc.__inject__.NPC_IsShooting(this._id);
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
    Npc.__inject__.NPC_AimAt(
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
    Npc.__inject__.NPC_AimAtPlayer(
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
    Npc.__inject__.NPC_StopAim(this._id);
    return this;
  }
  isAiming() {
    return Npc.__inject__.NPC_IsAiming(this._id);
  }
  isAimingAtPlayer(player: Player) {
    return Npc.__inject__.NPC_IsAimingAtPlayer(this._id, player.id);
  }
  setWeaponAccuracy(weapon: WeaponEnum, accuracy: number) {
    Npc.__inject__.NPC_SetWeaponAccuracy(this._id, weapon, accuracy);
    return this;
  }
  getWeaponAccuracy(weapon: number) {
    return Npc.__inject__.NPC_GetWeaponAccuracy(this._id, weapon);
  }
  setWeaponReloadTime(weapon: number, time: number) {
    return Npc.__inject__.NPC_SetWeaponReloadTime(this._id, weapon, time);
  }
  getWeaponReloadTime(weapon: number) {
    return Npc.__inject__.NPC_GetWeaponReloadTime(this._id, weapon);
  }
  getWeaponActualReloadTime(weapon: number) {
    return Npc.__inject__.NPC_GetWeaponActualReloadTime(this._id, weapon);
  }
  setWeaponShootTime(weapon: number, time: number) {
    return Npc.__inject__.NPC_SetWeaponShootTime(this._id, weapon, time);
  }
  getWeaponShootTime(weapon: number) {
    return Npc.__inject__.NPC_GetWeaponShootTime(this._id, weapon);
  }
  setWeaponClipSize(weapon: number, size: number) {
    return Npc.__inject__.NPC_SetWeaponClipSize(this._id, weapon, size);
  }
  getWeaponClipSize(weapon: number) {
    return Npc.__inject__.NPC_GetWeaponClipSize(this._id, weapon);
  }
  getWeaponActualClipSize(weapon: number) {
    return Npc.__inject__.NPC_GetWeaponActualClipSize(this._id, weapon);
  }
  enterVehicle(vehicle: Vehicle, seatId: number, moveType: number) {
    Npc.__inject__.NPC_EnterVehicle(this._id, vehicle.id, seatId, moveType);
    return this;
  }
  exitVehicle() {
    Npc.__inject__.NPC_ExitVehicle(this._id);
    return this;
  }
  putInVehicle(vehicle: Vehicle, seat: number) {
    return Npc.__inject__.NPC_PutInVehicle(this._id, vehicle.id, seat);
  }
  removeFromVehicle() {
    return Npc.__inject__.NPC_RemoveFromVehicle(this._id);
  }
  getVehicle() {
    return Vehicle.getInstance(this.getVehicleID());
  }
  getVehicleID() {
    return Npc.__inject__.NPC_GetVehicle(this._id);
  }
  getVehicleSeat() {
    return Npc.__inject__.NPC_GetVehicleSeat(this._id);
  }
  getEnteringVehicle() {
    return Vehicle.getInstance(this.getEnteringVehicleId());
  }
  getEnteringVehicleId() {
    return Npc.__inject__.NPC_GetEnteringVehicle(this._id);
  }
  getEnteringVehicleSeat() {
    return Npc.__inject__.NPC_GetEnteringVehicleSeat(this._id);
  }
  isEnteringVehicle() {
    return Npc.__inject__.NPC_IsEnteringVehicle(this._id);
  }
  useVehicleSiren(use = true) {
    return Npc.__inject__.NPC_UseVehicleSiren(this._id, use);
  }
  isVehicleSirenUsed() {
    return Npc.__inject__.NPC_IsVehicleSirenUsed(this._id);
  }
  setVehicleHealth(health: number) {
    return Npc.__inject__.NPC_SetVehicleHealth(this._id, health);
  }
  getVehicleHealth() {
    return Npc.__inject__.NPC_GetVehicleHealth(this._id);
  }
  setVehicleHydraThrusters(direction: number) {
    return Npc.__inject__.NPC_SetVehicleHydraThrusters(this._id, direction);
  }
  getVehicleHydraThrusters() {
    return Npc.__inject__.NPC_GetVehicleHydraThrusters(this._id);
  }
  setVehicleGearState(gearState: number) {
    return Npc.__inject__.NPC_SetVehicleGearState(this._id, gearState);
  }
  getVehicleGearState() {
    return Npc.__inject__.NPC_GetVehicleGearState(this._id);
  }
  setVehicleTrainSpeed(speed: number) {
    return Npc.__inject__.NPC_SetVehicleTrainSpeed(this._id, speed);
  }
  getVehicleTrainSpeed() {
    return Npc.__inject__.NPC_GetVehicleTrainSpeed(this._id);
  }
  resetAnimation() {
    return Npc.__inject__.NPC_ResetAnimation(this._id);
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
    return Npc.__inject__.NPC_SetAnimation(
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
    return Npc.__inject__.NPC_GetAnimation(this._id);
  }
  clearAnimations() {
    return Npc.__inject__.NPC_ClearAnimations(this._id);
  }
  setSpecialAction(action: number) {
    return Npc.__inject__.NPC_SetSpecialAction(this._id, action);
  }
  getSpecialAction() {
    return Npc.__inject__.NPC_GetSpecialAction(this._id);
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
    return Npc.__inject__.NPC_StartPlayback(
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
    return Npc.__inject__.NPC_StartPlaybackEx(
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
    return Npc.__inject__.NPC_StopPlayback(this._id);
  }
  pausePlayback(paused: boolean) {
    return Npc.__inject__.NPC_PausePlayback(this._id, paused);
  }
  isPlayingPlayback() {
    return Npc.__inject__.NPC_IsPlayingPlayback(this._id);
  }
  isPlaybackPaused() {
    return Npc.__inject__.NPC_IsPlaybackPaused(this._id);
  }
  playNode(
    node: NpcNode,
    moveType = NPCMoveTypeEnum.JOG,
    speed: number = NPCMoveSpeedEnum.AUTO,
    radius = 0.0,
    setAngle = true,
  ) {
    return Npc.__inject__.NPC_PlayNode(
      this._id,
      node.id,
      moveType,
      speed,
      radius,
      setAngle,
    );
  }
  stopPlayingNode() {
    return Npc.__inject__.NPC_StopPlayingNode(this._id);
  }
  pausePlayingNode() {
    return Npc.__inject__.NPC_PausePlayingNode(this._id);
  }
  resumePlayingNode() {
    return Npc.__inject__.NPC_ResumePlayingNode(this._id);
  }
  isPlayingNodePaused() {
    return Npc.__inject__.NPC_IsPlayingNodePaused(this._id);
  }
  isPlayingNode() {
    return Npc.__inject__.NPC_IsPlayingNode(this._id);
  }
  changeNode(node: NpcNode, link: number) {
    return Npc.__inject__.NPC_ChangeNode(this._id, node.id, link);
  }
  updateNodePoint(pointId: number) {
    return Npc.__inject__.NPC_UpdateNodePoint(this._id, pointId);
  }
  setInvulnerable(toggle: boolean) {
    return Npc.__inject__.NPC_SetInvulnerable(this._id, toggle);
  }
  isInvulnerable() {
    return Npc.__inject__.NPC_IsInvulnerable(this._id);
  }
  setSurfingOffsets(x: number, y: number, z: number) {
    return Npc.__inject__.NPC_SetSurfingOffsets(this._id, x, y, z);
  }
  getSurfingOffsets() {
    return Npc.__inject__.NPC_GetSurfingOffsets(this._id);
  }
  setSurfingVehicle(vehicle: Vehicle) {
    return Npc.__inject__.NPC_SetSurfingVehicle(this._id, vehicle.id);
  }
  getSurfingVehicle() {
    return Vehicle.getInstance(this.getSurfingVehicleId());
  }
  getSurfingVehicleId() {
    return Npc.__inject__.NPC_GetSurfingVehicle(this._id);
  }
  setSurfingObject(objectMp: ObjectMp) {
    if (!objectMp.isGlobal()) {
      return 0;
    }
    return Npc.__inject__.NPC_SetSurfingObject(this._id, objectMp.id);
  }
  getSurfingObject() {
    return ObjectMp.getInstance(this.getSurfingObjectId());
  }
  private getSurfingObjectId() {
    return Npc.__inject__.NPC_GetSurfingObject(this._id);
  }
  setSurfingPlayerObject(objectMp: ObjectMp) {
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
    return Npc.__inject__.NPC_SetSurfingPlayerObject(this._id, objectId);
  }
  private getSurfingPlayerObjectId() {
    return Npc.__inject__.NPC_GetSurfingPlayerObject(this._id);
  }
  resetSurfingData() {
    return Npc.__inject__.NPC_ResetSurfingData(this._id);
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
    return Npc.__inject__.NPC_IsSpawned(this._id);
  }
  kill(killer: Player | number, reason: number) {
    return Npc.__inject__.NPC_Kill(
      this._id,
      typeof killer === "number" ? killer : killer.id,
      reason,
    );
  }
  setVelocity(x: number, y: number, z: number) {
    return Npc.__inject__.NPC_SetVelocity(this._id, x, y, z);
  }
  getVelocity() {
    return Npc.__inject__.NPC_GetVelocity(this._id);
  }
  getPlayerAimingAt() {
    const playerId = Npc.__inject__.NPC_GetPlayerAimingAt(this._id);
    if (playerId !== InvalidEnum.PLAYER_ID)
      return Player.getInstance(playerId)!;
    return null;
  }
  getPlayerMovingTo() {
    const playerId = Npc.__inject__.NPC_GetPlayerMovingTo(this._id);
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
    Npc.__inject__.StartRecordingPlayerData(player.id, recordType, recordName);
    player[internalPlayerProps].isRecording = true;
  }
  static stopRecordingPlayerData(player: Player): void {
    if (!player.isRecording)
      throw new Error("[NpcFunc]: It should be started before stop");
    Npc.__inject__.StopRecordingPlayerData(player.id);
    player[internalPlayerProps].isRecording = false;
  }
  static isValid(id: number) {
    return Npc.__inject__.NPC_IsValid(id);
  }
  static getInstance(id: number) {
    return npcPool.get(id);
  }
  static getInstances() {
    return [...npcPool.values()];
  }

  static __inject__ = {
    NPC_Create: w.NPC_Create,
    NPC_Destroy: w.NPC_Destroy,
    NPC_IsValid: w.NPC_IsValid,
    NPC_Spawn: w.NPC_Spawn,
    NPC_Respawn: w.NPC_Respawn,
    NPC_SetPos: w.NPC_SetPos,
    NPC_SetRot: w.NPC_SetRot,
    NPC_GetRot: w.NPC_GetRot,
    NPC_SetFacingAngle: w.NPC_SetFacingAngle,
    NPC_GetFacingAngle: w.NPC_GetFacingAngle,
    NPC_SetVirtualWorld: w.NPC_SetVirtualWorld,
    NPC_GetVirtualWorld: w.NPC_GetVirtualWorld,
    NPC_Move: w.NPC_Move,
    NPC_MoveToPlayer: w.NPC_MoveToPlayer,
    NPC_StopMove: w.NPC_StopMove,
    NPC_IsMoving: w.NPC_IsMoving,
    NPC_IsMovingToPlayer: w.NPC_IsMovingToPlayer,
    NPC_SetSkin: w.NPC_SetSkin,
    NPC_GetSkin: w.NPC_GetSkin,
    NPC_IsStreamedIn: w.NPC_IsStreamedIn,
    NPC_IsAnyStreamedIn: w.NPC_IsAnyStreamedIn,
    NPC_SetInterior: w.NPC_SetInterior,
    NPC_GetInterior: w.NPC_GetInterior,
    NPC_SetHealth: w.NPC_SetHealth,
    NPC_GetHealth: w.NPC_GetHealth,
    NPC_SetArmour: w.NPC_SetArmour,
    NPC_GetArmour: w.NPC_GetArmour,
    NPC_IsDead: w.NPC_IsDead,
    NPC_ApplyAnimation: w.NPC_ApplyAnimation,
    NPC_SetWeapon: w.NPC_SetWeapon,
    NPC_GetWeapon: w.NPC_GetWeapon,
    NPC_SetAmmo: w.NPC_SetAmmo,
    NPC_GetAmmo: w.NPC_GetAmmo,
    NPC_SetKeys: w.NPC_SetKeys,
    NPC_GetKeys: w.NPC_GetKeys,
    NPC_SetWeaponSkillLevel: w.NPC_SetWeaponSkillLevel,
    NPC_GetWeaponSkillLevel: w.NPC_GetWeaponSkillLevel,
    NPC_MeleeAttack: w.NPC_MeleeAttack,
    NPC_StopMeleeAttack: w.NPC_StopMeleeAttack,
    NPC_IsMeleeAttacking: w.NPC_IsMeleeAttacking,
    NPC_SetFightingStyle: w.NPC_SetFightingStyle,
    NPC_GetFightingStyle: w.NPC_GetFightingStyle,
    NPC_EnableReloading: w.NPC_EnableReloading,
    NPC_IsReloadEnabled: w.NPC_IsReloadEnabled,
    NPC_IsReloading: w.NPC_IsReloading,
    NPC_EnableInfiniteAmmo: w.NPC_EnableInfiniteAmmo,
    NPC_IsInfiniteAmmoEnabled: w.NPC_IsInfiniteAmmoEnabled,
    NPC_SetWeaponState: w.NPC_SetWeaponState,
    NPC_GetWeaponState: w.NPC_GetWeaponState,
    NPC_SetAmmoInClip: w.NPC_SetAmmoInClip,
    NPC_GetAmmoInClip: w.NPC_GetAmmoInClip,
    NPC_Shoot: w.NPC_Shoot,
    NPC_IsShooting: w.NPC_IsShooting,
    NPC_AimAt: w.NPC_AimAt,
    NPC_AimAtPlayer: w.NPC_AimAtPlayer,
    NPC_StopAim: w.NPC_StopAim,
    NPC_IsAiming: w.NPC_IsAiming,
    NPC_IsAimingAtPlayer: w.NPC_IsAimingAtPlayer,
    NPC_SetWeaponAccuracy: w.NPC_SetWeaponAccuracy,
    NPC_GetWeaponAccuracy: w.NPC_GetWeaponAccuracy,
    NPC_SetWeaponReloadTime: w.NPC_SetWeaponReloadTime,
    NPC_GetWeaponReloadTime: w.NPC_GetWeaponReloadTime,
    NPC_GetWeaponActualReloadTime: w.NPC_GetWeaponActualReloadTime,
    NPC_SetWeaponShootTime: w.NPC_SetWeaponShootTime,
    NPC_GetWeaponShootTime: w.NPC_GetWeaponShootTime,
    NPC_SetWeaponClipSize: w.NPC_SetWeaponClipSize,
    NPC_GetWeaponClipSize: w.NPC_GetWeaponClipSize,
    NPC_GetWeaponActualClipSize: w.NPC_GetWeaponActualClipSize,
    NPC_EnterVehicle: w.NPC_EnterVehicle,
    NPC_ExitVehicle: w.NPC_ExitVehicle,
    NPC_PutInVehicle: w.NPC_PutInVehicle,
    NPC_RemoveFromVehicle: w.NPC_RemoveFromVehicle,
    NPC_GetVehicle: w.NPC_GetVehicle,
    NPC_GetVehicleSeat: w.NPC_GetVehicleSeat,
    NPC_GetEnteringVehicle: w.NPC_GetEnteringVehicle,
    NPC_GetEnteringVehicleSeat: w.NPC_GetEnteringVehicleSeat,
    NPC_IsEnteringVehicle: w.NPC_IsEnteringVehicle,
    NPC_UseVehicleSiren: w.NPC_UseVehicleSiren,
    NPC_IsVehicleSirenUsed: w.NPC_IsVehicleSirenUsed,
    NPC_SetVehicleHealth: w.NPC_SetVehicleHealth,
    NPC_GetVehicleHealth: w.NPC_GetVehicleHealth,
    NPC_SetVehicleHydraThrusters: w.NPC_SetVehicleHydraThrusters,
    NPC_GetVehicleHydraThrusters: w.NPC_GetVehicleHydraThrusters,
    NPC_SetVehicleGearState: w.NPC_SetVehicleGearState,
    NPC_GetVehicleGearState: w.NPC_GetVehicleGearState,
    NPC_SetVehicleTrainSpeed: w.NPC_SetVehicleTrainSpeed,
    NPC_GetVehicleTrainSpeed: w.NPC_GetVehicleTrainSpeed,
    NPC_ResetAnimation: w.NPC_ResetAnimation,
    NPC_SetAnimation: w.NPC_SetAnimation,
    NPC_GetAnimation: w.NPC_GetAnimation,
    NPC_ClearAnimations: w.NPC_ClearAnimations,
    NPC_SetSpecialAction: w.NPC_SetSpecialAction,
    NPC_GetSpecialAction: w.NPC_GetSpecialAction,
    NPC_StartPlayback: w.NPC_StartPlayback,
    NPC_StartPlaybackEx: w.NPC_StartPlaybackEx,
    NPC_StopPlayback: w.NPC_StopPlayback,
    NPC_PausePlayback: w.NPC_PausePlayback,
    NPC_IsPlayingPlayback: w.NPC_IsPlayingPlayback,
    NPC_IsPlaybackPaused: w.NPC_IsPlaybackPaused,
    NPC_PlayNode: w.NPC_PlayNode,
    NPC_StopPlayingNode: w.NPC_StopPlayingNode,
    NPC_PausePlayingNode: w.NPC_PausePlayingNode,
    NPC_ResumePlayingNode: w.NPC_ResumePlayingNode,
    NPC_IsPlayingNodePaused: w.NPC_IsPlayingNodePaused,
    NPC_IsPlayingNode: w.NPC_IsPlayingNode,
    NPC_ChangeNode: w.NPC_ChangeNode,
    NPC_UpdateNodePoint: w.NPC_UpdateNodePoint,
    NPC_SetInvulnerable: w.NPC_SetInvulnerable,
    NPC_IsInvulnerable: w.NPC_IsInvulnerable,
    NPC_SetSurfingOffsets: w.NPC_SetSurfingOffsets,
    NPC_GetSurfingOffsets: w.NPC_GetSurfingOffsets,
    NPC_SetSurfingVehicle: w.NPC_SetSurfingVehicle,
    NPC_GetSurfingVehicle: w.NPC_GetSurfingVehicle,
    NPC_SetSurfingObject: w.NPC_SetSurfingObject,
    NPC_GetSurfingObject: w.NPC_GetSurfingObject,
    NPC_SetSurfingPlayerObject: w.NPC_SetSurfingPlayerObject,
    NPC_GetSurfingPlayerObject: w.NPC_GetSurfingPlayerObject,
    NPC_ResetSurfingData: w.NPC_ResetSurfingData,
    NPC_IsSpawned: w.NPC_IsSpawned,
    NPC_Kill: w.NPC_Kill,
    NPC_SetVelocity: w.NPC_SetVelocity,
    NPC_GetVelocity: w.NPC_GetVelocity,
    NPC_GetPlayerAimingAt: w.NPC_GetPlayerAimingAt,
    NPC_GetPlayerMovingTo: w.NPC_GetPlayerMovingTo,

    StartRecordingPlayerData: w.StartRecordingPlayerData,
    StopRecordingPlayerData: w.StopRecordingPlayerData,
  };
}
