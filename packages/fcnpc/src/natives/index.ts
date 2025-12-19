import type {
  BulletHitTypesEnum,
  DynamicObject,
  FightingStylesEnum,
  KeysEnum,
  Player,
  SpecialActionsEnum,
  Vehicle,
  WeaponEnum,
  WeaponSkillsEnum,
  WeaponStatesEnum,
} from "@infernus/core";
import { LandingGearStateEnum } from "@infernus/core";
import {
  EntityCheck,
  EntityMode,
  MoveMode,
  MovePathFinding,
  MoveSpeed,
  MoveType,
} from "../enums";
import { FCNPCInstances } from "../pools";
import { INVALID_RECORD_ID } from "../constants";
import type { FCNPCNode } from "./node";
import type { FCNPCMovePath } from "./movePath";

export * from "./movePath";
export * from "./node";

export class FCNPC {
  id: number = -1;
  constructor(public readonly name: string) {}

  create() {
    this.id = samp.callNative("FCNPC_Create", "s", this.name);
    return this;
  }

  destroy(): number {
    const ret = samp.callNative("FCNPC_Destroy", "i", this.id);
    this.id = -1;
    return ret;
  }

  spawn(skinId: number, x: number, y: number, z: number): number {
    return samp.callNative("FCNPC_Spawn", "iifff", this.id, skinId, x, y, z);
  }

  respawn(): number {
    return samp.callNative("FCNPC_Respawn", "i", this.id);
  }

  isSpawned() {
    const ret = samp.callNative("FCNPC_IsSpawned", "i", this.id);
    return !!ret;
  }

  kill(): number {
    return samp.callNative("FCNPC_Kill", "i", this.id);
  }

  isDead() {
    const ret = samp.callNative("FCNPC_IsDead", "i", this.id);
    return !!ret;
  }

  isValid() {
    const ret = samp.callNative("FCNPC_IsValid", "i", this.id);
    return !!ret;
  }

  isStreamedIn(forPlayer: Player) {
    const ret = samp.callNative(
      "FCNPC_IsStreamedIn",
      "ii",
      this.id,
      forPlayer.id,
    );
    return !!ret;
  }

  isStreamedInForAnyone() {
    const ret = samp.callNative("FCNPC_IsStreamedInForAnyone", "i", this.id);
    return !!ret;
  }

  static getValidArray() {
    return this.getInstances().filter((npc) => npc.isValid());
  }

