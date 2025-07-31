import * as w from "core/wrapper/native";
import type { RecordTypesEnum } from "../../enums";
import { ERecordStatus, InvalidEnum } from "../../enums";
import type { Player } from "../player";
import {
  BulletHitTypesEnum,
  FightingStylesEnum,
  WeaponEnum,
  WeaponSkillsEnum,
  WeaponStatesEnum,
} from "core/enums";
import { Vehicle } from "../vehicle";
import { npcPool } from "core/utils/pools";
import { INTERNAL_FLAGS } from "core/utils/flags";

export class Npc {
  private id = InvalidEnum.PLAYER_ID;
  private name = "";
  private static recordStatus: ERecordStatus;

  constructor(name: string) {
    const id: number = samp.callNative("NPC_Create", "s", name);
    this.id = id;
    this.name = name;
    if (id !== InvalidEnum.PLAYER_ID) {
      const instance = Npc.getInstance(id);
      if (instance) {
        return instance;
      }
    }
    npcPool.set(id, this);
    return this;
  }
  getName() {
    return this.name;
  }
  destroy() {
    if (!INTERNAL_FLAGS.skip) {
      samp.callNative("NPC_Destroy", "i", this.id);
    }
    return this;
  }
  isValid() {
    if (INTERNAL_FLAGS.skip && this.id !== -1) return true;
    return Npc.isValid(this.id);
  }
  spawn() {
    samp.callNative("NPC_Spawn", "i", this.id);
    return this;
  }
  respawn() {
    samp.callNative("NPC_Respawn", "i", this.id);
    return this;
  }
  setPos(x: number, y: number, z: number) {
    samp.callNative("NPC_SetPos", "ifff", this.id, x, y, z);
    return this;
  }
  setRot(rX: number, rY: number, rZ: number) {
    samp.callNative("NPC_SetRot", "ifff", this.id, rX, rY, rZ);
    return this;
  }
  getRot() {
    const [rX, rY, rZ]: [number, number, number] = samp.callNative(
      "NPC_GetRot",
      "iFFF",
      this.id,
    );
    return { rX, rY, rZ };
  }
  setFacingAngle(angle: number) {
    samp.callNative("NPC_SetFacingAngle", "if", this.id, angle);
    return this;
  }
  getFacingAngle() {
    const [angle]: [number] = samp.callNative(
      "NPC_GetFacingAngle",
      "iF",
      this.id,
    );
    return angle;
  }
  setVirtualWorld(virtualWorld: number) {
    samp.callNative("NPC_SetVirtualWorld", "ii", this.id, virtualWorld);
    return this;
  }
  getVirtualWorld() {
    const [virtualWorld]: [number] = samp.callNative(
      "NPC_GetVirtualWorld",
      "iI",
      this.id,
    );
    return virtualWorld;
  }
  move(
    targetPosX: number,
    targetPosY: number,
    targetPosZ: number,
    moveType: number,
    moveSpeed = -1.0,
  ) {
    return !!samp.callNative(
      "NPC_Move",
      "ifffif",
      this.id,
      targetPosX,
      targetPosY,
      targetPosZ,
      moveType,
      moveSpeed,
    );
  }
  moveToPlayer(player: Player, moveType: number, moveSpeed = -1.0) {
    return !!samp.callNative(
      "NPC_MoveToPlayer",
      "iiif",
      this.id,
      player.id,
      moveType,
      moveSpeed,
    );
  }
  stopMove() {
    samp.callNative("NPC_StopMove", "i", this.id);
    return this;
  }
  isMoving() {
    return !!samp.callNative("NPC_IsMoving", "ifffif", this.id);
  }
  setSkin(model: number) {
    samp.callNative("NPC_SetSkin", "ii", this.id, model);
    return this;
  }
  isStreamedIn(player: Player) {
    return !!samp.callNative("NPC_IsStreamedIn", "ii", this.id, player.id);
  }
  isAnyStreamedIn() {
    return !!samp.callNative("NPC_IsAnyStreamedIn", "i", this.id);
  }
  setInterior(interior: number) {
    samp.callNative("NPC_SetInterior", "ii", this.id, interior);
    return this;
  }
  getInterior() {
    return samp.callNative("NPC_GetInterior", "i", this.id) as number;
  }
  setHealth(health: number) {
    samp.callNative("NPC_SetHealth", "if", this.id, health);
    return this;
  }
  getHealth() {
    return samp.callNativeFloat("NPC_GetHealth", "i", this.id) as number;
  }
  setArmour(armour: number) {
    samp.callNative("NPC_SetArmour", "if", this.id, armour);
    return this;
  }
  getArmour() {
    return samp.callNativeFloat("NPC_GetArmour", "i", this.id) as number;
  }
  isDead() {
    return !!samp.callNative("NPC_IsDead", "i", this.id);
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
      this.id,
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
    samp.callNative("NPC_SetWeapon", "ii", this.id, weapon);
    return this;
  }
  getWeapon() {
    return samp.callNative("NPC_GetWeapon", "i", this.id) as WeaponEnum;
  }
  setAmmo(ammo: number) {
    samp.callNative("NPC_SetAmmo", "ii", this.id, ammo);
    return this;
  }
  getAmmo() {
    return samp.callNative("NPC_GetAmmo", "ii", this.id) as number;
  }
  setKeys(upAndDown: number, leftAndDown: number, keys: number) {
    samp.callNative("NPC_SetKeys", "iiii", upAndDown, leftAndDown, keys);
    return this;
  }
  getKeys() {
    const [upAndDown, leftAndDown, keys]: [number, number, number] =
      samp.callNative("NPC_GetKeys", "iIII", this.id);
    return { upAndDown, leftAndDown, keys };
  }
  setWeaponSkillLevel(skill: WeaponSkillsEnum, level: number) {
    samp.callNative("NPC_SetWeaponSkillLevel", "iii", this.id, skill, level);
    return this;
  }
  getWeaponSkillLevel(skill: WeaponSkillsEnum) {
    return samp.callNative(
      "NPC_GetWeaponSkillLevel",
      "ii",
      this.id,
      skill,
    ) as number;
  }
  meleeAttack(time: number, secondaryAttack: boolean) {
    samp.callNative("NPC_MeleeAttack", "iii", this.id, time, secondaryAttack);
    return this;
  }
  stopMeleeAttack() {
    samp.callNative("NPC_StopMeleeAttack", "i", this.id);
    return this;
  }
  isMeleeAttacking() {
    return !!samp.callNative("NPC_IsMeleeAttacking", "i", this.id);
  }
  setFightingStyle(style: FightingStylesEnum) {
    samp.callNative("NPC_SetFightingStyle", "ii", this.id, style);
    return this;
  }
  getFightingStyle() {
    return samp.callNative(
      "NPC_GetFightingStyle",
      "i",
      this.id,
    ) as FightingStylesEnum;
  }
  enableReloading(enable: boolean) {
    samp.callNative("NPC_EnableReloading", "ii", this.id, enable);
    return this;
  }
  isReloadEnabled() {
    return !!samp.callNative("NPC_IsReloadEnabled", "i", this.id);
  }
  isReloading() {
    return !!samp.callNative("NPC_IsReloading", "i", this.id);
  }
  enableInfiniteAmmo(enable: boolean) {
    samp.callNative("NPC_EnableInfiniteAmmo", "ii", this.id, enable);
    return this;
  }
  isInfiniteAmmoEnabled() {
    return !!samp.callNative("NPC_IsInfiniteAmmoEnabled", "i", this.id);
  }
  getWeaponState() {
    return samp.callNative(
      "NPC_GetWeaponState",
      "i",
      this.id,
    ) as WeaponStatesEnum;
  }
  setAmmoInClip(ammo: number) {
    samp.callNative("NPC_SetAmmoInClip", "ii", this.id, ammo);
    return this;
  }
  getAmmoInClip() {
    return samp.callNative("NPC_GetAmmoInClip", "i", this.id) as number;
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
    checkInBetweenFlags: number,
  ) {
    samp.callNative(
      "NPC_Shoot",
      "iiiffffffii",
      this.id,
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
    return !!samp.callNative("NPC_IsShooting", "i", this.id);
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
    checkInBetweenFlags: number,
  ) {
    samp.callNative(
      "NPC_AimAt",
      "ifffiiifffi",
      this.id,
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
    checkInBetweenFlags: number,
  ) {
    samp.callNative(
      "NPC_AimAtPlayer",
      "iiiiiffffffi",
      this.id,
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
    samp.callNative("NPC_StopAim", "i", this.id);
    return this;
  }
  isAiming() {
    return !!samp.callNative("NPC_IsAiming", "i", this.id);
  }
  isAimingAtPlayer(player: Player) {
    return !!samp.callNative("NPC_IsAimingAtPlayer", "ii", this.id, player.id);
  }
  setWeaponAccuracy(weapon: WeaponEnum, accuracy: number) {
    samp.callNative("NPC_SetWeaponAccuracy", "iif", this.id, weapon, accuracy);
    return this;
  }
  getWeaponAccuracy(weapon: number) {
    return samp.callNativeFloat(
      "NPC_GetWeaponAccuracy",
      "ii",
      this.id,
      weapon,
    ) as number;
  }
  enterVehicle(vehicle: Vehicle, seatId: number, moveType: number) {
    samp.callNative(
      "NPC_EnterVehicle",
      "iiii",
      this.id,
      vehicle,
      seatId,
      moveType,
    );
    return this;
  }
  exitVehicle() {
    samp.callNative("NPC_ExitVehicle", "i", this.id);
    return this;
  }
  static readonly connect = w.ConnectNPC;
  static startRecordingPlayerData(
    player: Player,
    recordtype: RecordTypesEnum,
    recordname: string,
  ): void {
    if (player.isRecording)
      throw new Error("[NpcFunc]: It should be stopped before recording");
    w.StartRecordingPlayerData(player.id, recordtype, recordname);
    player.isRecording = true;
  }
  static stopRecordingPlayerData(player: Player): void {
    if (!player.isRecording)
      throw new Error("[NpcFunc]: It should be started before stop");
    w.StopRecordingPlayerData(player.id);
    player.isRecording = false;
  }
  static startRecordingPlayback(
    playbacktype: RecordTypesEnum,
    recordname: string,
  ): void {
    if (Npc.recordStatus >= ERecordStatus.start)
      throw new Error("[NpcFunc]: The current status cannot be replayed");
    w.StartRecordingPlayback(playbacktype, recordname);
    Npc.recordStatus = ERecordStatus.start;
  }
  static stopRecordingPlayback(): void {
    if (Npc.recordStatus < ERecordStatus.start)
      throw new Error("[NpcFunc]: The current status cannot be stopped");
    w.StopRecordingPlayback();
    Npc.recordStatus = ERecordStatus.none;
  }

  static pauseRecordingPlayback() {
    if (Npc.recordStatus !== ERecordStatus.start)
      throw new Error("[NpcFunc]: The current status cannot be paused");
    w.PauseRecordingPlayback();
    Npc.recordStatus = ERecordStatus.pause;
  }
  static resumeRecordingPlayback() {
    if (Npc.recordStatus !== ERecordStatus.pause)
      throw new Error("[NpcFunc]: The current status cannot be paused");
    w.ResumeRecordingPlayback();
    Npc.recordStatus = ERecordStatus.start;
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
