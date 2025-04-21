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
} from "../../enums";

import type { IClientResRaw } from "../../interfaces";
import type { TPos } from "../../types";
import { isValidAnimateName } from "../../utils/animateUtils";
import * as h from "../../utils/helperUtils";

import { Vehicle } from "../vehicle/entity";
import type { DynamicObject } from "core/wrapper/streamer";
import { defineEvent } from "../bus";
import { VectorSize } from "core/wrapper/native";
import { IInnerPlayerProps, innerPlayerProps, playerPool } from "./pool";

export const [onCheckResponse] = defineEvent({
  name: "OnClientCheckResponse",
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
  [innerPlayerProps]: IInnerPlayerProps = {
    isAndroid: true,
  };

  static readonly players = playerPool;
  static MAX_CHECK_ANDROID_DELAY = 10; // 10s
  static SKIP_CHECK_ANDROID = false;

  private _charset = "ISO-8859-1";
  private _locale = "en_US";

  lastDrunkLevel = 0;
  lastFps = 0;
  lastUpdateTick = 0;
  lastUpdateFpsTick = 0;

  isPaused = false;

  isRecording = false;

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
    const player = Player.getInstance(id);
    if (player) return player;
  }

  sendClientMessage(color: string | number, msg: string): number {
    return h.SendClientMessage(this, color, msg);
  }

  static sendClientMessageToAll(color: string | number, msg: string) {
    h.SendClientMessageToAll(Player.getInstances(), color, msg);
  }

  sendMessageToPlayer(player: Player, message: string): number {
    return h.SendPlayerMessageToPlayer(player, this.id, message);
  }

  sendMessageToAll(message: string): number {
    return h.SendPlayerMessageToAll(Player.getInstances(), this.id, message);
  }

  isNpc(): boolean {
    return w.IsPlayerNPC(this.id);
  }

  // first call will return 0;
  // should be called at one second intervals, implemented internally by throttling
  getFps(): number {
    return this.lastFps;
  }
  getDrunkLevel(): number {
    return w.GetPlayerDrunkLevel(this.id);
  }
  setDrunkLevel(level: number) {
    if (level < 0 || level > 50000) {
      throw new Error("[Player]: player's drunk level ranges from 0 to 50000");
    }
    return w.SetPlayerDrunkLevel(this.id, level);
  }
  allowTeleport(allow: boolean) {
    return w.AllowPlayerTeleport(this.id, allow);
  }
  isTeleportAllowed() {
    return w.IsPlayerTeleportAllowed(this.id);
  }
  enableCameraTarget(enable: boolean) {
    return w.EnablePlayerCameraTarget(this.id, enable);
  }
  enableStuntBonus(enable: boolean) {
    return w.EnableStuntBonusForPlayer(this.id, enable);
  }
  getInterior(): number {
    return w.GetPlayerInterior(this.id);
  }
  setInterior(interiorId: number) {
    return w.SetPlayerInterior(this.id, interiorId);
  }
  showNameTag(showPlayer: Player, show: boolean) {
    return w.ShowPlayerNameTagForPlayer(this.id, showPlayer.id, show);
  }
  setColor(color: string | number) {
    return w.SetPlayerColor(this.id, color);
  }
  getColor(): number {
    return w.GetPlayerColor(this.id);
  }
  setMarker(showPlayer: Player, color: string | number) {
    w.SetPlayerMarkerForPlayer(this.id, showPlayer.id, color);
  }
  getMarker(targetPlayer: Player) {
    return w.GetPlayerMarkerForPlayer(this.id, targetPlayer.id);
  }
  resetMoney() {
    return w.ResetPlayerMoney(this.id);
  }
  getMoney(): number {
    return w.GetPlayerMoney(this.id);
  }
  giveMoney(money: number) {
    return w.GivePlayerMoney(this.id, money);
  }
  resetWeapons() {
    return w.ResetPlayerWeapons(this.id);
  }
  spawn(): number {
    if (this.isSpectating()) {
      this.toggleSpectating(false);
      return 1;
    }
    return w.SpawnPlayer(this.id);
  }
  setHealth(health: number) {
    return w.SetPlayerHealth(this.id, health);
  }
  getHealth(): number {
    return w.GetPlayerHealth(this.id);
  }
  toggleClock(toggle: boolean) {
    return w.TogglePlayerClock(this.id, toggle);
  }
  toggleControllable(toggle: boolean) {
    return w.TogglePlayerControllable(this.id, toggle);
  }
  toggleSpectating(toggle: boolean) {
    return w.TogglePlayerSpectating(this.id, toggle);
  }
  spectatePlayer(targetPlayer: Player, mode = SpectateModesEnum.NORMAL) {
    return w.PlayerSpectatePlayer(this.id, targetPlayer.id, mode);
  }
  spectateVehicle(targetVehicle: Vehicle, mode = SpectateModesEnum.NORMAL) {
    return w.PlayerSpectateVehicle(this.id, targetVehicle.id, mode);
  }
  forceClassSelection() {
    return w.ForceClassSelection(this.id);
  }
  kick() {
    return w.Kick(this.id);
  }
  ban() {
    return w.Ban(this.id);
  }
  banEx(reason: string, charset: string) {
    return h.BanEx(this.id, reason, charset);
  }
  isAdmin() {
    return w.IsPlayerAdmin(this.id);
  }
  isInRangeOfPoint(range: number, x: number, y: number, z: number) {
    return w.IsPlayerInRangeOfPoint(this.id, range, x, y, z);
  }
  isStreamedIn(forPlayer: Player) {
    return w.IsPlayerStreamedIn(this.id, forPlayer.id);
  }
  setSkin(skinId: number, ignoreRange = false) {
    if (!ignoreRange && (skinId < 0 || skinId > 311 || skinId === 74))
      return false;
    if (this.getHealth() <= 0) return false;
    if (this.isInAnyVehicle()) return false;
    if (this.getSpecialAction() === SpecialActionsEnum.DUCK) return false;
    return w.SetPlayerSkin(this.id, skinId);
  }
  getSkin(): number {
    return w.GetPlayerSkin(this.id);
  }
  isInAnyVehicle(): boolean {
    return w.IsPlayerInAnyVehicle(this.id);
  }
  getSpecialAction(): SpecialActionsEnum {
    return w.GetPlayerSpecialAction(this.id);
  }
  setSpecialAction(actionId: SpecialActionsEnum) {
    return w.SetPlayerSpecialAction(this.id, actionId);
  }
  setScore(score: number) {
    return w.SetPlayerScore(this.id, score);
  }
  getScore(): number {
    return w.GetPlayerScore(this.id);
  }
  getPing(): number {
    return w.GetPlayerPing(this.id) || 0;
  }
  setPos(x: number, y: number, z: number) {
    return w.SetPlayerPos(this.id, x, y, z);
  }
  getPos(): TPos | undefined {
    if (
      this.isSpectating() ||
      this.isWasted() ||
      this.getState() === PlayerStateEnum.NONE
    )
      return undefined;
    const [x, y, z] = w.GetPlayerPos(this.id);
    return { x, y, z };
  }
  isSpectating(): boolean {
    return this.getState() === PlayerStateEnum.SPECTATING;
  }
  isWasted(): boolean {
    return this.getState() === PlayerStateEnum.WASTED;
  }
  getState(): PlayerStateEnum {
    return w.GetPlayerState(this.id);
  }
  getVersion(): string {
    if (this.isNpc()) return "";
    return w.GetPlayerVersion(this.id);
  }
  setVirtualWorld(worldId: number) {
    return w.SetPlayerVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    return w.GetPlayerVirtualWorld(this.id);
  }
  removeFromVehicle() {
    return w.RemovePlayerFromVehicle(this.id);
  }
  setWantedLevel(level: number) {
    if (level < 0 || level > 6) {
      throw new Error("[Player]: player's wanted level ranges from 0 to 6");
    }
    return w.SetPlayerWantedLevel(this.id, level);
  }
  getWantedLevel(): number {
    return w.GetPlayerWantedLevel(this.id);
  }
  setFacingAngle(ang: number) {
    return w.SetPlayerFacingAngle(this.id, ang);
  }
  getFacingAngle(): number {
    return w.GetPlayerFacingAngle(this.id);
  }
  setWeather(weather: number) {
    if (weather < 0 || weather > 255) {
      throw new Error("[Player]: The valid weather value is only 0 to 255");
    }
    return w.SetPlayerWeather(this.id, weather);
  }
  getWeather(): number {
    return w.GetPlayerWeather(this.id);
  }
  setTime(hour: number, minute: number) {
    if (hour < 0 || hour > 23) {
      throw new Error("[Player]: The valid hour value is only 0 to 23");
    }
    if (minute < 0 || minute > 59) {
      throw new Error("[Player]: The valid minute value is only 0 to 59");
    }
    return w.SetPlayerTime(this.id, hour, minute);
  }
  getTime() {
    const [hour, minute] = w.GetPlayerTime(this.id);
    return { hour, minute };
  }
  removeBuilding(
    modelId: number,
    fX: number,
    fY: number,
    fZ: number,
    fRadius: number,
  ) {
    return w.RemoveBuildingForPlayer(this.id, modelId, fX, fY, fZ, fRadius);
  }
  setTeam(team: number): void {
    if (team < 0 || team > InvalidEnum.NO_TEAM) return;
    w.SetPlayerTeam(this.id, team);
  }
  getTeam(): number {
    return w.GetPlayerTeam(this.id);
  }
  setSkillLevel(skill: WeaponSkillsEnum, level: number) {
    if (level < 0 || level > 999) {
      throw new Error("[Player]: The valid skill level is only 0 to 999");
    }
    return w.SetPlayerSkillLevel(this.id, skill, level);
  }
  getName(): string {
    return h.GetPlayerName(this);
  }
  setName(name: string): number {
    return h.SetPlayerName(this, name);
  }
  setVelocity(x: number, y: number, z: number) {
    return w.SetPlayerVelocity(this.id, x, y, z);
  }
  getVelocity(): TPos {
    const [x, y, z] = w.GetPlayerVelocity(this.id);
    return { x, y, z };
  }
  getSpeed(magic = 180.0) {
    if (this.id === -1) return 0.0;
    const { x, y, z } = this.getVelocity()!;
    return VectorSize(x, y, z) * magic;
  }
  getKeys() {
    const [keys, upDown, leftRight] = w.GetPlayerKeys(this.id);
    return { keys, upDown, leftRight };
  }
  getIp(): string {
    return w.GetPlayerIp(this.id);
  }
  getFightingStyle(): FightingStylesEnum {
    return w.GetPlayerFightingStyle(this.id);
  }
  setFightingStyle(style: FightingStylesEnum) {
    return w.SetPlayerFightingStyle(this.id, style);
  }
  setArmour(armour: number) {
    return w.SetPlayerArmour(this.id, armour);
  }
  getArmour(): number {
    return w.GetPlayerArmour(this.id);
  }
  setCameraBehind() {
    return w.SetCameraBehindPlayer(this.id);
  }
  setCameraPos(x: number, y: number, z: number) {
    return w.SetPlayerCameraPos(this.id, x, y, z);
  }
  setCameraLookAt(
    x: number,
    y: number,
    z: number,
    style: CameraCutStylesEnum = CameraCutStylesEnum.CUT,
  ) {
    return w.SetPlayerCameraLookAt(this.id, x, y, z, style);
  }
  getCameraAspectRatio(): number {
    return w.GetPlayerCameraAspectRatio(this.id);
  }
  getCameraFrontVector(): TPos {
    const [x, y, z] = w.GetPlayerCameraFrontVector(this.id);
    return { x, y, z };
  }
  getCameraMode(): CameraModesEnum {
    return w.GetPlayerCameraMode(this.id);
  }
  getCameraPos(): TPos {
    const [x, y, z] = w.GetPlayerCameraPos(this.id);
    return { x, y, z };
  }
  getCameraTargetPlayer(): Player | undefined {
    const target = w.GetPlayerCameraTargetPlayer(this.id);
    return Player.getInstances().find((p) => p.id === target);
  }
  getCameraTargetVehicle() {
    const target = w.GetPlayerCameraTargetVehicle(this.id);
    return Vehicle.getInstances().find((v) => v.id === target);
  }
  getCameraZoom(): number {
    return w.GetPlayerCameraZoom(this.id);
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
    return w.PlayAudioStreamForPlayer(
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
    return w.StopAudioStreamForPlayer(this.id);
  }
  playSound(
    soundid: number,
    relativeX = 0.0,
    relativeY = 0.0,
    relativeZ = 0.0,
  ) {
    return w.PlayerPlaySound(this.id, soundid, relativeX, relativeY, relativeZ);
  }
  static getMaxPlayers(): number {
    return w.GetMaxPlayers();
  }
  playCrimeReport(suspect: Player, crimeId: number) {
    if (crimeId < 3 || crimeId > 22) {
      throw new Error("[Player]: Available crime ids range from 3 to 22");
    }
    return w.PlayCrimeReportForPlayer(this.id, suspect.id, crimeId);
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
    return w.InterpolateCameraPos(
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
    return w.InterpolateCameraLookAt(
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
    Radius: number,
  ) {
    if (type < 0 || type > 13) {
      throw new Error(
        "[Player]: The valid explosion type value is only 0 to 13",
      );
    }
    return w.CreateExplosionForPlayer(this.id, x, y, z, type, Radius);
  }
  static isConnected(id: number): boolean {
    return w.IsPlayerConnected(id);
  }
  isConnected(): boolean {
    return w.IsPlayerConnected(this.id);
  }
  disableRemoteVehicleCollisions(disable: boolean) {
    return w.DisableRemoteVehicleCollisions(this.id, disable);
  }
  getVehicle() {
    if (!this.isInAnyVehicle()) return undefined;
    const vehId: number = w.GetPlayerVehicleID(this.id);
    return Vehicle.getInstances().find((v) => v.id === vehId);
  }
  getVehicleSeat(): number {
    return w.GetPlayerVehicleSeat(this.id);
  }
  getSurfingVehicle() {
    const vehId = w.GetPlayerSurfingVehicleID(this.id);
    if (vehId === InvalidEnum.VEHICLE_ID) return undefined;
    return Vehicle.getInstances().find((v) => v.id === vehId);
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
      throw new Error("[Player]: Invalid anim library or name");
    }
    return w.ApplyAnimation(
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
    return w.ClearAnimations(this.id, forceSync);
  }
  getAnimationIndex(): number {
    return w.GetPlayerAnimationIndex(this.id);
  }
  getAnimationName(index: number = this.getAnimationIndex()) {
    const [animLib, animName] = w.GetAnimationName(index);
    return { index, animLib, animName };
  }
  setShopName(shopName: string) {
    return w.SetPlayerShopName(this.id, shopName);
  }
  setPosFindZ(x: number, y: number, z = 150) {
    return new Promise<boolean>((resolve) => {
      w.SetPlayerPos(this.id, x, y, z);
      setTimeout(() => resolve(w.SetPlayerPosFindZ(this.id, x, y, z)));
    });
  }
  setWorldBounds(xMax: number, xMin: number, yMax: number, yMin: number) {
    return w.SetPlayerWorldBounds(this.id, xMax, xMin, yMax, yMin);
  }
  clearWorldBounds() {
    return w.ClearPlayerWorldBounds(this.id);
  }
  setChatBubble(
    text: string,
    color: string | number,
    drawDistance: number,
    expireTime: number,
    charset = this.charset,
  ) {
    return h.SetPlayerChatBubble(
      this.id,
      text,
      color,
      drawDistance,
      expireTime,
      charset,
    );
  }
  getDistanceFromPoint(x: number, y: number, z: number): number {
    return w.GetPlayerDistanceFromPoint(this.id, x, y, z);
  }
  getCustomSkin(): number {
    return w.GetPlayerCustomSkin(this.id);
  }
  getTargetPlayer(): Player | undefined {
    const pid = w.GetPlayerTargetPlayer(this.id);
    if (pid === InvalidEnum.PLAYER_ID) return undefined;
    return Player.getInstances().find((p) => p.id === pid);
  }
  getLastShotVectors() {
    const [fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ] =
      w.GetPlayerLastShotVectors(this.id);
    return { fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ };
  }
  getWeapon(): WeaponEnum | -1 {
    return w.GetPlayerWeapon(this.id);
  }
  getWeaponData(slot: number) {
    if (slot < 0 || slot > 12) {
      throw new Error("[Player]: weapon slots range from 0 to 12");
    }
    const [weapons, ammo] = w.GetPlayerWeaponData(this.id, slot);
    return { weapons, ammo };
  }
  getWeaponState(): WeaponStatesEnum {
    return w.GetPlayerWeaponState(this.id);
  }
  giveWeapon(weaponId: WeaponEnum, ammo: number) {
    return w.GivePlayerWeapon(this.id, weaponId, ammo);
  }
  setAmmo(weaponId: number, ammo: number) {
    return w.SetPlayerAmmo(this.id, weaponId, ammo);
  }
  getAmmo(): number {
    return w.GetPlayerAmmo(this.id);
  }
  setArmedWeapon(weaponId: number) {
    return w.SetPlayerArmedWeapon(this.id, weaponId);
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
    return w.SendDeathMessage(
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
    return w.SendDeathMessageToPlayer(
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
    return w.SetSpawnInfo(
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
    return w.RedirectDownload(this.id, url);
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

      w.SendClientCheck(this.id, type, memAddr, memOffset, byteCount);
    });
  }
  selectTextDraw(color: string | number): void {
    w.SelectTextDraw(this.id, color);
  }
  cancelSelectTextDraw(): void {
    w.CancelSelectTextDraw(this.id);
  }
  beginObjectSelecting() {
    return w.BeginObjectSelecting(this.id);
  }
  endObjectEditing() {
    return w.EndObjectEditing(this.id);
  }
  getSurfingObject(objects: Map<number, DynamicObject>): void | DynamicObject {
    const id: number = w.GetPlayerSurfingObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return objects.get(id);
  }
  getSurfingPlayerObject(
    objects: Map<number, DynamicObject>,
  ): void | DynamicObject {
    const id: number = w.GetPlayerSurfingPlayerObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return objects.get(id);
  }
  isAttachedObjectSlotUsed(index: number): boolean {
    return w.IsPlayerAttachedObjectSlotUsed(this.id, index);
  }
  editAttachedObject(index: number) {
    return w.EditAttachedObject(this.id, index);
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
    return w.SetPlayerAttachedObject(
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
  removeAttachedObject(index: number): number {
    if (!this.isAttachedObjectSlotUsed(index)) return 0;
    return w.RemovePlayerAttachedObject(this.id, index);
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
    return w.TogglePlayerWidescreen(this.id, set);
  }
  isWidescreenToggled(): boolean {
    return w.IsPlayerWidescreenToggled(this.id);
  }
  getSpawnInfo() {
    return w.GetSpawnInfo(this.id);
  }
  getSkillLevel(skill: WeaponSkillsEnum): number {
    return w.GetPlayerSkillLevel(this.id, skill);
  }
  isCheckpointActive(): boolean {
    return w.IsPlayerCheckpointActive(this.id);
  }
  getCheckpoint() {
    return w.GetPlayerCheckpoint(this.id);
  }
  isRaceCheckpointActive(): boolean {
    return w.IsPlayerRaceCheckpointActive(this.id);
  }
  getRaceCheckpoint() {
    return w.GetPlayerRaceCheckpoint(this.id);
  }
  getWorldBounds() {
    w.GetPlayerWorldBounds(this.id);
  }
  isInModShop(): boolean {
    return w.IsPlayerInModShop(this.id);
  }
  getSirenState(): number {
    return w.GetPlayerSirenState(this.id);
  }
  getLandingGearState(): number {
    return w.GetPlayerLandingGearState(this.id);
  }
  getHydraReactorAngle(): number {
    return w.GetPlayerHydraReactorAngle(this.id);
  }
  getTrainSpeed(): number {
    return w.GetPlayerTrainSpeed(this.id);
  }
  getZAim(): number {
    return w.GetPlayerZAim(this.id);
  }
  getSurfingOffsets() {
    return w.GetPlayerSurfingOffsets(this.id);
  }
  getRotationQuat() {
    return w.GetPlayerRotationQuat(this.id);
  }
  getDialogID(): number {
    return w.GetPlayerDialogID(this.id);
  }
  getSpectateID(): number {
    return w.GetPlayerSpectateID(this.id);
  }
  getSpectateType(): SpectateModesEnum {
    return w.GetPlayerSpectateType(this.id);
  }
  getRawIp(): string {
    return w.GetPlayerRawIp(this.id);
  }
  setGravity(gravity: number) {
    return w.SetPlayerGravity(this.id, gravity);
  }
  getGravity(): number {
    return w.GetPlayerGravity(this.id);
  }
  setAdmin(admin: boolean) {
    return w.SetPlayerAdmin(this.id, admin);
  }
  isSpawned(): boolean {
    return w.IsPlayerSpawned(this.id);
  }
  isControllable(): boolean {
    return w.IsPlayerControllable(this.id);
  }
  isCameraTargetEnabled(): boolean {
    return w.IsPlayerCameraTargetEnabled(this.id);
  }
  toggleGhostMode(toggle: boolean) {
    return w.TogglePlayerGhostMode(this.id, toggle);
  }
  getGhostMode(): boolean {
    return w.GetPlayerGhostMode(this.id);
  }
  getBuildingsRemoved(): number {
    return w.GetPlayerBuildingsRemoved(this.id);
  }
  getAttachedObject(index: number) {
    return w.GetPlayerAttachedObject(this.id, index);
  }
  removeWeapon(weaponId: number) {
    return w.RemovePlayerWeapon(this.id, weaponId);
  }
  isUsingOfficialClient() {
    return w.IsPlayerUsingOfficialClient(this.id);
  }
  allowWeapons(allow: boolean) {
    return w.AllowPlayerWeapons(this.id, allow);
  }
  areWeaponsAllowed() {
    return w.ArePlayerWeaponsAllowed(this.id);
  }
  gpci(charset: string = this.charset) {
    return w.gpci(this.id, charset);
  }
  isCuffed() {
    return w.IsPlayerCuffed(this.id);
  }
  isInDriveByMode() {
    return w.IsPlayerInDriveByMode(this.id);
  }
  isAndroid() {
    return this.isConnected() && this[innerPlayerProps].isAndroid;
  }
  isPC() {
    return this.isConnected() && !this[innerPlayerProps].isAndroid;
  }
  isUsingOmp() {
    return w.IsPlayerUsingOmp(this.id);
  }
  static getInstance(id: number) {
    return playerPool.get(id);
  }
  static getInstances() {
    return [...playerPool.values()];
  }
}
