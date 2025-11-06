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
    return Player.__inject__.SendClientMessage(this, color, msg);
  }

  static sendClientMessageToAll(color: string | number, msg: string) {
    Player.__inject__.SendClientMessageToAll(Player.getInstances(), color, msg);
  }

  sendMessageToPlayer(player: Player, message: string): number {
    return Player.__inject__.SendPlayerMessageToPlayer(
      player,
      this.id,
      message,
    );
  }

  sendMessageToAll(message: string): number {
    return Player.__inject__.SendPlayerMessageToAll(
      Player.getInstances(),
      this.id,
      message,
    );
  }

  isNpc(): boolean {
    return Player.__inject__.IsPlayerNPC(this.id);
  }

  // first call will return 0;
  // should be called at one second intervals, implemented internally by throttling
  getFps(): number {
    return this.lastFps;
  }
  getDrunkLevel(): number {
    return Player.__inject__.GetPlayerDrunkLevel(this.id);
  }
  setDrunkLevel(level: number) {
    if (level < 0 || level > 50000) {
      throw new Error("[Player]: player's drunk level ranges from 0 to 50000");
    }
    return Player.__inject__.SetPlayerDrunkLevel(this.id, level);
  }
  allowTeleport(allow: boolean) {
    return Player.__inject__.AllowPlayerTeleport(this.id, allow);
  }
  isTeleportAllowed() {
    return Player.__inject__.IsPlayerTeleportAllowed(this.id);
  }
  enableCameraTarget(enable: boolean) {
    return Player.__inject__.EnablePlayerCameraTarget(this.id, enable);
  }
  enableStuntBonus(enable: boolean) {
    return Player.__inject__.EnableStuntBonusForPlayer(this.id, enable);
  }
  getInterior(): number {
    return Player.__inject__.GetPlayerInterior(this.id);
  }
  setInterior(interiorId: number) {
    return Player.__inject__.SetPlayerInterior(this.id, interiorId);
  }
  showNameTag(showPlayer: Player, show: boolean) {
    return Player.__inject__.ShowPlayerNameTagForPlayer(
      this.id,
      showPlayer.id,
      show,
    );
  }
  setColor(color: string | number) {
    return Player.__inject__.SetPlayerColor(this.id, color);
  }
  getColor(): number {
    return Player.__inject__.GetPlayerColor(this.id);
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
    return Player.__inject__.SetPlayerMapIcon(
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
    return Player.__inject__.RemovePlayerMapIcon(this.id, iconId);
  }
  setMarker(showPlayer: Player, color: string | number) {
    Player.__inject__.SetPlayerMarkerForPlayer(this.id, showPlayer.id, color);
  }
  getMarker(targetPlayer: Player) {
    return Player.__inject__.GetPlayerMarkerForPlayer(this.id, targetPlayer.id);
  }
  resetMoney() {
    return Player.__inject__.ResetPlayerMoney(this.id);
  }
  getMoney(): number {
    return Player.__inject__.GetPlayerMoney(this.id);
  }
  giveMoney(money: number) {
    return Player.__inject__.GivePlayerMoney(this.id, money);
  }
  resetWeapons() {
    return Player.__inject__.ResetPlayerWeapons(this.id);
  }
  spawn(): boolean {
    return Player.__inject__.SpawnPlayer(this.id);
  }
  setHealth(health: number) {
    return Player.__inject__.SetPlayerHealth(this.id, health);
  }
  getHealth() {
    return Player.__inject__.GetPlayerHealth(this.id);
  }
  toggleClock(toggle: boolean) {
    return Player.__inject__.TogglePlayerClock(this.id, toggle);
  }
  toggleControllable(toggle: boolean) {
    return Player.__inject__.TogglePlayerControllable(this.id, toggle);
  }
  toggleSpectating(toggle: boolean) {
    return Player.__inject__.TogglePlayerSpectating(this.id, toggle);
  }
  spectatePlayer(targetPlayer: Player, mode = SpectateModesEnum.NORMAL) {
    return Player.__inject__.PlayerSpectatePlayer(
      this.id,
      targetPlayer.id,
      mode,
    );
  }
  spectateVehicle(targetVehicle: Vehicle, mode = SpectateModesEnum.NORMAL) {
    return Player.__inject__.PlayerSpectateVehicle(
      this.id,
      targetVehicle.id,
      mode,
    );
  }
  forceClassSelection() {
    return Player.__inject__.ForceClassSelection(this.id);
  }
  kick() {
    return Player.__inject__.Kick(this.id);
  }
  ban() {
    return Player.__inject__.Ban(this.id);
  }
  banEx(reason: string, charset: string) {
    return Player.__inject__.BanEx(this.id, reason, charset);
  }
  isAdmin() {
    return Player.__inject__.IsPlayerAdmin(this.id);
  }
  isInRangeOfPoint(range: number, x: number, y: number, z: number) {
    return Player.__inject__.IsPlayerInRangeOfPoint(this.id, range, x, y, z);
  }
  isStreamedIn(forPlayer: Player) {
    return Player.__inject__.IsPlayerStreamedIn(this.id, forPlayer.id);
  }
  setSkin(skinId: number, ignoreRange = false) {
    if (!ignoreRange && (skinId < 0 || skinId > 311 || skinId === 74))
      return false;
    if (this.getHealth().health <= 0) return false;
    if (this.isInAnyVehicle()) return false;
    if (this.getSpecialAction() === SpecialActionsEnum.DUCK) return false;
    return Player.__inject__.SetPlayerSkin(this.id, skinId);
  }
  getSkin(): number {
    return Player.__inject__.GetPlayerSkin(this.id);
  }
  isInAnyVehicle(): boolean {
    return Player.__inject__.IsPlayerInAnyVehicle(this.id);
  }
  getSpecialAction(): SpecialActionsEnum {
    return Player.__inject__.GetPlayerSpecialAction(this.id);
  }
  setSpecialAction(actionId: SpecialActionsEnum) {
    return Player.__inject__.SetPlayerSpecialAction(this.id, actionId);
  }
  setScore(score: number) {
    return Player.__inject__.SetPlayerScore(this.id, score);
  }
  getScore(): number {
    return Player.__inject__.GetPlayerScore(this.id);
  }
  getPing(): number {
    return Player.__inject__.GetPlayerPing(this.id) || 0;
  }
  setPos(x: number, y: number, z: number) {
    return Player.__inject__.SetPlayerPos(this.id, x, y, z);
  }
  getPos() {
    return Player.__inject__.GetPlayerPos(this.id);
  }
  isSpectating(): boolean {
    return this.getState() === PlayerStateEnum.SPECTATING;
  }
  isWasted(): boolean {
    return this.getState() === PlayerStateEnum.WASTED;
  }
  getState(): PlayerStateEnum {
    return Player.__inject__.GetPlayerState(this.id);
  }
  getVersion() {
    return Player.__inject__.GetPlayerVersion(this.id);
  }
  setVirtualWorld(worldId: number) {
    return Player.__inject__.SetPlayerVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    return Player.__inject__.GetPlayerVirtualWorld(this.id);
  }
  removeFromVehicle() {
    return Player.__inject__.RemovePlayerFromVehicle(this.id);
  }
  setWantedLevel(level: number) {
    if (level < 0 || level > 6) {
      throw new Error("[Player]: player's wanted level ranges from 0 to 6");
    }
    return Player.__inject__.SetPlayerWantedLevel(this.id, level);
  }
  getWantedLevel(): number {
    return Player.__inject__.GetPlayerWantedLevel(this.id);
  }
  setFacingAngle(ang: number) {
    return Player.__inject__.SetPlayerFacingAngle(this.id, ang);
  }
  getFacingAngle() {
    return Player.__inject__.GetPlayerFacingAngle(this.id);
  }
  setWeather(weather: number) {
    if (weather < 0 || weather > 255) {
      throw new Error("[Player]: The valid weather value is only 0 to 255");
    }
    return Player.__inject__.SetPlayerWeather(this.id, weather);
  }
  getWeather(): number {
    return Player.__inject__.GetPlayerWeather(this.id);
  }
  setTime(hour: number, minute: number) {
    if (hour < 0 || hour > 23) {
      throw new Error("[Player]: The valid hour value is only 0 to 23");
    }
    if (minute < 0 || minute > 59) {
      throw new Error("[Player]: The valid minute value is only 0 to 59");
    }
    return Player.__inject__.SetPlayerTime(this.id, hour, minute);
  }
  getTime() {
    return Player.__inject__.GetPlayerTime(this.id);
  }
  removeBuilding(
    modelId: number,
    fX: number,
    fY: number,
    fZ: number,
    fRadius: number,
  ) {
    return Player.__inject__.RemoveBuildingForPlayer(
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
    Player.__inject__.SetPlayerTeam(this.id, team);
  }
  getTeam(): number {
    return Player.__inject__.GetPlayerTeam(this.id);
  }
  setSkillLevel(skill: WeaponSkillsEnum, level: number) {
    if (level < 0 || level > 999) {
      throw new Error("[Player]: The valid skill level is only 0 to 999");
    }
    return Player.__inject__.SetPlayerSkillLevel(this.id, skill, level);
  }
  getName() {
    return Player.__inject__.GetPlayerName(this);
  }
  setName(name: string): number {
    return Player.__inject__.SetPlayerName(this, name);
  }
  setVelocity(x: number, y: number, z: number) {
    return Player.__inject__.SetPlayerVelocity(this.id, x, y, z);
  }
  getVelocity() {
    return Player.__inject__.GetPlayerVelocity(this.id);
  }
  getSpeed(magic = 180.0) {
    if (this.id === -1) return 0.0;
    const { x, y, z } = this.getVelocity();
    return VectorSize(x, y, z) * magic;
  }
  getKeys() {
    return Player.__inject__.GetPlayerKeys(this.id);
  }
  getIp() {
    return Player.__inject__.GetPlayerIp(this.id);
  }
  getFightingStyle(): FightingStylesEnum {
    return Player.__inject__.GetPlayerFightingStyle(this.id);
  }
  setFightingStyle(style: FightingStylesEnum) {
    return Player.__inject__.SetPlayerFightingStyle(this.id, style);
  }
  setArmour(armour: number) {
    return Player.__inject__.SetPlayerArmour(this.id, armour);
  }
  getArmour() {
    return Player.__inject__.GetPlayerArmour(this.id);
  }
  setCameraBehind() {
    return Player.__inject__.SetCameraBehindPlayer(this.id);
  }
  setCameraPos(x: number, y: number, z: number) {
    return Player.__inject__.SetPlayerCameraPos(this.id, x, y, z);
  }
  setCameraLookAt(
    x: number,
    y: number,
    z: number,
    style: CameraCutStylesEnum = CameraCutStylesEnum.CUT,
  ) {
    return Player.__inject__.SetPlayerCameraLookAt(this.id, x, y, z, style);
  }
  getCameraAspectRatio(): number {
    return Player.__inject__.GetPlayerCameraAspectRatio(this.id);
  }
  getCameraFrontVector() {
    return Player.__inject__.GetPlayerCameraFrontVector(this.id);
  }
  getCameraMode(): CameraModesEnum {
    return Player.__inject__.GetPlayerCameraMode(this.id);
  }
  getCameraPos() {
    return Player.__inject__.GetPlayerCameraPos(this.id);
  }
  getCameraTargetPlayer(): Player | undefined {
    const target = Player.__inject__.GetPlayerCameraTargetPlayer(this.id);
    return Player.getInstances().find((p) => p.id === target);
  }
  getCameraTargetVehicle(): Vehicle | undefined {
    const target = Player.__inject__.GetPlayerCameraTargetVehicle(this.id);
    return [...vehiclePool.values()].find((v) => v.id === target);
  }
  getCameraZoom(): number {
    return Player.__inject__.GetPlayerCameraZoom(this.id);
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
    return Player.__inject__.PlayAudioStreamForPlayer(
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
    return Player.__inject__.StopAudioStreamForPlayer(this.id);
  }
  playSound(
    soundId: number,
    relativeX = 0.0,
    relativeY = 0.0,
    relativeZ = 0.0,
  ) {
    return Player.__inject__.PlayerPlaySound(
      this.id,
      soundId,
      relativeX,
      relativeY,
      relativeZ,
    );
  }
  static getMaxPlayers(): number {
    return Player.__inject__.GetMaxPlayers();
  }
  playCrimeReport(suspect: Player, crimeId: number) {
    if (crimeId < 3 || crimeId > 22) {
      throw new Error("[Player]: Available crime ids range from 3 to 22");
    }
    return Player.__inject__.PlayCrimeReportForPlayer(
      this.id,
      suspect.id,
      crimeId,
    );
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
    return Player.__inject__.InterpolateCameraPos(
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
    return Player.__inject__.InterpolateCameraLookAt(
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
    return Player.__inject__.CreateExplosionForPlayer(
      this.id,
      x,
      y,
      z,
      type,
      radius,
    );
  }
  static isConnected(id: number): boolean {
    return Player.__inject__.IsPlayerConnected(id);
  }
  isConnected(): boolean {
    return Player.isConnected(this.id);
  }
  disableRemoteVehicleCollisions(disable: boolean) {
    return Player.__inject__.DisableRemoteVehicleCollisions(this.id, disable);
  }
  getVehicle() {
    if (!this.isInAnyVehicle()) return;
    const vehId: number = Player.__inject__.GetPlayerVehicleID(this.id);
    return [...vehiclePool.values()].find((v) => v.id === vehId);
  }
  getVehicleSeat(): number {
    return Player.__inject__.GetPlayerVehicleSeat(this.id);
  }
  getSurfingVehicle() {
    const vehId = Player.__inject__.GetPlayerSurfingVehicleID(this.id);
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
    return Player.__inject__.ApplyAnimation(
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
    return Player.__inject__.ClearAnimations(this.id, forceSync);
  }
  getAnimationIndex(): number {
    return Player.__inject__.GetPlayerAnimationIndex(this.id);
  }
  getAnimationName(index: number = this.getAnimationIndex()) {
    const [animLib, animName] = Player.__inject__.GetAnimationName(index);
    return { index, animLib, animName };
  }
  setShopName(shopName: string) {
    return Player.__inject__.SetPlayerShopName(this.id, shopName);
  }
  setPosFindZ(x: number, y: number, z: number) {
    return Player.__inject__.SetPlayerPosFindZ(this.id, x, y, z);
  }
  setWorldBounds(xMax: number, xMin: number, yMax: number, yMin: number) {
    return Player.__inject__.SetPlayerWorldBounds(
      this.id,
      xMax,
      xMin,
      yMax,
      yMin,
    );
  }
  clearWorldBounds() {
    return Player.__inject__.ClearPlayerWorldBounds(this.id);
  }
  setChatBubble(
    text: string,
    color: string | number,
    drawDistance: number,
    expireTime: number,
    charset = this.charset,
  ) {
    return Player.__inject__.SetPlayerChatBubble(
      this.id,
      text,
      color,
      drawDistance,
      expireTime,
      charset,
    );
  }
  getDistanceFromPoint(x: number, y: number, z: number): number {
    return Player.__inject__.GetPlayerDistanceFromPoint(this.id, x, y, z);
  }
  getCustomSkin(): number {
    return Player.__inject__.GetPlayerCustomSkin(this.id);
  }
  getTargetPlayer(): Player | undefined {
    const pid = Player.__inject__.GetPlayerTargetPlayer(this.id);
    if (pid === InvalidEnum.PLAYER_ID) return;
    return Player.getInstances().find((p) => p.id === pid);
  }
  getLastShotVectors() {
    return Player.__inject__.GetPlayerLastShotVectors(this.id);
  }
  getWeapon(): WeaponEnum | -1 {
    return Player.__inject__.GetPlayerWeapon(this.id);
  }
  getWeaponData(slot: number) {
    return Player.__inject__.GetPlayerWeaponData(this.id, slot);
  }
  getWeaponState(): WeaponStatesEnum {
    return Player.__inject__.GetPlayerWeaponState(this.id);
  }
  giveWeapon(weaponId: WeaponEnum, ammo: number) {
    return Player.__inject__.GivePlayerWeapon(this.id, weaponId, ammo);
  }
  setAmmo(weaponId: number, ammo: number) {
    return Player.__inject__.SetPlayerAmmo(this.id, weaponId, ammo);
  }
  getAmmo(): number {
    return Player.__inject__.GetPlayerAmmo(this.id);
  }
  setArmedWeapon(weaponId: number) {
    return Player.__inject__.SetPlayerArmedWeapon(this.id, weaponId);
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
    return Player.__inject__.SendDeathMessage(
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
    return Player.__inject__.SendDeathMessageToPlayer(
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
    return Player.__inject__.SetSpawnInfo(
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
    return Player.__inject__.RedirectDownload(this.id, url);
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
          "[Player]: An attempt to check the player client response, but the player paused the game",
        );
      }

      const timeoutMsg =
        "[Player]: An attempt to check the player client response timed out";

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

      Player.__inject__.SendClientCheck(
        this.id,
        type,
        memAddr,
        memOffset,
        byteCount,
      );
    });
  }
  selectTextDraw(color: string | number): void {
    Player.__inject__.SelectTextDraw(this.id, color);
  }
  cancelSelectTextDraw(): void {
    Player.__inject__.CancelSelectTextDraw(this.id);
  }
  beginObjectSelecting() {
    return Player.__inject__.BeginObjectSelecting(this.id);
  }
  endObjectEditing() {
    return Player.__inject__.EndObjectEditing(this.id);
  }
  getSurfingObject() {
    const id: number = Player.__inject__.GetPlayerSurfingObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return ObjectMp.getInstance(id);
  }
  getSurfingPlayerObject() {
    const id: number = Player.__inject__.GetPlayerSurfingPlayerObjectID(
      this.id,
    );
    if (id === InvalidEnum.OBJECT_ID) return;
    return ObjectMp.getInstance(id, this);
  }
  isAttachedObjectSlotUsed(index: number): boolean {
    return Player.__inject__.IsPlayerAttachedObjectSlotUsed(this.id, index);
  }
  editAttachedObject(index: number) {
    return Player.__inject__.EditAttachedObject(this.id, index);
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
    return Player.__inject__.SetPlayerAttachedObject(
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
    return Player.__inject__.RemovePlayerAttachedObject(this.id, index);
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
    return Player.__inject__.TogglePlayerWidescreen(this.id, set);
  }
  isWidescreenToggled(): boolean {
    return Player.__inject__.IsPlayerWidescreenToggled(this.id);
  }
  getSpawnInfo() {
    return Player.__inject__.GetSpawnInfo(this.id);
  }
  getSkillLevel(skill: WeaponSkillsEnum): number {
    return Player.__inject__.GetPlayerSkillLevel(this.id, skill);
  }
  isCheckpointActive(): boolean {
    return Player.__inject__.IsPlayerCheckpointActive(this.id);
  }
  getCheckpoint() {
    return Player.__inject__.GetPlayerCheckpoint(this.id);
  }
  isRaceCheckpointActive(): boolean {
    return Player.__inject__.IsPlayerRaceCheckpointActive(this.id);
  }
  getRaceCheckpoint() {
    return Player.__inject__.GetPlayerRaceCheckpoint(this.id);
  }
  getWorldBounds() {
    return Player.__inject__.GetPlayerWorldBounds(this.id);
  }
  isInModShop(): boolean {
    return Player.__inject__.IsPlayerInModShop(this.id);
  }
  getSirenState(): number {
    return Player.__inject__.GetPlayerSirenState(this.id);
  }
  getLandingGearState(): number {
    return Player.__inject__.GetPlayerLandingGearState(this.id);
  }
  getHydraReactorAngle(): number {
    return Player.__inject__.GetPlayerHydraReactorAngle(this.id);
  }
  getTrainSpeed(): number {
    return Player.__inject__.GetPlayerTrainSpeed(this.id);
  }
  getZAim(): number {
    return Player.__inject__.GetPlayerZAim(this.id);
  }
  getSurfingOffsets() {
    return Player.__inject__.GetPlayerSurfingOffsets(this.id);
  }
  getRotationQuat() {
    return Player.__inject__.GetPlayerRotationQuat(this.id);
  }
  getDialogID(): number {
    return Player.__inject__.GetPlayerDialogID(this.id);
  }
  getSpectateID(): number {
    return Player.__inject__.GetPlayerSpectateID(this.id);
  }
  getSpectateType(): SpectateModesEnum {
    return Player.__inject__.GetPlayerSpectateType(this.id);
  }
  getRawIp(): string {
    return Player.__inject__.GetPlayerRawIp(this.id);
  }
  setGravity(gravity: number) {
    return Player.__inject__.SetPlayerGravity(this.id, gravity);
  }
  getGravity(): number {
    return Player.__inject__.GetPlayerGravity(this.id);
  }
  setAdmin(admin: boolean) {
    return Player.__inject__.SetPlayerAdmin(this.id, admin);
  }
  isSpawned(): boolean {
    return Player.__inject__.IsPlayerSpawned(this.id);
  }
  isControllable(): boolean {
    return Player.__inject__.IsPlayerControllable(this.id);
  }
  isCameraTargetEnabled(): boolean {
    return Player.__inject__.IsPlayerCameraTargetEnabled(this.id);
  }
  toggleGhostMode(toggle: boolean) {
    return Player.__inject__.TogglePlayerGhostMode(this.id, toggle);
  }
  getGhostMode(): boolean {
    return Player.__inject__.GetPlayerGhostMode(this.id);
  }
  getBuildingsRemoved(): number {
    return Player.__inject__.GetPlayerBuildingsRemoved(this.id);
  }
  getAttachedObject(index: number) {
    return Player.__inject__.GetPlayerAttachedObject(this.id, index);
  }
  removeWeapon(weaponId: number) {
    return Player.__inject__.RemovePlayerWeapon(this.id, weaponId);
  }
  isUsingOfficialClient() {
    return Player.__inject__.IsPlayerUsingOfficialClient(this.id);
  }
  allowWeapons(allow: boolean) {
    return Player.__inject__.AllowPlayerWeapons(this.id, allow);
  }
  areWeaponsAllowed() {
    return Player.__inject__.ArePlayerWeaponsAllowed(this.id);
  }
  gpci(charset: string = this.charset) {
    return Player.__inject__.gpci(this.id, charset);
  }
  isCuffed() {
    return Player.__inject__.IsPlayerCuffed(this.id);
  }
  isInDriveByMode() {
    return Player.__inject__.IsPlayerInDriveByMode(this.id);
  }
  isAndroid() {
    return this.isConnected() && this[internalPlayerProps].isAndroid;
  }
  isPC() {
    return this.isConnected() && !this[internalPlayerProps].isAndroid;
  }
  isUsingOmp() {
    return Player.__inject__.IsPlayerUsingOmp(this.id);
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
    SendClientMessage: h.SendClientMessage,
    SendClientMessageToAll: h.SendClientMessageToAll,
    SendPlayerMessageToPlayer: h.SendPlayerMessageToPlayer,
    SendPlayerMessageToAll: h.SendPlayerMessageToAll,
    BanEx: h.BanEx,
    GetPlayerName: h.GetPlayerName,
    SetPlayerName: h.SetPlayerName,
    SetPlayerChatBubble: h.SetPlayerChatBubble,

    IsPlayerNPC: w.IsPlayerNPC,
    GetPlayerDrunkLevel: w.GetPlayerDrunkLevel,
    SetPlayerDrunkLevel: w.SetPlayerDrunkLevel,
    AllowPlayerTeleport: w.AllowPlayerTeleport,
    IsPlayerTeleportAllowed: w.IsPlayerTeleportAllowed,
    EnablePlayerCameraTarget: w.EnablePlayerCameraTarget,
    EnableStuntBonusForPlayer: w.EnableStuntBonusForPlayer,
    GetPlayerInterior: w.GetPlayerInterior,
    SetPlayerInterior: w.SetPlayerInterior,
    ShowPlayerNameTagForPlayer: w.ShowPlayerNameTagForPlayer,
    SetPlayerColor: w.SetPlayerColor,
    GetPlayerColor: w.GetPlayerColor,
    SetPlayerMapIcon: w.SetPlayerMapIcon,
    RemovePlayerMapIcon: w.RemovePlayerMapIcon,
    SetPlayerMarkerForPlayer: w.SetPlayerMarkerForPlayer,
    GetPlayerMarkerForPlayer: w.GetPlayerMarkerForPlayer,
    ResetPlayerMoney: w.ResetPlayerMoney,
    GetPlayerMoney: w.GetPlayerMoney,
    GivePlayerMoney: w.GivePlayerMoney,
    ResetPlayerWeapons: w.ResetPlayerWeapons,
    SpawnPlayer: w.SpawnPlayer,
    SetPlayerHealth: w.SetPlayerHealth,
    GetPlayerHealth: w.GetPlayerHealth,
    TogglePlayerClock: w.TogglePlayerClock,
    TogglePlayerControllable: w.TogglePlayerControllable,
    TogglePlayerSpectating: w.TogglePlayerSpectating,
    PlayerSpectatePlayer: w.PlayerSpectatePlayer,
    PlayerSpectateVehicle: w.PlayerSpectateVehicle,
    ForceClassSelection: w.ForceClassSelection,
    Kick: w.Kick,
    Ban: w.Ban,
    IsPlayerAdmin: w.IsPlayerAdmin,
    IsPlayerInRangeOfPoint: w.IsPlayerInRangeOfPoint,
    IsPlayerStreamedIn: w.IsPlayerStreamedIn,
    SetPlayerSkin: w.SetPlayerSkin,
    GetPlayerSkin: w.GetPlayerSkin,
    IsPlayerInAnyVehicle: w.IsPlayerInAnyVehicle,
    GetPlayerSpecialAction: w.GetPlayerSpecialAction,
    SetPlayerSpecialAction: w.SetPlayerSpecialAction,
    SetPlayerScore: w.SetPlayerScore,
    GetPlayerScore: w.GetPlayerScore,
    GetPlayerPing: w.GetPlayerPing,
    SetPlayerPos: w.SetPlayerPos,
    GetPlayerPos: w.GetPlayerPos,
    GetPlayerState: w.GetPlayerState,
    GetPlayerVersion: w.GetPlayerVersion,
    SetPlayerVirtualWorld: w.SetPlayerVirtualWorld,
    GetPlayerVirtualWorld: w.GetPlayerVirtualWorld,
    RemovePlayerFromVehicle: w.RemovePlayerFromVehicle,
    SetPlayerWantedLevel: w.SetPlayerWantedLevel,
    GetPlayerWantedLevel: w.GetPlayerWantedLevel,
    SetPlayerFacingAngle: w.SetPlayerFacingAngle,
    GetPlayerFacingAngle: w.GetPlayerFacingAngle,
    SetPlayerWeather: w.SetPlayerWeather,
    GetPlayerWeather: w.GetPlayerWeather,
    SetPlayerTime: w.SetPlayerTime,
    GetPlayerTime: w.GetPlayerTime,
    RemoveBuildingForPlayer: w.RemoveBuildingForPlayer,
    SetPlayerTeam: w.SetPlayerTeam,
    GetPlayerTeam: w.GetPlayerTeam,
    SetPlayerSkillLevel: w.SetPlayerSkillLevel,
    SetPlayerVelocity: w.SetPlayerVelocity,
    GetPlayerVelocity: w.GetPlayerVelocity,
    GetPlayerKeys: w.GetPlayerKeys,
    GetPlayerIp: w.GetPlayerIp,
    GetPlayerFightingStyle: w.GetPlayerFightingStyle,
    SetPlayerFightingStyle: w.SetPlayerFightingStyle,
    SetPlayerArmour: w.SetPlayerArmour,
    GetPlayerArmour: w.GetPlayerArmour,
    SetCameraBehindPlayer: w.SetCameraBehindPlayer,
    SetPlayerCameraPos: w.SetPlayerCameraPos,
    SetPlayerCameraLookAt: w.SetPlayerCameraLookAt,
    GetPlayerCameraAspectRatio: w.GetPlayerCameraAspectRatio,
    GetPlayerCameraFrontVector: w.GetPlayerCameraFrontVector,
    GetPlayerCameraMode: w.GetPlayerCameraMode,
    GetPlayerCameraPos: w.GetPlayerCameraPos,
    GetPlayerCameraTargetPlayer: w.GetPlayerCameraTargetPlayer,
    GetPlayerCameraTargetVehicle: w.GetPlayerCameraTargetVehicle,
    GetPlayerCameraZoom: w.GetPlayerCameraZoom,
    PlayAudioStreamForPlayer: w.PlayAudioStreamForPlayer,
    StopAudioStreamForPlayer: w.StopAudioStreamForPlayer,
    PlayerPlaySound: w.PlayerPlaySound,
    GetMaxPlayers: w.GetMaxPlayers,
    PlayCrimeReportForPlayer: w.PlayCrimeReportForPlayer,
    InterpolateCameraPos: w.InterpolateCameraPos,
    InterpolateCameraLookAt: w.InterpolateCameraLookAt,
    CreateExplosionForPlayer: w.CreateExplosionForPlayer,
    IsPlayerConnected: w.IsPlayerConnected,
    DisableRemoteVehicleCollisions: w.DisableRemoteVehicleCollisions,
    GetPlayerVehicleID: w.GetPlayerVehicleID,
    GetPlayerVehicleSeat: w.GetPlayerVehicleSeat,
    GetPlayerSurfingVehicleID: w.GetPlayerSurfingVehicleID,
    ApplyAnimation: w.ApplyAnimation,
    ClearAnimations: w.ClearAnimations,
    GetPlayerAnimationIndex: w.GetPlayerAnimationIndex,
    GetAnimationName: w.GetAnimationName,
    SetPlayerShopName: w.SetPlayerShopName,
    SetPlayerPosFindZ: w.SetPlayerPosFindZ,
    SetPlayerWorldBounds: w.SetPlayerWorldBounds,
    ClearPlayerWorldBounds: w.ClearPlayerWorldBounds,
    GetPlayerDistanceFromPoint: w.GetPlayerDistanceFromPoint,
    GetPlayerCustomSkin: w.GetPlayerCustomSkin,
    GetPlayerTargetPlayer: w.GetPlayerTargetPlayer,
    GetPlayerLastShotVectors: w.GetPlayerLastShotVectors,
    GetPlayerWeapon: w.GetPlayerWeapon,
    GetPlayerWeaponData: w.GetPlayerWeaponData,
    GetPlayerWeaponState: w.GetPlayerWeaponState,
    GivePlayerWeapon: w.GivePlayerWeapon,
    SetPlayerAmmo: w.SetPlayerAmmo,
    GetPlayerAmmo: w.GetPlayerAmmo,
    SetPlayerArmedWeapon: w.SetPlayerArmedWeapon,
    SendDeathMessage: w.SendDeathMessage,
    SendDeathMessageToPlayer: w.SendDeathMessageToPlayer,
    SetSpawnInfo: w.SetSpawnInfo,
    RedirectDownload: w.RedirectDownload,
    SendClientCheck: w.SendClientCheck,
    SelectTextDraw: w.SelectTextDraw,
    CancelSelectTextDraw: w.CancelSelectTextDraw,
    BeginObjectSelecting: w.BeginObjectSelecting,
    EndObjectEditing: w.EndObjectEditing,
    GetPlayerSurfingObjectID: w.GetPlayerSurfingObjectID,
    GetPlayerSurfingPlayerObjectID: w.GetPlayerSurfingPlayerObjectID,
    IsPlayerAttachedObjectSlotUsed: w.IsPlayerAttachedObjectSlotUsed,
    EditAttachedObject: w.EditAttachedObject,
    SetPlayerAttachedObject: w.SetPlayerAttachedObject,
    RemovePlayerAttachedObject: w.RemovePlayerAttachedObject,
    TogglePlayerWidescreen: w.TogglePlayerWidescreen,
    IsPlayerWidescreenToggled: w.IsPlayerWidescreenToggled,
    GetSpawnInfo: w.GetSpawnInfo,
    GetPlayerSkillLevel: w.GetPlayerSkillLevel,
    IsPlayerCheckpointActive: w.IsPlayerCheckpointActive,
    GetPlayerCheckpoint: w.GetPlayerCheckpoint,
    IsPlayerRaceCheckpointActive: w.IsPlayerRaceCheckpointActive,
    GetPlayerRaceCheckpoint: w.GetPlayerRaceCheckpoint,
    GetPlayerWorldBounds: w.GetPlayerWorldBounds,
    IsPlayerInModShop: w.IsPlayerInModShop,
    GetPlayerSirenState: w.GetPlayerSirenState,
    GetPlayerLandingGearState: w.GetPlayerLandingGearState,
    GetPlayerHydraReactorAngle: w.GetPlayerHydraReactorAngle,
    GetPlayerTrainSpeed: w.GetPlayerTrainSpeed,
    GetPlayerZAim: w.GetPlayerZAim,
    GetPlayerSurfingOffsets: w.GetPlayerSurfingOffsets,
    GetPlayerRotationQuat: w.GetPlayerRotationQuat,
    GetPlayerDialogID: w.GetPlayerDialogID,
    GetPlayerSpectateID: w.GetPlayerSpectateID,
    GetPlayerSpectateType: w.GetPlayerSpectateType,
    GetPlayerRawIp: w.GetPlayerRawIp,
    SetPlayerGravity: w.SetPlayerGravity,
    GetPlayerGravity: w.GetPlayerGravity,
    SetPlayerAdmin: w.SetPlayerAdmin,
    IsPlayerSpawned: w.IsPlayerSpawned,
    IsPlayerControllable: w.IsPlayerControllable,
    IsPlayerCameraTargetEnabled: w.IsPlayerCameraTargetEnabled,
    TogglePlayerGhostMode: w.TogglePlayerGhostMode,
    GetPlayerGhostMode: w.GetPlayerGhostMode,
    GetPlayerBuildingsRemoved: w.GetPlayerBuildingsRemoved,
    GetPlayerAttachedObject: w.GetPlayerAttachedObject,
    RemovePlayerWeapon: w.RemovePlayerWeapon,
    IsPlayerUsingOfficialClient: w.IsPlayerUsingOfficialClient,
    AllowPlayerWeapons: w.AllowPlayerWeapons,
    ArePlayerWeaponsAllowed: w.ArePlayerWeaponsAllowed,
    gpci: w.gpci,
    IsPlayerCuffed: w.IsPlayerCuffed,
    IsPlayerInDriveByMode: w.IsPlayerInDriveByMode,
    IsPlayerUsingOmp: w.IsPlayerUsingOmp,
  };
}