  setPosition(x: number, y: number, z: number): number {
    return samp.callNative("FCNPC_SetPosition", "ifff", this.id, x, y, z);
  }
  givePosition(x: number, y: number, z: number): number {
    return samp.callNative("FCNPC_GivePosition", "ifff", this.id, x, y, z);
  }
  getPosition() {
    const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
      "FCNPC_GetPosition",
      "iFFF",
      this.id,
    );
    return { x, y, z, ret };
  }
  setAngle(angle: number): number {
    return samp.callNative("FCNPC_SetAngle", "if", this.id, angle);
  }
  giveAngle(angle: number): number {
    return samp.callNativeFloat("FCNPC_GiveAngle", "if", this.id, angle);
  }
  setAngleToPos(x: number, y: number): number {
    return samp.callNative("FCNPC_SetAngleToPos", "iff", this.id, x, y);
  }
  setAngleToPlayer(player: Player): number {
    return samp.callNative("FCNPC_SetAngleToPlayer", "ii", this.id, player.id);
  }
  getAngle(): number {
    return samp.callNativeFloat("FCNPC_GetAngle", "i", this.id);
  }
  setQuaternion(w: number, x: number, y: number, z: number): number {
    return samp.callNative("FCNPC_SetQuaternion", "iffff", this.id, w, x, y, z);
  }
  giveQuaternion(w: number, x: number, y: number, z: number): number {
    return samp.callNative(
      "FCNPC_GiveQuaternion",
      "iffff",
      this.id,
      w,
      x,
      y,
      z,
    );
  }
  getQuaternion() {
    const [w, x, y, z, ret]: [number, number, number, number, number] =
      samp.callNative("FCNPC_GetQuaternion", "iFFFF", this.id);
    return { w, x, y, z, ret };
  }
  setVelocity(x: number, y: number, z: number, updatePos = false): number {
    return samp.callNative(
      "FCNPC_SetVelocity",
      "ifffi",
      this.id,
      x,
      y,
      z,
      updatePos,
    );
  }
  giveVelocity(x: number, y: number, z: number, updatePos = false): number {
    return samp.callNative(
      "FCNPC_GiveVelocity",
      "ifffi",
      this.id,
      x,
      y,
      z,
      updatePos,
    );
  }
  getVelocity() {
    const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
      "FCNPC_GetVelocity",
      "iFFF",
      this.id,
    );
    return { x, y, z, ret };
  }
  setSpeed(speed: number): number {
    return samp.callNative("FCNPC_SetSpeed", "if", this.id, speed);
  }
  getSpeed(): number {
    return samp.callNativeFloat("FCNPC_GetSpeed", "i", this.id);
  }
  setInterior(interiorId: number): number {
    return samp.callNative("FCNPC_SetInterior", "ii", this.id, interiorId);
  }
  getInterior(): number {
    return samp.callNative("FCNPC_GetInterior", "i", this.id);
  }
  setVirtualWorld(worldId: number): number {
    return samp.callNative("FCNPC_SetVirtualWorld", "ii", this.id, worldId);
  }
  getVirtualWorld(): number {
    return samp.callNative("FCNPC_GetVirtualWorld", "i", this.id);
  }
  setHealth(health: number): number {
    return samp.callNative("FCNPC_SetHealth", "if", this.id, health);
  }
  giveHealth(health: number): number {
    return samp.callNativeFloat("FCNPC_GiveHealth", "if", this.id, health);
  }
  getHealth(): number {
    return samp.callNativeFloat("FCNPC_GetHealth", "i", this.id);
  }
  setArmour(armour: number): number {
    return samp.callNative("FCNPC_SetArmour", "if", this.id, armour);
  }
  giveArmour(armour: number): number {
    return samp.callNativeFloat("FCNPC_GiveArmour", "if", this.id, armour);
  }
  getArmour(): number {
    return samp.callNativeFloat("FCNPC_GetArmour", "i", this.id);
  }
  setInvulnerable(bool: boolean): number {
    return samp.callNative("FCNPC_SetInvulnerable", "ii", this.id, bool);
  }
  isInvulnerable() {
    const ret = samp.callNative("FCNPC_IsInvulnerable", "i", this.id);
    return !!ret;
  }
  setSkin(skinId: number): number {
    return samp.callNative("FCNPC_SetSkin", "ii", this.id, skinId);
  }
  getSkin(): number {
    return samp.callNative("FCNPC_GetSkin", "i", this.id);
  }
  getCustomSkin(): number {
    return samp.callNative("FCNPC_GetCustomSkin", "i", this.id);
  }
  setWeapon(weaponId: WeaponEnum): number {
    return samp.callNative("FCNPC_SetWeapon", "ii", this.id, weaponId);
  }
  getWeapon(): number {
    return samp.callNative("FCNPC_GetWeapon", "i", this.id);
  }
  setAmmo(ammo: number): number {
    return samp.callNative("FCNPC_SetAmmo", "ii", this.id, ammo);
  }
  giveAmmo(ammo: number): number {
    return samp.callNative("FCNPC_GiveAmmo", "ii", this.id, ammo);
  }
  getAmmo(): number {
    return samp.callNative("FCNPC_GetAmmo", "i", this.id);
  }
  setAmmoInClip(ammo: number): number {
    return samp.callNative("FCNPC_SetAmmoInClip", "ii", this.id, ammo);
  }
  giveAmmoInClip(ammo: number): number {
    return samp.callNative("FCNPC_GiveAmmoInClip", "ii", this.id, ammo);
  }
  getAmmoInClip(): number {
    return samp.callNative("FCNPC_GetAmmoInClip", "i", this.id);
  }
  setWeaponSkillLevel(skill: WeaponSkillsEnum, level: number): number {
    return samp.callNative(
      "FCNPC_SetWeaponSkillLevel",
      "iii",
      this.id,
      skill,
      level,
    );
  }
  giveWeaponSkillLevel(skill: WeaponSkillsEnum, level: number): number {
    return samp.callNative(
      "FCNPC_GiveWeaponSkillLevel",
      "iii",
      this.id,
      skill,
      level,
    );
  }
  getWeaponSkillLevel(skill: WeaponSkillsEnum): number {
    return samp.callNative("FCNPC_GetWeaponSkillLevel", "ii", this.id, skill);
  }
  setWeaponState(state: WeaponStatesEnum): number {
    return samp.callNative("FCNPC_SetWeaponState", "ii", this.id, state);
  }
  getWeaponState(): WeaponStatesEnum {
    return samp.callNative("FCNPC_GetWeaponState", "i", this.id);
  }
  setWeaponReloadTime(weaponId: WeaponEnum, time: number): number {
    return samp.callNative(
      "FCNPC_SetWeaponReloadTime",
      "iii",
      this.id,
      weaponId,
      time,
    );
  }
  getWeaponReloadTime(weaponId: WeaponEnum): number {
    return samp.callNative(
      "FCNPC_GetWeaponReloadTime",
      "ii",
      this.id,
      weaponId,
    );
  }
  getWeaponActualReloadTime(weaponId: WeaponEnum): number {
    return samp.callNative(
      "FCNPC_GetWeaponActualReloadTime",
      "ii",
      this.id,
      weaponId,
    );
  }
  setWeaponShootTime(weaponId: WeaponEnum, time: number): number {
    return samp.callNative(
      "FCNPC_SetWeaponShootTime",
      "iii",
      this.id,
      weaponId,
      time,
    );
  }
  getWeaponShootTime(weaponId: WeaponEnum): number {
    return samp.callNative("FCNPC_GetWeaponShootTime", "ii", this.id, weaponId);
  }
  setWeaponClipSize(weaponId: WeaponEnum, size: number): number {
    return samp.callNative(
      "FCNPC_SetWeaponClipSize",
      "iii",
      this.id,
      weaponId,
      size,
    );
  }
  getWeaponClipSize(weaponId: WeaponEnum): number {
    return samp.callNative("FCNPC_GetWeaponClipSize", "ii", this.id, weaponId);
  }
  getWeaponActualClipSize(weaponId: WeaponEnum): number {
    return samp.callNative(
      "FCNPC_GetWeaponActualClipSize",
      "ii",
      this.id,
      weaponId,
    );
  }
  setWeaponAccuracy(weaponId: WeaponEnum, accuracy: number): number {
    return samp.callNative(
      "FCNPC_SetWeaponAccuracy",
      "iif",
      this.id,
      weaponId,
      accuracy,
    );
  }
  getWeaponAccuracy(weaponId: WeaponEnum): number {
    return samp.callNativeFloat(
      "FCNPC_GetWeaponAccuracy",
      "ii",
      this.id,
      weaponId,
    );
  }
  setWeaponInfo(
    weaponId: WeaponEnum,
    reloadTime: number,
    shootTime: number,
    clipSize: number,
    accuracy: number,
  ): number {
    return samp.callNative(
      "FCNPC_SetWeaponInfo",
      "iiiiif",
      this.id,
      weaponId,
      reloadTime,
      shootTime,
      clipSize,
      accuracy,
    );
  }
  getWeaponInfo(weaponId: WeaponEnum) {
    // eslint-disable-next-line prefer-const
    let [reloadTime, shootTime, clipSize, accuracy, ret]: [
      number,
      number,
      number,
      number,
      number,
    ] = samp.callNative("FCNPC_GetWeaponInfo", "iiIIIF", this.id, weaponId);
    if (ret === 0) {
      reloadTime = -1;
      shootTime = -1;
      clipSize = -1;
      accuracy = 1.0;
    }
    return { reloadTime, shootTime, clipSize, accuracy, ret };
  }
  static setWeaponDefaultInfo(
    weaponId: WeaponEnum,
    reloadTime: number,
    shootTime: number,
    clipSize: number,
    accuracy: number,
  ): number {
    return samp.callNative(
      "FCNPC_SetWeaponDefaultInfo",
      "iiiif",
      weaponId,
      reloadTime,
      shootTime,
      clipSize,
      accuracy,
    );
  }
  static getWeaponDefaultInfo(weaponId: WeaponEnum) {
    // eslint-disable-next-line prefer-const
    let [reloadTime, shootTime, clipSize, accuracy, ret]: [
      number,
      number,
      number,
      number,
      number,
    ] = samp.callNative("FCNPC_GetWeaponDefaultInfo", "iIIIF", weaponId);

    if (ret === 0) {
      reloadTime = -1;
      shootTime = -1;
      clipSize = -1;
      accuracy = 1.0;
    }
    return { reloadTime, shootTime, clipSize, accuracy, ret };
  }
  setKeys(
    upDownAnalog: number,
    leftRightAnalog: number,
    keys: KeysEnum,
  ): number {
    return samp.callNative(
      "FCNPC_SetKeys",
      "iiii",
      this.id,
      upDownAnalog,
      leftRightAnalog,
      keys,
    );
  }
  getKeys() {
    const [upDownAnalog, leftRightAnalog, keys, ret]: [
      number,
      number,
      number,
      number,
    ] = samp.callNative("FCNPC_GetKeys", "iIII", this.id);
    return { upDownAnalog, leftRightAnalog, keys, ret };
  }
  setSpecialAction(action: SpecialActionsEnum): number {
    return samp.callNative("FCNPC_SetSpecialAction", "ii", this.id, action);
  }
  getSpecialAction(): SpecialActionsEnum {
    return samp.callNative("FCNPC_GetSpecialAction", "i", this.id);
  }
  setAnimation(
    animationId: number,
    delta: number = 4.1,
    loop: number = 0,
    lockX: number = 1,
    lockY: number = 1,
    freeze: number = 0,
    time: number = 1,
  ): number {
    return samp.callNative(
      "FCNPC_SetAnimation",
      "iifiiiii",
      this.id,
      animationId,
      delta,
      loop,
      lockX,
      lockY,
      freeze,
      time,
    );
  }
  setAnimationByName(
    animationName: string,
    delta: number = 4.1,
    loop: number = 0,
    lockX: number = 1,
    lockY: number = 1,
    freeze: number = 0,
    time: number = 1,
  ): number {
    return samp.callNative(
      "FCNPC_SetAnimationByName",
      "isfiiiii",
      this.id,
      animationName,
      delta,
      loop,
      lockX,
      lockY,
      freeze,
      time,
    );
  }
  resetAnimation(): number {
    return samp.callNative("FCNPC_ResetAnimation", "i", this.id);
  }
  getAnimation() {
    // eslint-disable-next-line prefer-const
    let [animationId, delta, loop, lockX, lockY, freeze, time, ret]: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ] = samp.callNative("FCNPC_GetAnimation", "iIFIIIII", this.id);
    if (ret === 0) {
      animationId = 0;
      delta = 4.1;
      loop = 0;
      lockX = 1;
      lockY = 1;
      freeze = 0;
      time = 1;
    }
    return { animationId, delta, loop, lockX, lockY, freeze, time, ret };
  }
  applyAnimation(
    animationId: number,
    delta: number = 4.1,
    loop: number = 0,
    lockX: number = 1,
    lockY: number = 1,
    freeze: number = 0,
    time: number = 1,
  ): number {
    return samp.callNative(
      "FCNPC_ApplyAnimation",
      "iifiiiii",
      this.id,
      animationId,
      delta,
      loop,
      lockX,
      lockY,
      freeze,
      time,
    );
  }
  clearAnimations(): number {
    return samp.callNative("FCNPC_ClearAnimations", "i", this.id);
  }
  setFightingStyle(style: FightingStylesEnum): number {
    return samp.callNative("FCNPC_SetFightingStyle", "ii", this.id, style);
  }
  getFightingStyle(): FightingStylesEnum {
    return samp.callNative("FCNPC_GetFightingStyle", "i", this.id);
  }
  useReloading(bool: boolean): number {
    return samp.callNative("FCNPC_UseReloading", "ii", this.id, bool);
  }
  isReloadingUsed(): boolean {
    return !!samp.callNative("FCNPC_IsReloadingUsed", "i", this.id);
  }
  useInfiniteAmmo(bool: boolean): number {
    return samp.callNative("FCNPC_UseInfiniteAmmo", "ii", this.id, bool);
  }
  isInfiniteAmmoUsed(): boolean {
    return !!samp.callNative("FCNPC_IsInfiniteAmmoUsed", "i", this.id);
  }
  goto(
    x: number,
    y: number,
    z: number,
    type: MoveType = MoveType.AUTO,
    speed: number = MoveSpeed.AUTO,
    mode: MoveMode = MoveMode.AUTO,
    pathFinding: MovePathFinding = MovePathFinding.AUTO,
    radius: number = 0.0,
    setAngle: boolean = true,
    minDistance: number = 0.0,
    stopDelay: number = 250,
  ): number {
    return samp.callNative(
      "FCNPC_Goto",
      "ifffifiififi",
      this.id,
      x,
      y,
      z,
      type,
      speed,
      mode,
      pathFinding,
      radius,
      setAngle,
      minDistance,
      stopDelay,
    );
  }
  gotoPlayer(
    player: Player,
    type: MoveType = MoveType.AUTO,
    speed: number = MoveSpeed.AUTO,
    mode: MoveMode = MoveMode.AUTO,
    pathFinding: MovePathFinding = MovePathFinding.AUTO,
    radius: number = 0.0,
    setAngle: boolean = true,
    minDistance: number = 0.0,
    stopDelay: number = 250,
  ) {
    return samp.callNative(
      "FCNPC_GotoPlayer",
      "iiifiififi",
      this.id,
      player.id,
      type,
      speed,
      mode,
      pathFinding,
      radius,
      setAngle,
      minDistance,
      stopDelay,
    );
  }
  stop(): number {
    return samp.callNative("FCNPC_Stop", "i", this.id);
  }
  isMoving(): boolean {
    return !!samp.callNative("FCNPC_IsMoving", "i", this.id);
  }
  isMovingAtPlayer(player: Player): boolean {
    return !!samp.callNative(
      "FCNPC_IsMovingAtPlayer",
      "ii",
      this.id,
      player.id,
    );
  }
  getDestination() {
    const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
      "FCNPC_GetDestination",
      "iFFF",
      this.id,
    );
    return { x, y, z, ret };
  }

  aimAt(
    x: number,
    y: number,
    z: number,
    shoot: boolean = false,
    shootDelay: number = -1,
    setAngle: boolean = true,
    offsetFromX: number = 0.0,
    offsetFromY: number = 0.0,
    offsetFromZ: number = 0.0,
    betweenCheckMode: EntityMode = EntityMode.AUTO,
    betweenCheckFlags: EntityCheck = EntityCheck.ALL,
  ): number {
    return samp.callNative(
      "FCNPC_AimAt",
      "ifffiiifffii",
      this.id,
      x,
      y,
      z,
      shoot,
      shootDelay,
      setAngle,
      offsetFromX,
      offsetFromY,
      offsetFromZ,
      betweenCheckMode,
      betweenCheckFlags,
    );
  }

  aimAtPlayer(
    player: Player,
    shoot: boolean = false,
    shootDelay: number = -1,
    setAngle: boolean = true,
    offsetX: number = 0.0,
    offsetY: number = 0.0,
    offsetZ: number = 0.0,
    offsetFromX: number = 0.0,
    offsetFromY: number = 0.0,
    offsetFromZ: number = 0.0,
    betweenCheckMode: EntityMode = EntityMode.AUTO,
    betweenCheckFlags: EntityCheck = EntityCheck.ALL,
  ): number {
    return samp.callNative(
      "FCNPC_AimAtPlayer",
      "iiiiiffffffii",
      this.id,
      player.id,
      shoot,
      shootDelay,
      setAngle,
      offsetX,
      offsetY,
      offsetZ,
      offsetFromX,
      offsetFromY,
      offsetFromZ,
      betweenCheckMode,
      betweenCheckFlags,
    );
  }

  stopAim(): number {
    return samp.callNative("FCNPC_StopAim", "i", this.id);
  }
  meleeAttack(delay = -1, fightingStyle = false): number {
    return samp.callNative(
      "FCNPC_MeleeAttack",
      "iii",
      this.id,
      delay,
      fightingStyle,
    );
  }
  stopAttack(): number {
    return samp.callNative("FCNPC_StopAttack", "i", this.id);
  }
  isAttacking(): boolean {
    return !!samp.callNative("FCNPC_IsAttacking", "i", this.id);
  }
  isAiming(): boolean {
    return !!samp.callNative("FCNPC_IsAiming", "i", this.id);
  }
  isAimingAtPlayer(player: Player): boolean {
    return !!samp.callNative(
      "FCNPC_IsAimingAtPlayer",
      "ii",
      this.id,
      player.id,
    );
  }
  getAimingPlayer(): number {
    return samp.callNative("FCNPC_GetAimingPlayer", "i", this.id);
  }
  isShooting(): boolean {
    return !!samp.callNative("FCNPC_IsShooting", "i", this.id);
  }
  isReloading(): boolean {
    return !!samp.callNative("FCNPC_IsReloading", "i", this.id);
  }
  triggerWeaponShot(
    weapon: WeaponEnum,
    hitType: BulletHitTypesEnum,
    hitId: number,
    x: number,
    y: number,
    z: number,
    isHit: boolean = true,
    offsetFromX: number = 0.0,
    offsetFromY: number = 0.0,
    offsetFromZ: number = 0.0,
    betweenCheckMode: EntityMode = EntityMode.AUTO,
    betweenCheckFlags: EntityCheck = EntityCheck.ALL,
  ): number {
    return samp.callNative(
      "FCNPC_TriggerWeaponShot",
      "iiiifffifffii",
      this.id,
      weapon,
      hitType,
      hitId,
      x,
      y,
      z,
      isHit,
      offsetFromX,
      offsetFromY,
      offsetFromZ,
      betweenCheckMode,
      betweenCheckFlags,
    );
  }
  getClosestEntityInBetween(
    x: number,
    y: number,
    z: number,
    range: number,
    mode: EntityMode = EntityMode.AUTO,
    flags: EntityCheck = EntityCheck.ALL,
    offsetFromX: number = 0.0,
    offsetFromY: number = 0.0,
    offsetFromZ: number = 0.0,
  ) {
    // eslint-disable-next-line prefer-const
    let [entityId, entityType, ownerId, pointX, pointY, pointZ, ret]: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ] = samp.callNative(
      "FCNPC_GetClosestEntityInBetween",
      "iffffiifffIIIFFF",
      this.id,
      x,
      y,
      z,
      range,
      mode,
      flags,
      offsetFromX,
      offsetFromY,
      offsetFromZ,
    );
    if (ret === 0) {
      entityId = -1;
      entityType = -1;
      ownerId = -1;
      pointX = 0.0;
      pointY = 0.0;
      pointZ = 0.0;
    }
    return {
      entityId,
      entityType,
      ownerId,
      pointX,
      pointY,
      pointZ,
    };
  }
  enterVehicle(
    vehicle: Vehicle,
    seatId: number,
    type: MoveType = MoveType.WALK,
  ): number {
    return samp.callNative(
      "FCNPC_EnterVehicle",
      "iiii",
      this.id,
      vehicle.id,
      seatId,
      type,
    );
  }
  exitVehicle(): number {
    return samp.callNative("FCNPC_ExitVehicle", "i", this.id);
  }
  putInVehicle(vehicle: Vehicle, seatId: number): number {
    return samp.callNative(
      "FCNPC_PutInVehicle",
      "iii",
      this.id,
      vehicle.id,
      seatId,
    );
  }
  removeFromVehicle(): number {
    return samp.callNative("FCNPC_RemoveFromVehicle", "i", this.id);
  }
  getVehicleId(): number {
    return samp.callNative("FCNPC_GetVehicleID", "i", this.id);
  }
  getVehicleSeat(): number {
    return samp.callNative("FCNPC_GetVehicleSeat", "i", this.id);
  }
  useVehicleSiren(use: boolean = true): number {
    return samp.callNative("FCNPC_UseVehicleSiren", "ii", this.id, use);
  }
  isVehicleSirenUsed(): boolean {
    return !!samp.callNative("FCNPC_IsVehicleSirenUsed", "i", this.id);
  }
  setVehicleHealth(health: number): number {
    return samp.callNative("FCNPC_SetVehicleHealth", "if", this.id, health);
  }
  getVehicleHealth(): number {
    return samp.callNativeFloat("FCNPC_GetVehicleHealth", "i", this.id);
  }
  setVehicleHydraThrusters(direction: number): number {
    return samp.callNative(
      "FCNPC_SetVehicleHydraThrusters",
      "ii",
      this.id,
      direction,
    );
  }
  getVehicleHydraThrusters(): number {
    return samp.callNative("FCNPC_GetVehicleHydraThrusters", "i", this.id);
  }
  setVehicleGearState(gearState: LandingGearStateEnum): number {
    return samp.callNative(
      "FCNPC_SetVehicleGearState",
      "ii",
      this.id,
      gearState,
    );
  }
  getVehicleGearState(): LandingGearStateEnum {
    return samp.callNative("FCNPC_GetVehicleGearState", "i", this.id);
  }
  setVehicleTrainSpeed(speed: number): number {
    return samp.callNative("FCNPC_SetVehicleTrainSpeed", "if", this.id, speed);
  }
  getVehicleTrainSpeed(): number {
    return samp.callNativeFloat("FCNPC_GetVehicleTrainSpeed", "i", this.id);
  }
  setSurfingOffsets(x: number, y: number, z: number): number {
    return samp.callNative("FCNPC_SetSurfingOffsets", "ifff", this.id, x, y, z);
  }
  giveSurfingOffsets(x: number, y: number, z: number): number {
    return samp.callNative(
      "FCNPC_GiveSurfingOffsets",
      "ifff",
      this.id,
      x,
      y,
      z,
    );
  }
  getSurfingOffsets() {
    const [x, y, z, ret]: [number, number, number, number] = samp.callNative(
      "FCNPC_GetSurfingOffsets",
      "iFFF",
      this.id,
    );
    return { x, y, z, ret };
  }
  setSurfingVehicle(vehicle: Vehicle): number {
    return samp.callNative(
      "FCNPC_SetSurfingVehicle",
      "ii",
      this.id,
      vehicle.id,
    );
  }
  getSurfingVehicle(): number {
    return samp.callNative("FCNPC_GetSurfingVehicle", "i", this.id);
  }

  setSurfingObject(objectId: number): number {
    return samp.callNative("FCNPC_SetSurfingObject", "ii", this.id, objectId);
  }
  getSurfingObject(): number {
    return samp.callNative("FCNPC_GetSurfingObject", "i", this.id);
  }
  setSurfingPlayerObject(objectId: number): number {
    return samp.callNative(
      "FCNPC_SetSurfingPlayerObject",
      "ii",
      this.id,
      objectId,
    );
  }
  getSurfingPlayerObject(): number {
    return samp.callNative("FCNPC_GetSurfingPlayerObject", "i", this.id);
  }
  setSurfingDynamicObject(object: DynamicObject): number {
    return samp.callNative(
      "FCNPC_SetSurfingDynamicObject",
      "ii",
      this.id,
      object.id,
    );
  }
  getSurfingDynamicObject(): number {
    return samp.callNative("FCNPC_GetSurfingDynamicObject", "i", this.id);
  }

  stopSurfing(): number {
    return samp.callNative("FCNPC_StopSurfing", "i", this.id);
  }

  startPlayingPlayback(
    file: string,
    recordId: number = INVALID_RECORD_ID,
    autoUnload: boolean = false,
    deltaX: number = 0.0,
    deltaY: number = 0.0,
    deltaZ: number = 0.0,
    deltaQW: number = 0.0,
    deltaQX: number = 0.0,
    deltaQY: number = 0.0,
    deltaQZ: number = 0.0,
  ): number {
    return samp.callNative(
      "FCNPC_StartPlayingPlayback",
      "isiifffffff",
      this.id,
      file,
      recordId,
      autoUnload,
      deltaX,
      deltaY,
      deltaZ,
      deltaQW,
      deltaQX,
      deltaQY,
      deltaQZ,
    );
  }
  stopPlayingPlayback(): number {
    return samp.callNative("FCNPC_StopPlayingPlayback", "i", this.id);
  }
  pausePlayingPlayback(): number {
    return samp.callNative("FCNPC_PausePlayingPlayback", "i", this.id);
  }
  resumePlayingPlayback(): number {
    return samp.callNative("FCNPC_ResumePlayingPlayback", "i", this.id);
  }
  static loadPlayingPlayback(file: string): number {
    return samp.callNative("FCNPC_LoadPlayingPlayback", "s", file);
  }
  static unloadPlayingPlayback(recordId: number): number {
    return samp.callNative("FCNPC_UnloadPlayingPlayback", "i", recordId);
  }
  setPlayingPlaybackPath(path: string): number {
    return samp.callNative("FCNPC_SetPlayingPlaybackPath", "is", this.id, path);
  }
  getPlayingPlaybackPath() {
    const [path, ret]: [string, number] = samp.callNative(
      "FCNPC_GetPlayingPlaybackPath",
      "iSi",
      this.id,
      255,
    );
    return { path, ret };
  }

  playNode(
    node: FCNPCNode,
    type: MoveType = MoveType.AUTO,
    speed: MoveSpeed = MoveSpeed.AUTO,
    mode: MoveMode = MoveMode.AUTO,
    radius: number = 0.0,
    setAngle: boolean = true,
  ): number {
    return samp.callNative(
      "FCNPC_PlayNode",
      "iiififi",
      this.id,
      node.id,
      type,
      speed,
      mode,
      radius,
      setAngle,
    );
  }

  stopPlayingNode(): number {
    return samp.callNative("FCNPC_StopPlayingNode", "i", this.id);
  }
  pausePlayingNode(): number {
    return samp.callNative("FCNPC_PausePlayingNode", "i", this.id);
  }
  resumePlayingNode(): number {
    return samp.callNative("FCNPC_ResumePlayingNode", "i", this.id);
  }
  isPlayingNode(): boolean {
    return !!samp.callNative("FCNPC_IsPlayingNode", "i", this.id);
  }
  isPlayingNodePaused(): boolean {
    return !!samp.callNative("FCNPC_IsPlayingNodePaused", "i", this.id);
  }

  goByMovePath(
    path: FCNPCMovePath,
    pointId: number = 0,
    type: MoveType = MoveType.AUTO,
    speed: MoveSpeed = MoveSpeed.AUTO,
    mode: MoveMode = MoveMode.AUTO,
    pathFinding: MovePathFinding = MovePathFinding.AUTO,
    radius: number = 0.0,
    setAngle: boolean = true,
    minDistance: number = 0.0,
  ) {
    return samp.callNative(
      "FCNPC_GoByMovePath",
      "iiiifiifif",
      this.id,
      path.id,
      pointId,
      type,
      speed,
      mode,
      pathFinding,
      radius,
      setAngle,
      minDistance,
    );
  }

  setMoveMode(mode: MoveMode): number {
    return samp.callNative("FCNPC_SetMoveMode", "ii", this.id, mode);
  }

  getMoveMode(): MoveMode {
    return samp.callNative("FCNPC_GetMoveMode", "i", this.id);
  }

  setMinHeightPosCall(height: number): number {
    return samp.callNative("FCNPC_SetMinHeightPosCall", "if", this.id, height);
  }

  getMinHeightPosCall(): number {
    return samp.callNativeFloat("FCNPC_GetMinHeightPosCall", "i", this.id);
  }

  showInTabListForPlayer(forPlayer: Player) {
    return !!samp.callNative(
      "FCNPC_ShowInTabListForPlayer",
      "ii",
      this.id,
      forPlayer.id,
    );
  }
  hideInTabListForPlayer(forPlayer: Player) {
    return !!samp.callNative(
      "FCNPC_HideInTabListForPlayer",
      "ii",
      this.id,
      forPlayer.id,
    );
  }

  static getPluginVersion() {
    const [version, ret]: [string, number] = samp.callNative(
      "FCNPC_GetPluginVersion",
      "Si",
      16,
    );
    return { version, ret };
  }
  static setUpdateRate(rate: number): number {
    return samp.callNative("FCNPC_SetUpdateRate", "i", rate);
  }
  static getUpdateRate(): number {
    return samp.callNative("FCNPC_GetUpdateRate", "");
  }
  static setTickRate(rate: number): number {
    return samp.callNative("FCNPC_SetTickRate", "i", rate);
  }
  static getTickRate(): number {
    return samp.callNative("FCNPC_GetTickRate", "");
  }
  static useMoveMode(mode: MoveMode, use = true): number {
    const ret = samp.callNative("FCNPC_UseMoveMode", "ii", mode, use);
    return ret;
  }
  static isMoveModeUsed(mode: MoveMode) {
    const ret = samp.callNative("FCNPC_IsMoveModeUsed", "i", mode);
    return !!ret;
  }
  static useMovePathFinding(pathFinding: MovePathFinding, use = true): number {
    return samp.callNative("FCNPC_UseMovePathfinding", "ii", pathFinding, use);
  }
  static isMovePathFindingUsed(pathFinding: MovePathFinding) {
    const ret = samp.callNative(
      "FCNPC_IsMovePathfindingUsed",
      "i",
      pathFinding,
    );
    return !!ret;
  }
  static useCrashLog(use = true): number {
    return samp.callNative("FCNPC_UseCrashLog", "i", use);
  }
  static isCrashLogUsed() {
    const ret = samp.callNative("FCNPC_IsCrashLogUsed", "");
    return !!ret;
  }
  static getInstance(npcId: number) {
    return FCNPCInstances.get(npcId);
  }
  static getInstances() {
    return [...FCNPCInstances.values()];
  }
}
