import * as w from "core/wrapper/native";

import type {
  WeaponSkillsEnum,
  FightingStylesEnum,
  CameraModesEnum,
  WeaponEnum,
  WeaponStatesEnum,
  BoneIdsEnum,
  ForceSyncEnum,
} from "../../enums";

import {
  SpectateModesEnum,
  SpecialActionsEnum,
  PlayerStateEnum,
  InvalidEnum,
  CameraCutStylesEnum,
  DamageDeathReasonEnum,
  LimitsEnum,
} from "../../enums";

import type { IClientResRaw, IInnerPlayerProps } from "../../interfaces";
import { isValidAnimateName } from "../../utils/animate";
import * as h from "../../utils/helper";

import type { Vehicle } from "../vehicle/entity";
import { defineEvent } from "../../utils/bus";
import { VectorSize } from "core/wrapper/native";
import { internalPlayerProps, playerPool, vehiclePool } from "core/utils/pools";
import { CmdBus } from "./command";
import { ObjectMp } from "../object/entity";
import { GameMode } from "../gamemode";

export const [onCheckResponse] = defineEvent({
  name: "OnClientCheckResponse",
  identifier: "iiii",
  beforeEach(id: number, actionId: number, memAddr: number, data: number) {
    return { player: Player.getInstance(id)!, actionId, memAddr, data };
  },
});

export const [onLocaleChange, triggerOnLocaleChange] = defineEvent({
  name: "OnPlayerLocaleChange",
  isNative: false,
  beforeEach(player: Player, newLocale: string, oldLocale: string) {
    return { player, newLocale, oldLocale };
  },
});

export const [onCharsetChange, triggerOnCharsetChange] = defineEvent({
  name: "OnPlayerCharsetChange",
  isNative: false,
  beforeEach(player: Player, newCharset: string, oldCharset: string) {
    return { player, newCharset, oldCharset };
  },
});

export class Player {
  static MAX_CHECK_ANDROID_DELAY = 10; // 10s
  static SKIP_CHECK_ANDROID = false;

  private _charset = "ISO-8859-1";
  private _locale = "en_US";

  [internalPlayerProps]: IInnerPlayerProps = {
    isAndroid: true,
    lastDrunkLevel: 0,
    lastFps: 0,
    lastUpdateTick: 0,
    lastUpdateFpsTick: 0,
    isPaused: false,
    isRecording: false,
  };

  get lastDrunkLevel() {
    return this[internalPlayerProps].lastDrunkLevel;
  }

  get lastFps() {
    return this[internalPlayerProps].lastFps;
  }

  get lastUpdateTick() {
    return this[internalPlayerProps].lastUpdateTick;
  }

  get lastUpdateFpsTick() {
    return this[internalPlayerProps].lastUpdateFpsTick;
  }

  get isPaused() {
    return this[internalPlayerProps].isPaused;
  }

  get isRecording() {
    return this[internalPlayerProps].isRecording;
  }

  get charset() {
    return this._charset;
  }

  set charset(newCharset: string) {
    const oldCharset = this._charset;
    this._charset = newCharset;
    triggerOnCharsetChange(this, newCharset, oldCharset);
  }

  get locale() {
    return this._locale;
  }

  set locale(newLocale: string) {
    const oldLocale = this._locale;
    this._locale = newLocale;
    triggerOnLocaleChange(this, newLocale, oldLocale);
  }

  constructor(public readonly id: number) {
    if (id < 0 || id >= LimitsEnum.MAX_PLAYERS) {
      throw new Error(
        `Invalid player ID: ${id} (valid range: 0-${LimitsEnum.MAX_PLAYERS - 1})`,
      );
    }
    const player = Player.getInstance(id);
    if (player) return player;
    playerPool.set(id, this);
  }

  sendClientMessage(color: string | number, msg: string): number {
    return Player.__inject__.sendClientMessage(this, color, msg);
  }

  static sendClientMessageToAll(color: string | number, msg: string) {
    Player.__inject__.sendClientMessageToAll(Player.getInstances(), color, msg);
  }

  sendMessageToPlayer(player: Player, message: string): number {
    return Player.__inject__.sendMessageToPlayer(player, this.id, message);
  }

  sendMessageToAll(message: string): number {
    return Player.__inject__.sendMessageToAll(
      Player.getInstances(),
      this.id,
      message,
    );
  }

  isNpc(): boolean {
    return Player.__inject__.isNpc(this.id);
  }

  // first call will return 0;
  // should be called at one second intervals, implemented internally by throttling
  getFps(): number {
    return this.lastFps;
  }
  getDrunkLevel(): number {
    return Player.__inject__.getDrunkLevel(this.id);
  }
  setDrunkLevel(level: number) {
    if (level < 0 || level > 50000) {
      throw new Error("[Player]: player's drunk level ranges from 0 to 50000");
    }
    return Player.__inject__.setDrunkLevel(this.id, level);
  }
  allowTeleport(allow: boolean) {
    return Player.__inject__.allowTeleport(this.id, allow);
  }
  isTeleportAllowed() {
    return Player.__inject__.isTeleportAllowed(this.id);
  }
  enableCameraTarget(enable: boolean) {
    return Player.__inject__.enableCameraTarget(this.id, enable);
  }
  enableStuntBonus(enable: boolean) {
    return Player.__inject__.enableStuntBonus(this.id, enable);
  }
  getInterior(): number {
    return Player.__inject__.getInterior(this.id);
  }
  setInterior(interiorId: number) {
    return Player.__inject__.setInterior(this.id, interiorId);
  }
  showNameTag(showPlayer: Player, show: boolean) {
    return Player.__inject__.showNameTag(this.id, showPlayer.id, show);
  }
  setColor(color: string | number) {
    return Player.__inject__.setColor(this.id, color);
  }
  getColor(): number {
    return Player.__inject__.getColor(this.id);
  }
  setMapIcon(
    iconId: number,
    x: number,
    y: number,
    z: number,
    markerType: number,
    color: string | number,
    style: number,
  ) {
    return Player.__inject__.setMapIcon(
      this.id,
      iconId,
      x,
      y,
      z,
      markerType,
      color,
      style,
    );
  }
  removeMapIcon(iconId: number) {
    return Player.__inject__.removeMapIcon(this.id, iconId);
  }
  setMarker(showPlayer: Player, color: string | number) {
    Player.__inject__.setMarker(this.id, showPlayer.id, color);
  }
  getMarker(targetPlayer: Player) {
    return Player.__inject__.getMarker(this.id, targetPlayer.id);
  }
  resetMoney() {
    return Player.__inject__.resetMoney(this.id);
  }
  getMoney(): number {
    return Player.__inject__.getMoney(this.id);
  }
  giveMoney(money: number) {
    return Player.__inject__.giveMoney(this.id, money);
  }
  resetWeapons() {
    return Player.__inject__.resetWeapons(this.id);
  }
  spawn(): boolean {
    return Player.__inject__.spawn(this.id);
  }
  setHealth(health: number) {
    return Player.__inject__.setHealth(this.id, health);
  }
  getHealth() {
    return Player.__inject__.getHealth(this.id);
  }
  toggleClock(toggle: boolean) {
    return Player.__inject__.toggleClock(this.id, toggle);
  }
  toggleControllable(toggle: boolean) {
    return Player.__inject__.toggleControllable(this.id, toggle);
  }
  toggleSpectating(toggle: boolean) {
    return Player.__inject__.toggleSpectating(this.id, toggle);
  }
  spectatePlayer(targetPlayer: Player, mode = SpectateModesEnum.NORMAL) {
    return Player.__inject__.spectatePlayer(this.id, targetPlayer.id, mode);
  }
  spectateVehicle(targetVehicle: Vehicle, mode = SpectateModesEnum.NORMAL) {
    return Player.__inject__.spectateVehicle(this.id, targetVehicle.id, mode);
  }
  forceClassSelection() {
    return Player.__inject__.forceClassSelection(this.id);
  }
  kick() {
    return Player.__inject__.kick(this.id);
  }
  ban() {
    return Player.__inject__.ban(this.id);
  }
  banEx(reason: string, charset: string) {
    return Player.__inject__.banEx(this.id, reason, charset);
  }
  isAdmin() {
    return Player.__inject__.isAdmin(this.id);
  }
  isInRangeOfPoint(range: number, x: number, y: number, z: number) {
    return Player.__inject__.isInRangeOfPoint(this.id, range, x, y, z);
  }
  isStreamedIn(forPlayer: Player) {
    return Player.__inject__.isStreamedIn(this.id, forPlayer.id);
  }
  setSkin(skinId: number, ignoreRange = false) {
    if (!ignoreRange && (skinId < 0 || skinId > 311 || skinId === 74))
      return false;
    if (this.getHealth().health <= 0) return false;
    if (this.isInAnyVehicle()) return false;
    if (this.getSpecialAction() === SpecialActionsEnum.DUCK) return false;
    return Player.__inject__.setSkin(this.id, skinId);
  }
  getSkin(): number {
    return Player.__inject__.getSkin(this.id);
  }
  isInAnyVehicle(): boolean {
    return Player.__inject__.isInAnyVehicle(this.id);
  }
  getSpecialAction(): SpecialActionsEnum {
    return Player.__inject__.getSpecialAction(this.id);
  }
  setSpecialAction(actionId: SpecialActionsEnum) {
    return Player.__inject__.setSpecialAction(this.id, actionId);
  }
  setScore(score: number) {
    return Player.__inject__.setScore(this.id, score);
  }
  getScore(): number {
    return Player.__inject__.getScore(this.id);
  }
  getPing(): number {
    return Player.__inject__.getPing(this.id) || 0;
  }
  setPos(x: number, y: number, z: number) {
    return Player.__inject__.setPos(this.id, x, y, z);
  }
  getPos() {
    return Player.__inject__.getPos(this.id);
  }
  isSpectating(): boolean {
    return this.getState() === PlayerStateEnum.SPECTATING;
  }
  isWasted(): boolean {
    return this.getState() === PlayerStateEnum.WASTED;
  }
  getState(): PlayerStateEnum {
    return Player.__inject__.getState(this.id);
  }
  getVersion() {
    return Player.__inject__.getVersion(this.id);
  }
  setVirtualWorld(worldId: number) {
    return Player.__inject__.setVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    return Player.__inject__.getVirtualWorld(this.id);
  }
  removeFromVehicle() {
    return Player.__inject__.removeFromVehicle(this.id);
  }
  setWantedLevel(level: number) {
    if (level < 0 || level > 6) {
      throw new Error("[Player]: player's wanted level ranges from 0 to 6");
    }
    return Player.__inject__.setWantedLevel(this.id, level);
  }
  getWantedLevel(): number {
    return Player.__inject__.getWantedLevel(this.id);
  }
  setFacingAngle(ang: number) {
    return Player.__inject__.setFacingAngle(this.id, ang);
  }
  getFacingAngle() {
    return Player.__inject__.getFacingAngle(this.id);
  }
  setWeather(weather: number) {
    if (weather < 0 || weather > 255) {
      throw new Error("[Player]: The valid weather value is only 0 to 255");
    }
    return Player.__inject__.setWeather(this.id, weather);
  }
  getWeather(): number {
    return Player.__inject__.getWeather(this.id);
  }
  setTime(hour: number, minute: number) {
    if (hour < 0 || hour > 23) {
      throw new Error("[Player]: The valid hour value is only 0 to 23");
    }
    if (minute < 0 || minute > 59) {
      throw new Error("[Player]: The valid minute value is only 0 to 59");
    }
    return Player.__inject__.setTime(this.id, hour, minute);
  }
  getTime() {
    return Player.__inject__.getTime(this.id);
  }
  removeBuilding(
    modelId: number,
    fX: number,
    fY: number,
    fZ: number,
    fRadius: number,
  ) {
    return Player.__inject__.removeBuilding(
      this.id,
      modelId,
      fX,
      fY,
      fZ,
      fRadius,
    );
  }
  setTeam(team: number): void {
    if (team < 0 || team > InvalidEnum.NO_TEAM) return;
    Player.__inject__.setTeam(this.id, team);
  }
  getTeam(): number {
    return Player.__inject__.getTeam(this.id);
  }
  setSkillLevel(skill: WeaponSkillsEnum, level: number) {
    if (level < 0 || level > 999) {
      throw new Error("[Player]: The valid skill level is only 0 to 999");
    }
    return Player.__inject__.setSkillLevel(this.id, skill, level);
  }
  getName() {
    return Player.__inject__.getName(this);
  }
  setName(name: string): number {
    return Player.__inject__.setName(this, name);
  }
  setVelocity(x: number, y: number, z: number) {
    return Player.__inject__.setVelocity(this.id, x, y, z);
  }
  getVelocity() {
    return Player.__inject__.getVelocity(this.id);
  }
  getSpeed(magic = 180.0) {
    if (this.id === -1) return 0.0;
    const { x, y, z } = this.getVelocity();
    return VectorSize(x, y, z) * magic;
  }
  getKeys() {
    return Player.__inject__.getKeys(this.id);
  }
  getIp() {
    return Player.__inject__.getIp(this.id);
  }
  getFightingStyle(): FightingStylesEnum {
    return Player.__inject__.getFightingStyle(this.id);
  }
  setFightingStyle(style: FightingStylesEnum) {
    return Player.__inject__.setFightingStyle(this.id, style);
  }
  setArmour(armour: number) {
    return Player.__inject__.setArmour(this.id, armour);
  }
  getArmour() {
    return Player.__inject__.getArmour(this.id);
  }
  setCameraBehind() {
    return Player.__inject__.setCameraBehind(this.id);
  }
  setCameraPos(x: number, y: number, z: number) {
    return Player.__inject__.setCameraPos(this.id, x, y, z);
  }
  setCameraLookAt(
    x: number,
    y: number,
    z: number,
    style: CameraCutStylesEnum = CameraCutStylesEnum.CUT,
  ) {
    return Player.__inject__.setCameraLookAt(this.id, x, y, z, style);
  }
  getCameraAspectRatio(): number {
    return Player.__inject__.getCameraAspectRatio(this.id);
  }
  getCameraFrontVector() {
    return Player.__inject__.getCameraFrontVector(this.id);
  }
  getCameraMode(): CameraModesEnum {
    return Player.__inject__.getCameraMode(this.id);
  }
  getCameraPos() {
    return Player.__inject__.getCameraPos(this.id);
  }
  getCameraTargetPlayer(): Player | undefined {
    const target = Player.__inject__.getCameraTargetPlayer(this.id);
    return Player.getInstances().find((p) => p.id === target);
  }
  getCameraTargetVehicle(): Vehicle | undefined {
    const target = Player.__inject__.getCameraTargetVehicle(this.id);
    return [...vehiclePool.values()].find((v) => v.id === target);
  }
  getCameraZoom(): number {
    return Player.__inject__.getCameraZoom(this.id);
  }
  playAudioStream(
    url: string,
    posX = 0.0,
    posY = 0.0,
    posZ = 0.0,
    distance = 5.0,
  ) {
    let usePos = false;
    if (posX !== 0.0 || posY !== 0.0 || posZ !== 0.0) {
      usePos = true;
    }
    return Player.__inject__.playAudioStream(
      this.id,
      url,
      posX,
      posY,
      posZ,
      distance,
      usePos,
    );
  }
  stopAudioStream() {
    return Player.__inject__.stopAudioStream(this.id);
  }
  playSound(
    soundId: number,
    relativeX = 0.0,
    relativeY = 0.0,
    relativeZ = 0.0,
  ) {
    return Player.__inject__.playSound(
      this.id,
      soundId,
      relativeX,
      relativeY,
      relativeZ,
    );
  }
  static getMaxPlayers(): number {
    return Player.__inject__.getMaxPlayers();
  }
  playCrimeReport(suspect: Player, crimeId: number) {
    if (crimeId < 3 || crimeId > 22) {
      throw new Error("[Player]: Available crime ids range from 3 to 22");
    }
    return Player.__inject__.playCrimeReport(this.id, suspect.id, crimeId);
  }
  interpolateCameraPos(
    fromX: number,
    fromY: number,
    fromZ: number,
    toX: number,
    toY: number,
    toZ: number,
    time: number,
    cut: CameraCutStylesEnum = CameraCutStylesEnum.CUT,
  ) {
    return Player.__inject__.interpolateCameraPos(
      this.id,
      fromX,
      fromY,
      fromZ,
      toX,
      toY,
      toZ,
      time,
      cut,
    );
  }
  interpolateCameraLookAt(
    fromX: number,
    fromY: number,
    fromZ: number,
    toX: number,
    toY: number,
    toZ: number,
    time: number,
    cut: CameraCutStylesEnum = CameraCutStylesEnum.CUT,
  ) {
    return Player.__inject__.interpolateCameraLookAt(
      this.id,
      fromX,
      fromY,
      fromZ,
      toX,
      toY,
      toZ,
      time,
      cut,
    );
  }
  createExplosion(
    x: number,
    y: number,
    z: number,
    type: number,
    radius: number,
  ) {
    if (type < 0 || type > 13) {
      throw new Error(
        "[Player]: The valid explosion type value is only 0 to 13",
      );
    }
    return Player.__inject__.createExplosion(this.id, x, y, z, type, radius);
  }
  static isConnected(id: number): boolean {
    return Player.__inject__.isConnected(id);
  }
  isConnected(): boolean {
    return Player.isConnected(this.id);
  }
  disableRemoteVehicleCollisions(disable: boolean) {
    return Player.__inject__.disableRemoteVehicleCollisions(this.id, disable);
  }
  getVehicle() {
    if (!this.isInAnyVehicle()) return;
    const vehId: number = Player.__inject__.getVehicleID(this.id);
    return [...vehiclePool.values()].find((v) => v.id === vehId);
  }
  getVehicleSeat(): number {
    return Player.__inject__.getVehicleSeat(this.id);
  }
  getSurfingVehicle() {
    const vehId = Player.__inject__.getSurfingVehicleID(this.id);
    if (vehId === InvalidEnum.VEHICLE_ID) return;
    return [...vehiclePool.values()].find((v) => v.id === vehId);
  }
  applyAnimation(
    animLib: string,
    animName: string,
    speed = 4.1,
    loop = false,
    lockX = true,
    lockY = true,
    freeze = false,
    time = 0,
    forceSync: boolean | ForceSyncEnum = false,
  ) {
    if (!isValidAnimateName(animLib, animName)) {
      throw new Error(
        `[Player]: Invalid anim library or name ${animLib} ${animName}`,
      );
    }
    return Player.__inject__.applyAnimation(
      this.id,
      animLib,
      animName,
      speed,
      loop,
      lockX,
      lockY,
      freeze,
      time,
      +forceSync,
    );
  }
  clearAnimations(forceSync = false) {
    return Player.__inject__.clearAnimations(this.id, forceSync);
  }
  getAnimationIndex(): number {
    return Player.__inject__.getAnimationIndex(this.id);
  }
  getAnimationName() {
    return GameMode.getAnimationName(this.getAnimationIndex());
  }
  setShopName(shopName: string) {
    return Player.__inject__.setShopName(this.id, shopName);
  }
  setPosFindZ(x: number, y: number, z: number) {
    return Player.__inject__.setPosFindZ(this.id, x, y, z);
  }
  setWorldBounds(xMax: number, xMin: number, yMax: number, yMin: number) {
    return Player.__inject__.setWorldBounds(this.id, xMax, xMin, yMax, yMin);
  }
  clearWorldBounds() {
    return Player.__inject__.clearWorldBounds(this.id);
  }
  setChatBubble(
    text: string,
    color: string | number,
    drawDistance: number,
    expireTime: number,
    charset = this.charset,
  ) {
    return Player.__inject__.setChatBubble(
      this.id,
      text,
      color,
      drawDistance,
      expireTime,
      charset,
    );
  }
  getDistanceFromPoint(x: number, y: number, z: number): number {
    return Player.__inject__.getDistanceFromPoint(this.id, x, y, z);
  }
  getCustomSkin(): number {
    return Player.__inject__.getCustomSkin(this.id);
  }
  getTargetPlayer(): Player | undefined {
    const pid = Player.__inject__.getTargetPlayer(this.id);
    if (pid === InvalidEnum.PLAYER_ID) return;
    return Player.getInstances().find((p) => p.id === pid);
  }
  getLastShotVectors() {
    return Player.__inject__.getLastShotVectors(this.id);
  }
  getWeapon(): WeaponEnum | -1 {
    return Player.__inject__.getWeapon(this.id);
  }
  getWeaponData(slot: number) {
    return Player.__inject__.getWeaponData(this.id, slot);
  }
  getWeaponState(): WeaponStatesEnum {
    return Player.__inject__.getWeaponState(this.id);
  }
  giveWeapon(weaponId: WeaponEnum, ammo: number) {
    return Player.__inject__.giveWeapon(this.id, weaponId, ammo);
  }
  setAmmo(weaponId: number, ammo: number) {
    return Player.__inject__.setAmmo(this.id, weaponId, ammo);
  }
  getAmmo(): number {
    return Player.__inject__.getAmmo(this.id);
  }
  setArmedWeapon(weaponId: number) {
    return Player.__inject__.setArmedWeapon(this.id, weaponId);
  }
  // not test
  clearDeathMessage() {
    for (let i = 0; i < 5; i++) {
      this.sendDeathMessageToPlayer(
        InvalidEnum.PLAYER_ID,
        InvalidEnum.PLAYER_ID,
        DamageDeathReasonEnum.CONNECT,
      );
    }
  }
  sendDeathMessage(
    killer: Player | InvalidEnum.PLAYER_ID,
    weapon: WeaponEnum | DamageDeathReasonEnum,
  ) {
    return Player.__inject__.sendDeathMessage(
      killer === InvalidEnum.PLAYER_ID ? killer : killer.id,
      this.id,
      weapon,
    );
  }
  sendDeathMessageToPlayer(
    killer: Player | InvalidEnum.PLAYER_ID,
    killee: Player | InvalidEnum.PLAYER_ID,
    weapon: WeaponEnum | DamageDeathReasonEnum,
  ) {
    return Player.__inject__.sendDeathMessageToPlayer(
      this.id,
      killer === InvalidEnum.PLAYER_ID ? killer : killer.id,
      killee === InvalidEnum.PLAYER_ID ? killee : killee.id,
      weapon,
    );
  }
  setSpawnInfo(
    team: number,
    skin: number,
    x: number,
    y: number,
    z: number,
    rotation: number,
    weapon1: WeaponEnum,
    weapon1Ammo: number,
    weapon2: WeaponEnum,
    weapon2Ammo: number,
    weapon3: WeaponEnum,
    weapon3Ammo: number,
  ) {
    if (team < 0 || team > InvalidEnum.NO_TEAM) return false;
    if (skin < 0 || skin > 311 || skin === 74) return false;
    if (weapon1Ammo < 0 || weapon2Ammo < 0 || weapon3Ammo < 0) return false;
    return Player.__inject__.setSpawnInfo(
      this.id,
      team,
      skin,
      x,
      y,
      z,
      rotation,
      weapon1,
      weapon1Ammo,
      weapon2,
      weapon2Ammo,
      weapon3,
      weapon3Ammo,
    );
  }
  redirectDownload(url: string) {
    return Player.__inject__.redirectDownload(this.id, url);
  }
  sendClientCheck(
    type: number,
    memAddr: number,
    memOffset: number,
    byteCount: number,
  ) {
    const validTypes = [2, 5, 69, 70, 71, 72];
    if (!validTypes.includes(type)) {
      throw new Error(
        `[Player]: sendClientCheck valid types are ${validTypes.toString()}`,
      );
    }

    return new Promise<IClientResRaw>((resolve, reject) => {
      if (this.isPaused) {
        return reject(
          "[Player]: An attempt to check player client response, but player paused game",
        );
      }

      const timeoutMsg =
        "[Player]: An attempt to check player client response timed out";

      const ping = this.getPing();
      const shouldResTime = (ping >= 200 ? 0 : ping) + 200;

      let timer: NodeJS.Timeout | null = null;

      const off = onCheckResponse(
        ({ player, actionId, memAddr, data, next }) => {
          if (player !== this) return next();
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          resolve({ actionId, memAddr, data });
          return next();
        },
      );

      timer = setTimeout(() => {
        off();
        reject(timeoutMsg);
      }, shouldResTime);

      Player.__inject__.sendClientCheck(
        this.id,
        type,
        memAddr,
        memOffset,
        byteCount,
      );
    });
  }
  selectTextDraw(color: string | number): void {
    Player.__inject__.selectTextDraw(this.id, color);
  }
  cancelSelectTextDraw(): void {
    Player.__inject__.cancelSelectTextDraw(this.id);
  }
  beginObjectSelecting() {
    return Player.__inject__.beginObjectSelecting(this.id);
  }
  endObjectEditing() {
    return Player.__inject__.endObjectEditing(this.id);
  }
  getSurfingObject() {
    const id: number = Player.__inject__.getSurfingObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return ObjectMp.getInstance(id);
  }
  getSurfingPlayerObject() {
    const id: number = Player.__inject__.getSurfingPlayerObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return ObjectMp.getInstance(id, this);
  }
  isAttachedObjectSlotUsed(index: number): boolean {
    return Player.__inject__.isAttachedObjectSlotUsed(this.id, index);
  }
  editAttachedObject(index: number) {
    return Player.__inject__.editAttachedObject(this.id, index);
  }
  setAttachedObject(
    index: number,
    modelId: number,
    bone: BoneIdsEnum,
    fOffsetX = 0.0,
    fOffsetY = 0.0,
    fOffsetZ = 0.0,
    fRotX = 0.0,
    fRotY = 0.0,
    fRotZ = 0.0,
    fScaleX = 1.0,
    fScaleY = 1.0,
    fScaleZ = 1.0,
    materialColor1: string | number = 0,
    materialColor2: string | number = 0,
  ) {
    if (this.isAttachedObjectSlotUsed(index)) return 0;
    return Player.__inject__.setAttachedObject(
      this.id,
      index,
      modelId,
      bone,
      fOffsetX,
      fOffsetY,
      fOffsetZ,
      fRotX,
      fRotY,
      fRotZ,
      fScaleX,
      fScaleY,
      fScaleZ,
      materialColor1,
      materialColor2,
    );
  }
  removeAttachedObject(index: number): boolean {
    if (!this.isAttachedObjectSlotUsed(index)) return false;
    return Player.__inject__.removeAttachedObject(this.id, index);
  }
  getAnimationFlags(): number {
    return samp.callNative("GetPlayerAnimationFlags", "i", this.id);
  }
  getLastSyncedTrailerID(): number {
    return samp.callNative("GetPlayerLastSyncedTrailerID", "i", this.id);
  }
  getLastSyncedVehicleID(): number {
    return samp.callNative("GetPlayerLastSyncedVehicleID", "i", this.id);
  }
  toggleWidescreen(set: boolean) {
    return Player.__inject__.toggleWidescreen(this.id, set);
  }
  isWidescreenToggled(): boolean {
    return Player.__inject__.isWidescreenToggled(this.id);
  }
  getSpawnInfo() {
    return Player.__inject__.getSpawnInfo(this.id);
  }
  getSkillLevel(skill: WeaponSkillsEnum): number {
    return Player.__inject__.getSkillLevel(this.id, skill);
  }
  isCheckpointActive(): boolean {
    return Player.__inject__.isCheckpointActive(this.id);
  }
  getCheckpoint() {
    return Player.__inject__.getCheckpoint(this.id);
  }
  isRaceCheckpointActive(): boolean {
    return Player.__inject__.isRaceCheckpointActive(this.id);
  }
  getRaceCheckpoint() {
    return Player.__inject__.getRaceCheckpoint(this.id);
  }
  getWorldBounds() {
    return Player.__inject__.getWorldBounds(this.id);
  }
  isInModShop(): boolean {
    return Player.__inject__.isInModShop(this.id);
  }
  getSirenState(): number {
    return Player.__inject__.getSirenState(this.id);
  }
  getLandingGearState(): number {
    return Player.__inject__.getLandingGearState(this.id);
  }
  getHydraReactorAngle(): number {
    return Player.__inject__.getHydraReactorAngle(this.id);
  }
  getTrainSpeed(): number {
    return Player.__inject__.getTrainSpeed(this.id);
  }
  getZAim(): number {
    return Player.__inject__.getZAim(this.id);
  }
  getSurfingOffsets() {
    return Player.__inject__.getSurfingOffsets(this.id);
  }
  getRotationQuat() {
    return Player.__inject__.getRotationQuat(this.id);
  }
  getDialogID(): number {
    return Player.__inject__.getDialogID(this.id);
  }
  getSpectateID(): number {
    return Player.__inject__.getSpectateID(this.id);
  }
  getSpectateType(): SpectateModesEnum {
    return Player.__inject__.getSpectateType(this.id);
  }
  getRawIp(): string {
    return Player.__inject__.getRawIp(this.id);
  }
  setGravity(gravity: number) {
    return Player.__inject__.setGravity(this.id, gravity);
  }
  getGravity(): number {
    return Player.__inject__.getGravity(this.id);
  }
  setAdmin(admin: boolean) {
    return Player.__inject__.setAdmin(this.id, admin);
  }
  isSpawned(): boolean {
    return Player.__inject__.isSpawned(this.id);
  }
  isControllable(): boolean {
    return Player.__inject__.isControllable(this.id);
  }
  isCameraTargetEnabled(): boolean {
    return Player.__inject__.isCameraTargetEnabled(this.id);
  }
  toggleGhostMode(toggle: boolean) {
    return Player.__inject__.toggleGhostMode(this.id, toggle);
  }
  getGhostMode(): boolean {
    return Player.__inject__.getGhostMode(this.id);
  }
  getBuildingsRemoved(): number {
    return Player.__inject__.getBuildingsRemoved(this.id);
  }
  getAttachedObject(index: number) {
    return Player.__inject__.getAttachedObject(this.id, index);
  }
  removeWeapon(weaponId: number) {
    return Player.__inject__.removeWeapon(this.id, weaponId);
  }
  isUsingOfficialClient() {
    return Player.__inject__.isUsingOfficialClient(this.id);
  }
  allowWeapons(allow: boolean) {
    return Player.__inject__.allowWeapons(this.id, allow);
  }
  areWeaponsAllowed() {
    return Player.__inject__.areWeaponsAllowed(this.id);
  }
  gpci(charset: string = this.charset) {
    return Player.__inject__.gpci(this.id, charset);
  }
  isCuffed() {
    return Player.__inject__.isCuffed(this.id);
  }
  isInDriveByMode() {
    return Player.__inject__.isInDriveByMode(this.id);
  }
  isAndroid() {
    return this.isConnected() && this[internalPlayerProps].isAndroid;
  }
  isPC() {
    return this.isConnected() && !this[internalPlayerProps].isAndroid;
  }
  isUsingOmp() {
    return Player.__inject__.isUsingOmp(this.id);
  }
  simulateCommand(cmdText: string | number[]) {
    return CmdBus.simulate(this, cmdText);
  }
  static getInstance(id: number) {
    return playerPool.get(id);
  }
  static getInstances() {
    return [...playerPool.values()];
  }

  static __inject__ = {
    sendClientMessage: h.SendClientMessage,
    sendClientMessageToAll: h.SendClientMessageToAll,
    sendMessageToPlayer: h.SendPlayerMessageToPlayer,
    sendMessageToAll: h.SendPlayerMessageToAll,
    banEx: h.BanEx,
    getName: h.GetPlayerName,
    setName: h.SetPlayerName,
    setChatBubble: h.SetPlayerChatBubble,

    isNpc: w.IsPlayerNPC,
    getDrunkLevel: w.GetPlayerDrunkLevel,
    setDrunkLevel: w.SetPlayerDrunkLevel,
    allowTeleport: w.AllowPlayerTeleport,
    isTeleportAllowed: w.IsPlayerTeleportAllowed,
    enableCameraTarget: w.EnablePlayerCameraTarget,
    enableStuntBonus: w.EnableStuntBonusForPlayer,
    getInterior: w.GetPlayerInterior,
    setInterior: w.SetPlayerInterior,
    showNameTag: w.ShowPlayerNameTagForPlayer,
    setColor: w.SetPlayerColor,
    getColor: w.GetPlayerColor,
    setMapIcon: w.SetPlayerMapIcon,
    removeMapIcon: w.RemovePlayerMapIcon,
    setMarker: w.SetPlayerMarkerForPlayer,
    getMarker: w.GetPlayerMarkerForPlayer,
    resetMoney: w.ResetPlayerMoney,
    getMoney: w.GetPlayerMoney,
    giveMoney: w.GivePlayerMoney,
    resetWeapons: w.ResetPlayerWeapons,
    spawn: w.SpawnPlayer,
    setHealth: w.SetPlayerHealth,
    getHealth: w.GetPlayerHealth,
    toggleClock: w.TogglePlayerClock,
    toggleControllable: w.TogglePlayerControllable,
    toggleSpectating: w.TogglePlayerSpectating,
    spectatePlayer: w.PlayerSpectatePlayer,
    spectateVehicle: w.PlayerSpectateVehicle,
    forceClassSelection: w.ForceClassSelection,
    kick: w.Kick,
    ban: w.Ban,
    isAdmin: w.IsPlayerAdmin,
    isInRangeOfPoint: w.IsPlayerInRangeOfPoint,
    isStreamedIn: w.IsPlayerStreamedIn,
    setSkin: w.SetPlayerSkin,
    getSkin: w.GetPlayerSkin,
    isInAnyVehicle: w.IsPlayerInAnyVehicle,
    getSpecialAction: w.GetPlayerSpecialAction,
    setSpecialAction: w.SetPlayerSpecialAction,
    setScore: w.SetPlayerScore,
    getScore: w.GetPlayerScore,
    getPing: w.GetPlayerPing,
    setPos: w.SetPlayerPos,
    getPos: w.GetPlayerPos,
    getState: w.GetPlayerState,
    getVersion: w.GetPlayerVersion,
    setVirtualWorld: w.SetPlayerVirtualWorld,
    getVirtualWorld: w.GetPlayerVirtualWorld,
    removeFromVehicle: w.RemovePlayerFromVehicle,
    setWantedLevel: w.SetPlayerWantedLevel,
    getWantedLevel: w.GetPlayerWantedLevel,
    setFacingAngle: w.SetPlayerFacingAngle,
    getFacingAngle: w.GetPlayerFacingAngle,
    setWeather: w.SetPlayerWeather,
    getWeather: w.GetPlayerWeather,
    setTime: w.SetPlayerTime,
    getTime: w.GetPlayerTime,
    removeBuilding: w.RemoveBuildingForPlayer,
    setTeam: w.SetPlayerTeam,
    getTeam: w.GetPlayerTeam,
    setSkillLevel: w.SetPlayerSkillLevel,
    setVelocity: w.SetPlayerVelocity,
    getVelocity: w.GetPlayerVelocity,
    getKeys: w.GetPlayerKeys,
    getIp: w.GetPlayerIp,
    getFightingStyle: w.GetPlayerFightingStyle,
    setFightingStyle: w.SetPlayerFightingStyle,
    setArmour: w.SetPlayerArmour,
    getArmour: w.GetPlayerArmour,
    setCameraBehind: w.SetCameraBehindPlayer,
    setCameraPos: w.SetPlayerCameraPos,
    setCameraLookAt: w.SetPlayerCameraLookAt,
    getCameraAspectRatio: w.GetPlayerCameraAspectRatio,
    getCameraFrontVector: w.GetPlayerCameraFrontVector,
    getCameraMode: w.GetPlayerCameraMode,
    getCameraPos: w.GetPlayerCameraPos,
    getCameraTargetPlayer: w.GetPlayerCameraTargetPlayer,
    getCameraTargetVehicle: w.GetPlayerCameraTargetVehicle,
    getCameraZoom: w.GetPlayerCameraZoom,
    playAudioStream: w.PlayAudioStreamForPlayer,
    stopAudioStream: w.StopAudioStreamForPlayer,
    playSound: w.PlayerPlaySound,
    getMaxPlayers: w.GetMaxPlayers,
    playCrimeReport: w.PlayCrimeReportForPlayer,
    interpolateCameraPos: w.InterpolateCameraPos,
    interpolateCameraLookAt: w.InterpolateCameraLookAt,
    createExplosion: w.CreateExplosionForPlayer,
    isConnected: w.IsPlayerConnected,
    disableRemoteVehicleCollisions: w.DisableRemoteVehicleCollisions,
    getVehicleID: w.GetPlayerVehicleID,
    getVehicleSeat: w.GetPlayerVehicleSeat,
    getSurfingVehicleID: w.GetPlayerSurfingVehicleID,
    applyAnimation: w.ApplyAnimation,
    clearAnimations: w.ClearAnimations,
    getAnimationIndex: w.GetPlayerAnimationIndex,
    setShopName: w.SetPlayerShopName,
    setPosFindZ: w.SetPlayerPosFindZ,
    setWorldBounds: w.SetPlayerWorldBounds,
    clearWorldBounds: w.ClearPlayerWorldBounds,
    getDistanceFromPoint: w.GetPlayerDistanceFromPoint,
    getCustomSkin: w.GetPlayerCustomSkin,
    getTargetPlayer: w.GetPlayerTargetPlayer,
    getLastShotVectors: w.GetPlayerLastShotVectors,
    getWeapon: w.GetPlayerWeapon,
    getWeaponData: w.GetPlayerWeaponData,
    getWeaponState: w.GetPlayerWeaponState,
    giveWeapon: w.GivePlayerWeapon,
    setAmmo: w.SetPlayerAmmo,
    getAmmo: w.GetPlayerAmmo,
    setArmedWeapon: w.SetPlayerArmedWeapon,
    sendDeathMessage: w.SendDeathMessage,
    sendDeathMessageToPlayer: w.SendDeathMessageToPlayer,
    setSpawnInfo: w.SetSpawnInfo,
    redirectDownload: w.RedirectDownload,
    sendClientCheck: w.SendClientCheck,
    selectTextDraw: w.SelectTextDraw,
    cancelSelectTextDraw: w.CancelSelectTextDraw,
    beginObjectSelecting: w.BeginObjectSelecting,
    endObjectEditing: w.EndObjectEditing,
    getSurfingObjectID: w.GetPlayerSurfingObjectID,
    getSurfingPlayerObjectID: w.GetPlayerSurfingPlayerObjectID,
    isAttachedObjectSlotUsed: w.IsPlayerAttachedObjectSlotUsed,
    editAttachedObject: w.EditAttachedObject,
    setAttachedObject: w.SetPlayerAttachedObject,
    removeAttachedObject: w.RemovePlayerAttachedObject,
    toggleWidescreen: w.TogglePlayerWidescreen,
    isWidescreenToggled: w.IsPlayerWidescreenToggled,
    getSpawnInfo: w.GetSpawnInfo,
    getSkillLevel: w.GetPlayerSkillLevel,
    isCheckpointActive: w.IsPlayerCheckpointActive,
    getCheckpoint: w.GetPlayerCheckpoint,
    isRaceCheckpointActive: w.IsPlayerRaceCheckpointActive,
    getRaceCheckpoint: w.GetPlayerRaceCheckpoint,
    getWorldBounds: w.GetPlayerWorldBounds,
    isInModShop: w.IsPlayerInModShop,
    getSirenState: w.GetPlayerSirenState,
    getLandingGearState: w.GetPlayerLandingGearState,
    getHydraReactorAngle: w.GetPlayerHydraReactorAngle,
    getTrainSpeed: w.GetPlayerTrainSpeed,
    getZAim: w.GetPlayerZAim,
    getSurfingOffsets: w.GetPlayerSurfingOffsets,
    getRotationQuat: w.GetPlayerRotationQuat,
    getDialogID: w.GetPlayerDialogID,
    getSpectateID: w.GetPlayerSpectateID,
    getSpectateType: w.GetPlayerSpectateType,
    getRawIp: w.GetPlayerRawIp,
    setGravity: w.SetPlayerGravity,
    getGravity: w.GetPlayerGravity,
    setAdmin: w.SetPlayerAdmin,
    isSpawned: w.IsPlayerSpawned,
    isControllable: w.IsPlayerControllable,
    isCameraTargetEnabled: w.IsPlayerCameraTargetEnabled,
    toggleGhostMode: w.TogglePlayerGhostMode,
    getGhostMode: w.GetPlayerGhostMode,
    getBuildingsRemoved: w.GetPlayerBuildingsRemoved,
    getAttachedObject: w.GetPlayerAttachedObject,
    removeWeapon: w.RemovePlayerWeapon,
    isUsingOfficialClient: w.IsPlayerUsingOfficialClient,
    allowWeapons: w.AllowPlayerWeapons,
    areWeaponsAllowed: w.ArePlayerWeaponsAllowed,
    gpci: w.gpci,
    isCuffed: w.IsPlayerCuffed,
    isInDriveByMode: w.IsPlayerInDriveByMode,
    isUsingOmp: w.IsPlayerUsingOmp,
  };
}
