import { IClientResRaw } from "@/interfaces";
import {
  BanEx,
  GetPlayerName,
  SendClientMessage,
  SendClientMessageToAll,
  SendPlayerMessageToAll,
  SendPlayerMessageToPlayer,
  SetPlayerName,
} from "@/utils/helperUtils";
import * as playerFunc from "@/wrapper/native/functions";
import { logger } from "@/logger";
import {
  BoneIdsEnum,
  CameraCutStylesEnum,
  CameraModesEnum,
  DamageDeathReasonEnum,
  FightingStylesEnum,
  InvalidEnum,
  PlayerStateEnum,
  SpecialActionsEnum,
  SpectateModesEnum,
  WeaponEnum,
  WeaponSkillsEnum,
  WeaponStatesEnum,
} from "@/enums";
import { BaseVehicle } from "../vehicle";
import { TBasePos } from "@/types";

import { getAnimateDurationByLibName } from "@/utils/animateUtils";
import { DynamicObject } from "../../wrapper/streamer";
import { ccWaitingQueue, delCCTask } from "../promise/client";
import {
  GetPlayerWeather,
  TogglePlayerWidescreen,
  IsPlayerWidescreenToggled,
  GetSpawnInfo,
  GetPlayerSkillLevel,
  IsPlayerCheckpointActive,
  GetPlayerCheckpoint,
  IsPlayerRaceCheckpointActive,
  GetPlayerRaceCheckpoint,
  GetPlayerWorldBounds,
  IsPlayerInModShop,
  GetPlayerSirenState,
  GetPlayerLandingGearState,
  GetPlayerHydraReactorAngle,
  GetPlayerTrainSpeed,
  GetPlayerZAim,
  GetPlayerSurfingOffsets,
  GetPlayerRotationQuat,
  GetPlayerDialogID,
  GetPlayerSpectateID,
  GetPlayerSpectateType,
  GetPlayerRawIp,
  SetPlayerGravity,
  GetPlayerGravity,
  SetPlayerAdmin,
  IsPlayerSpawned,
  IsPlayerControllable,
  IsPlayerCameraTargetEnabled,
  TogglePlayerGhostMode,
  GetPlayerGhostMode,
  GetPlayerBuildingsRemoved,
  GetPlayerAttachedObject,
  RemovePlayerWeapon,
  IsPlayerUsingOfficialClient,
  AllowPlayerTeleport,
  IsPlayerTeleportAllowed,
  AllowPlayerWeapons,
  ArePlayerWeaponsAllowed,
} from "omp-wrapper";
import { defaultCharset, defaultLocale } from "../gamemode/settings";
import { playerBus, playerHooks } from "./playerBus";

export abstract class BasePlayer {
  private _id: number;
  private _isNpc: boolean;
  private _locale: string = defaultLocale;
  private _charset: string = defaultCharset;
  private _isRecording = false;

  lastDrunkLevel = 0;
  lastFps = 0;
  isPaused = false;
  lastUpdateTick = 0;

  get id(): number {
    return this._id;
  }
  get locale(): string {
    return this._locale;
  }
  set locale(value: string) {
    playerBus.emit(playerHooks.setLocale, { player: this, value });
  }
  get charset(): string {
    return this._charset;
  }
  set charset(value: string) {
    playerBus.emit(playerHooks.setCharset, { player: this, value });
  }
  get isRecording() {
    return this._isRecording;
  }
  set isRecording(value) {
    playerBus.emit(playerHooks.setIsRecording, { player: this, value });
  }

  constructor(id: number) {
    this._id = id;
    this._isNpc = playerFunc.IsPlayerNPC(this.id);
  }

  sendClientMessage(colour: string | number, msg: string): number {
    return SendClientMessage(this, colour, msg);
  }

  static sendClientMessageToAll<P extends BasePlayer>(
    players: Array<P>,
    colour: string | number,
    msg: string
  ) {
    SendClientMessageToAll(players, colour, msg);
  }

  sendPlayerMessage<P extends BasePlayer>(player: P, message: string): number {
    return SendPlayerMessageToPlayer(player, this.id, message);
  }

  sendPlayerMessageToAll<P extends BasePlayer>(
    players: Array<P>,
    message: string
  ): number {
    return SendPlayerMessageToAll(players, this.id, message);
  }

  isNpc(): boolean {
    return this._isNpc;
  }

  // first call will return 0;
  // should be called at one second intervals, implemented internally by throttling
  getFps(): number {
    return this.lastFps;
  }
  getDrunkLevel(): number {
    return playerFunc.GetPlayerDrunkLevel(this.id);
  }
  setDrunkLevel(level: number): void {
    if (level < 0 || level > 50000)
      return logger.error(
        new Error("[BasePlayer]: player's drunk level ranges from 0 to 50000")
      );
    playerFunc.SetPlayerDrunkLevel(this.id, level);
  }
  allowTeleport(allow: boolean): void {
    AllowPlayerTeleport(this.id, allow);
  }
  isTeleportAllowed() {
    return IsPlayerTeleportAllowed(this.id);
  }
  enableCameraTarget(enable: boolean): void {
    playerFunc.EnablePlayerCameraTarget(this.id, enable);
  }
  enableStuntBonus(enable: boolean): void {
    playerFunc.EnableStuntBonusForPlayer(this.id, enable);
  }
  getInterior(): number {
    return playerFunc.GetPlayerInterior(this.id);
  }
  setInterior(interiorId: number): number {
    return playerFunc.SetPlayerInterior(this.id, interiorId);
  }
  showPlayerNameTag<P extends BasePlayer>(showPlayer: P, show: boolean): void {
    playerFunc.ShowPlayerNameTagForPlayer(this.id, showPlayer.id, show);
  }
  setColor(colour: string | number): void {
    playerFunc.SetPlayerColor(this.id, colour);
  }
  getColor(): number {
    return playerFunc.GetPlayerColor(this.id);
  }
  setPlayerMarker<P extends BasePlayer>(
    showPlayer: P,
    colour: string | number
  ) {
    playerFunc.SetPlayerMarkerForPlayer(this.id, showPlayer.id, colour);
  }
  resetMoney(): number {
    return playerFunc.ResetPlayerMoney(this.id);
  }
  getMoney(): number {
    return playerFunc.GetPlayerMoney(this.id);
  }
  giveMoney(money: number): number {
    return playerFunc.GivePlayerMoney(this.id, money);
  }
  resetWeapons(): number {
    return playerFunc.ResetPlayerWeapons(this.id);
  }
  spawn(): number {
    if (this.isSpectating()) {
      this.toggleSpectating(false);
      return 1;
    }
    return playerFunc.SpawnPlayer(this.id);
  }
  setHealth(health: number): number {
    return playerFunc.SetPlayerHealth(this.id, health);
  }
  getHealth(): number {
    return playerFunc.GetPlayerHealth(this.id);
  }
  toggleClock(toggle: boolean): number {
    return playerFunc.TogglePlayerClock(this.id, toggle);
  }
  toggleControllable(toggle: boolean): number {
    return playerFunc.TogglePlayerControllable(this.id, toggle);
  }
  toggleSpectating(toggle: boolean): number {
    return playerFunc.TogglePlayerSpectating(this.id, toggle);
  }
  spectatePlayer<P extends BasePlayer>(
    targetPlayer: P,
    mode = SpectateModesEnum.NORMAL
  ) {
    return playerFunc.PlayerSpectatePlayer(this.id, targetPlayer.id, mode);
  }
  spectateVehicle<V extends BaseVehicle>(
    targetVehicle: V,
    mode = SpectateModesEnum.NORMAL
  ) {
    return playerFunc.PlayerSpectateVehicle(this.id, targetVehicle.id, mode);
  }
  forceClassSelection(): void {
    playerFunc.ForceClassSelection(this.id);
  }
  kick(): void {
    playerFunc.Kick(this.id);
  }
  ban(): void {
    playerFunc.Ban(this.id);
  }
  banEx(reason: string, charset: string): void {
    BanEx(this.id, reason, charset);
  }
  isAdmin() {
    return playerFunc.IsPlayerAdmin(this.id);
  }
  isInRangeOfPoint(range: number, x: number, y: number, z: number) {
    return playerFunc.IsPlayerInRangeOfPoint(this.id, range, x, y, z);
  }
  isStreamedIn<P extends BasePlayer>(forplayer: P) {
    return playerFunc.IsPlayerStreamedIn(this.id, forplayer.id);
  }
  setSkin(skinId: number, ignoreRange = false): number {
    if (!ignoreRange && (skinId < 0 || skinId > 311 || skinId == 74)) return 0;
    if (this.getHealth() <= 0) return 0;
    if (this.isInAnyVehicle()) return 0;
    if (this.getSpecialAction() === SpecialActionsEnum.DUCK) return 0;
    return playerFunc.SetPlayerSkin(this.id, skinId);
  }
  getSkin(): number {
    return playerFunc.GetPlayerSkin(this.id);
  }
  isInAnyVehicle(): boolean {
    return playerFunc.IsPlayerInAnyVehicle(this.id);
  }
  getSpecialAction(): SpecialActionsEnum {
    return playerFunc.GetPlayerSpecialAction(this.id);
  }
  setSpecialAction(actionId: SpecialActionsEnum): number {
    return playerFunc.SetPlayerSpecialAction(this.id, actionId);
  }
  setScore(score: number): number {
    return playerFunc.SetPlayerScore(this.id, score);
  }
  getScore(): number {
    return playerFunc.GetPlayerScore(this.id);
  }
  getPing(): number {
    return playerFunc.GetPlayerPing(this.id) || 0;
  }
  setPos(x: number, y: number, z: number): number {
    return playerFunc.SetPlayerPos(this.id, x, y, z);
  }
  getPos(): TBasePos | undefined {
    if (
      this.isSpectating() ||
      this.isWasted() ||
      this.getState() === PlayerStateEnum.NONE
    )
      return undefined;
    const [x, y, z] = playerFunc.GetPlayerPos(this.id);
    return { x, y, z };
  }
  isSpectating(): boolean {
    return this.getState() === PlayerStateEnum.SPECTATING;
  }
  isWasted(): boolean {
    return this.getState() === PlayerStateEnum.WASTED;
  }
  getState(): PlayerStateEnum {
    return playerFunc.GetPlayerState(this.id);
  }
  getVersion(): string {
    if (this.isNpc()) return "";
    return playerFunc.GetPlayerVersion(this.id);
  }
  setVirtualWorld(worldId: number): number {
    return playerFunc.SetPlayerVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    return playerFunc.GetPlayerVirtualWorld(this.id);
  }
  removeFromVehicle(): number {
    return playerFunc.RemovePlayerFromVehicle(this.id);
  }
  setWantedLevel(level: number): number {
    if (level < 0 || level > 6) {
      logger.error("[BasePlayer]: player's wanted level ranges from 0 to 6");
      return 0;
    }
    return playerFunc.SetPlayerWantedLevel(this.id, level);
  }
  getWantedLevel(): number {
    return playerFunc.GetPlayerWantedLevel(this.id);
  }
  setFacingAngle(ang: number): number {
    return playerFunc.SetPlayerFacingAngle(this.id, ang);
  }
  getFacingAngle(): number {
    return playerFunc.GetPlayerFacingAngle(this.id);
  }
  setWeather(weather: number): void {
    if (weather < 0 || weather > 255) {
      logger.warn("[BasePlayer]: The valid weather value is only 0 to 255");
      return;
    }
    playerFunc.SetPlayerWeather(this.id, weather);
  }
  getWeather(): number {
    return GetPlayerWeather(this.id);
  }
  setTime(hour: number, minute: number): void | number {
    if (hour < 0 || hour > 23) {
      logger.warn("[BasePlayer]: The valid hour value is only 0 to 23");
      return;
    }
    if (minute < 0 || minute > 59) {
      logger.warn("[BasePlayer]: The valid minute value is only 0 to 59");
      return;
    }
    return playerFunc.SetPlayerTime(this.id, hour, minute);
  }
  getTime() {
    const [hour, minute] = playerFunc.GetPlayerTime(this.id);
    return { hour, minute };
  }
  removeBuilding(
    modelid: number,
    fX: number,
    fY: number,
    fZ: number,
    fRadius: number
  ): void {
    playerFunc.RemoveBuildingForPlayer(this.id, modelid, fX, fY, fZ, fRadius);
  }
  setTeam(team: number): void {
    if (team < 0 || team > InvalidEnum.NO_TEAM) return;
    playerFunc.SetPlayerTeam(this.id, team);
  }
  getTeam(): number {
    return playerFunc.GetPlayerTeam(this.id);
  }
  setSkillLevel(skill: WeaponSkillsEnum, level: number): void {
    if (level < 0 || level > 999) {
      logger.warn("[BasePlayer]: The valid skill level is only 0 to 999");
      return;
    }
    playerFunc.SetPlayerSkillLevel(this.id, skill, level);
  }
  getName(): string {
    return GetPlayerName(this);
  }
  setName(name: string): number {
    return SetPlayerName(this, name);
  }
  setVelocity(x: number, y: number, z: number): number {
    return playerFunc.SetPlayerVelocity(this.id, x, y, z);
  }
  getVelocity(): TBasePos {
    const [x, y, z] = playerFunc.GetPlayerVelocity(this.id);
    return { x, y, z };
  }
  getKeys() {
    const [keys, updown, leftright] = playerFunc.GetPlayerKeys(this.id);
    return { keys, updown, leftright };
  }
  getIp(): string {
    return playerFunc.GetPlayerIp(this.id);
  }
  getFightingStyle(): FightingStylesEnum {
    return playerFunc.GetPlayerFightingStyle(this.id);
  }
  setFightingStyle(style: FightingStylesEnum): void {
    playerFunc.SetPlayerFightingStyle(this.id, style);
  }
  setArmour(armour: number): number {
    return playerFunc.SetPlayerArmour(this.id, armour);
  }
  getArmour(): number {
    return playerFunc.GetPlayerArmour(this.id);
  }
  setCameraBehind(): number {
    return playerFunc.SetCameraBehindPlayer(this.id);
  }
  setCameraPos(x: number, y: number, z: number): number {
    return playerFunc.SetPlayerCameraPos(this.id, x, y, z);
  }
  setCameraLookAt(
    x: number,
    y: number,
    z: number,
    cut: CameraCutStylesEnum
  ): number {
    return playerFunc.SetPlayerCameraLookAt(this.id, x, y, z, cut);
  }
  getCameraAspectRatio(): number {
    return playerFunc.GetPlayerCameraAspectRatio(this.id);
  }
  getCameraFrontVector(): TBasePos {
    const [x, y, z] = playerFunc.GetPlayerCameraFrontVector(this.id);
    return { x, y, z };
  }
  getCameraMode(): CameraModesEnum {
    return playerFunc.GetPlayerCameraMode(this.id);
  }
  getCameraPos(): TBasePos {
    const [x, y, z] = playerFunc.GetPlayerCameraPos(this.id);
    return { x, y, z };
  }
  getCameraTargetPlayer<P extends BasePlayer>(
    players: Array<P>
  ): P | undefined {
    const target = playerFunc.GetPlayerCameraTargetPlayer(this.id);
    return players.find((p) => p.id === target);
  }
  getCameraTargetVehicle<V extends BaseVehicle>(
    vehicles: Array<V>
  ): V | undefined {
    const target = playerFunc.GetPlayerCameraTargetVehicle(this.id);
    return vehicles.find((v) => v.id === target);
  }
  getCameraZoom(): number {
    return playerFunc.GetPlayerCameraZoom(this.id);
  }
  playAudioStream(
    url: string,
    posX = 0.0,
    posY = 0.0,
    posZ = 0.0,
    distance = 5.0
  ): number {
    let usepos = false;
    if (posX !== 0.0 || posY !== 0.0 || posZ !== 0.0) {
      usepos = true;
    }
    return playerFunc.PlayAudioStreamForPlayer(
      this.id,
      url,
      posX,
      posY,
      posZ,
      distance,
      usepos
    );
  }
  stopAudioStream(): void {
    playerFunc.StopAudioStreamForPlayer(this.id);
  }
  playSound(
    soundid: number,
    relativeX = 0.0,
    relativeY = 0.0,
    relativeZ = 0.0
  ): number {
    return playerFunc.PlayerPlaySound(
      this.id,
      soundid,
      relativeX,
      relativeY,
      relativeZ
    );
  }
  static getPoolSize(): number {
    return playerFunc.GetPlayerPoolSize();
  }
  static getMaxPlayers(): number {
    return playerFunc.GetMaxPlayers();
  }
  playCrimeReport<P extends BasePlayer>(suspect: P, crimeId: number): number {
    if (crimeId < 3 || crimeId > 22) {
      logger.warn("[BasePlayer]: Available crime ids range from 3 to 22");
      return 0;
    }
    return playerFunc.PlayCrimeReportForPlayer(this.id, suspect.id, crimeId);
  }
  interpolateCameraPos(
    FromX: number,
    FromY: number,
    FromZ: number,
    ToX: number,
    ToY: number,
    ToZ: number,
    time: number,
    cut: CameraCutStylesEnum = CameraCutStylesEnum.CUT
  ): void {
    playerFunc.InterpolateCameraPos(
      this.id,
      FromX,
      FromY,
      FromZ,
      ToX,
      ToY,
      ToZ,
      time,
      cut
    );
  }
  interpolateCameraLookAt(
    FromX: number,
    FromY: number,
    FromZ: number,
    ToX: number,
    ToY: number,
    ToZ: number,
    time: number,
    cut: CameraCutStylesEnum = CameraCutStylesEnum.CUT
  ): void {
    playerFunc.InterpolateCameraLookAt(
      this.id,
      FromX,
      FromY,
      FromZ,
      ToX,
      ToY,
      ToZ,
      time,
      cut
    );
  }
  createExplosion(
    X: number,
    Y: number,
    Z: number,
    type: number,
    Radius: number
  ): number {
    if (type < 0 || type > 13) {
      logger.error(
        "[BasePlayer]: The valid explosion type value is only 0 to 13"
      );
      return 0;
    }
    return playerFunc.CreateExplosionForPlayer(this.id, X, Y, Z, type, Radius);
  }
  static isConnected<P extends BasePlayer>(player: P): boolean {
    return playerFunc.IsPlayerConnected(player.id);
  }
  isConnected(): boolean {
    return playerFunc.IsPlayerConnected(this.id);
  }
  disableRemoteVehicleCollisions(disable: boolean) {
    return playerFunc.DisableRemoteVehicleCollisions(this.id, disable);
  }
  getVehicle<V extends BaseVehicle>(vehicles: Array<V>): V | undefined {
    if (!this.isInAnyVehicle()) return undefined;
    const vehId: number = playerFunc.GetPlayerVehicleID(this.id);
    return vehicles.find((v) => v.id === vehId);
  }
  getVehicleSeat(): number {
    return playerFunc.GetPlayerVehicleSeat(this.id);
  }
  getSurfingVehicle<V extends BaseVehicle>(vehicles: Array<V>): V | undefined {
    const vehId = playerFunc.GetPlayerSurfingVehicleID(this.id);
    if (vehId === InvalidEnum.VEHICLE_ID) return undefined;
    return vehicles.find((v) => v.id === vehId);
  }
  applyAnimation(
    animLib: string,
    animName: string,
    loop = false,
    lockX = true,
    lockY = true,
    freeze = false,
    forceSync = false
  ): void {
    const duration = getAnimateDurationByLibName(animLib, animName);
    if (duration === undefined)
      return logger.error("[BasePlayer]: Invalid anim library or name");
    playerFunc.ApplyAnimation(
      this.id,
      animLib,
      animName,
      4.1,
      loop,
      lockX,
      lockY,
      freeze,
      loop ? 0 : duration,
      forceSync
    );
  }
  clearAnimations(forceSync = false): void {
    playerFunc.ClearAnimations(this.id, forceSync);
  }
  getAnimationIndex(): number {
    return playerFunc.GetPlayerAnimationIndex(this.id);
  }
  getAnimationName() {
    const [animLib, animName] = playerFunc.GetAnimationName(
      this.getAnimationIndex()
    );
    return { animLib, animName };
  }
  setShopName(shopName: string): void {
    playerFunc.SetPlayerShopName(this.id, shopName);
  }
  setPosFindZ(x: number, y: number, z = 150): Promise<number> {
    return new Promise<number>((resolve) => {
      playerFunc.SetPlayerPos(this.id, x, y, z);
      setTimeout(() => resolve(playerFunc.SetPlayerPosFindZ(this.id, x, y, z)));
    });
  }
  setWorldBounds(
    x_max: number,
    x_min: number,
    y_max: number,
    y_min: number
  ): void {
    playerFunc.SetPlayerWorldBounds(this.id, x_max, x_min, y_max, y_min);
  }
  setChatBubble(
    text: string,
    colour: string | number,
    drawDistance: number,
    expireTime: number
  ): void {
    playerFunc.SetPlayerChatBubble(
      this.id,
      text,
      colour,
      drawDistance,
      expireTime
    );
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return playerFunc.GetPlayerDistanceFromPoint(this.id, X, Y, Z);
  }
  getCustomSkin(): number {
    return playerFunc.GetPlayerCustomSkin(this.id);
  }
  getTargetPlayer<P extends BasePlayer>(players: Array<P>): undefined | P {
    const pid = playerFunc.GetPlayerTargetPlayer(this.id);
    if (pid === InvalidEnum.PLAYER_ID) return undefined;
    return players.find((p) => p.id === pid);
  }
  getLastShotVectors() {
    const [fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ] =
      playerFunc.GetPlayerLastShotVectors(this.id);
    return { fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ };
  }
  getWeapon(): WeaponEnum | -1 {
    return playerFunc.GetPlayerWeapon(this.id);
  }
  getWeaponData(slot: number) {
    if (slot < 0 || slot > 12) {
      logger.error("[BasePlayer]: weapon slots range from 0 to 12");
      return;
    }
    const [weapons, ammo] = playerFunc.GetPlayerWeaponData(this.id, slot);
    return { weapons, ammo };
  }
  getWeaponState(): WeaponStatesEnum {
    return playerFunc.GetPlayerWeaponState(this.id);
  }
  giveWeapon(weaponid: WeaponEnum, ammo: number): number {
    return playerFunc.GivePlayerWeapon(this.id, weaponid, ammo);
  }
  setAmmo(weaponid: number, ammo: number) {
    return playerFunc.SetPlayerAmmo(this.id, weaponid, ammo);
  }
  getAmmo(): number {
    return playerFunc.GetPlayerAmmo(this.id);
  }
  setArmedWeapon(weaponid: number): number {
    return playerFunc.SetPlayerArmedWeapon(this.id, weaponid);
  }
  // not test
  clearDeathMessage() {
    for (let i = 0; i < 5; i++) {
      this.sendDeathMessageToPlayer(
        InvalidEnum.PLAYER_ID,
        InvalidEnum.PLAYER_ID,
        DamageDeathReasonEnum.CONNECT
      );
    }
  }
  sendDeathMessage<P extends BasePlayer>(
    killer: P | InvalidEnum.PLAYER_ID,
    weapon: WeaponEnum | DamageDeathReasonEnum
  ): void {
    playerFunc.SendDeathMessage(
      killer === InvalidEnum.PLAYER_ID ? killer : killer.id,
      this.id,
      weapon
    );
  }
  sendDeathMessageToPlayer<P extends BasePlayer>(
    killer: P | InvalidEnum.PLAYER_ID,
    killee: P | InvalidEnum.PLAYER_ID,
    weapon: WeaponEnum | DamageDeathReasonEnum
  ): void {
    playerFunc.SendDeathMessageToPlayer(
      this.id,
      killer === InvalidEnum.PLAYER_ID ? killer : killer.id,
      killee === InvalidEnum.PLAYER_ID ? killee : killee.id,
      weapon
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
    weapon1_ammo: number,
    weapon2: WeaponEnum,
    weapon2_ammo: number,
    weapon3: WeaponEnum,
    weapon3_ammo: number
  ): void {
    if (team < 0 || team > InvalidEnum.NO_TEAM) return;
    if (skin < 0 || skin > 311 || skin == 74) return;
    if (weapon1_ammo < 0 || weapon2_ammo < 0 || weapon3_ammo < 0) return;
    playerFunc.SetSpawnInfo(
      this.id,
      team,
      skin,
      x,
      y,
      z,
      rotation,
      weapon1,
      weapon1_ammo,
      weapon2,
      weapon2_ammo,
      weapon3,
      weapon3_ammo
    );
  }
  redirectDownload(url: string) {
    return playerFunc.RedirectDownload(this.id, url);
  }
  sendClientCheck(
    type: number,
    memAddr: number,
    memOffset: number,
    byteCount: number
  ): void | Promise<IClientResRaw> {
    const validTypes = [2, 5, 69, 70, 71, 72];
    if (!validTypes.includes(type)) {
      return logger.error(
        `[BasePlayer]: sendClientCheck valid types are ${validTypes.toString()}`
      );
    }

    return new Promise((resolve, reject) => {
      delCCTask(this.id, true);
      if (this.isPaused)
        return reject(
          "[BasePlayer]: An attempt to check the player client response, but the player paused the game"
        );
      const p = new Promise<IClientResRaw>((clientResolve, clientReject) => {
        const ping = this.getPing();
        const shouldResTime = (ping >= 200 ? 0 : ping) + 200;
        ccWaitingQueue.set(this.id, {
          resolve: clientResolve,
          reject: clientReject,
          timeout: setTimeout(() => delCCTask(this.id, true), shouldResTime),
        });
        playerFunc.SendClientCheck(
          this.id,
          type,
          memAddr,
          memOffset,
          byteCount
        );
      });
      p.then(resolve, reject);
      p.finally(() => delCCTask(this.id));
    });
  }
  selectTextDraw(colour: string | number): void {
    playerFunc.SelectTextDraw(this.id, colour);
  }
  cancelSelectTextDraw(): void {
    playerFunc.CancelSelectTextDraw(this.id);
  }
  beginObjectSelecting(): void {
    playerFunc.BeginObjectSelecting(this.id);
  }
  endObjectEditing(): void {
    playerFunc.EndObjectEditing(this.id);
  }
  getSurfingObject<O extends DynamicObject>(objects: Map<number, O>): void | O {
    const id: number = playerFunc.GetPlayerSurfingObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return objects.get(id);
  }
  isAttachedObjectSlotUsed(index: number): boolean {
    return playerFunc.IsPlayerAttachedObjectSlotUsed(this.id, index);
  }
  setAttachedObject(
    index: number,
    modelid: number,
    bone: BoneIdsEnum,
    fOffsetX: number,
    fOffsetY: number,
    fOffsetZ: number,
    fRotX: number,
    fRotY: number,
    fRotZ: number,
    fScaleX: number,
    fScaleY: number,
    fScaleZ: number,
    materialcolour1: string | number,
    materialcolour2: string | number
  ): void | number {
    if (this.isAttachedObjectSlotUsed(index)) return 0;
    return playerFunc.SetPlayerAttachedObject(
      this.id,
      index,
      modelid,
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
      materialcolour1,
      materialcolour2
    );
  }
  removeAttachedObject(index: number): number {
    if (!this.isAttachedObjectSlotUsed(index)) return 0;
    return playerFunc.RemovePlayerAttachedObject(this.id, index);
  }
  toggleWidescreen(set: boolean): number {
    return TogglePlayerWidescreen(this.id, set);
  }
  isPlayerWidescreenToggled(): boolean {
    return IsPlayerWidescreenToggled(this.id);
  }
  getSpawnInfo() {
    return GetSpawnInfo(this.id);
  }
  getSkillLevel(skill: WeaponSkillsEnum): number {
    return GetPlayerSkillLevel(this.id, skill);
  }
  isCheckpointActive(): boolean {
    return IsPlayerCheckpointActive(this.id);
  }
  getCheckpoint() {
    return GetPlayerCheckpoint(this.id);
  }
  isRaceCheckpointActive(): boolean {
    return IsPlayerRaceCheckpointActive(this.id);
  }
  getRaceCheckpoint() {
    return GetPlayerRaceCheckpoint(this.id);
  }
  getWorldBounds() {
    GetPlayerWorldBounds(this.id);
  }
  isInModShop(): boolean {
    return IsPlayerInModShop(this.id);
  }
  getSirenState(): number {
    return GetPlayerSirenState(this.id);
  }
  getLandingGearState(): number {
    return GetPlayerLandingGearState(this.id);
  }
  getHydraReactorAngle(): number {
    return GetPlayerHydraReactorAngle(this.id);
  }
  getTrainSpeed(): number {
    return GetPlayerTrainSpeed(this.id);
  }
  getZAim(): number {
    return GetPlayerZAim(this.id);
  }
  getSurfingOffsets() {
    return GetPlayerSurfingOffsets(this.id);
  }
  getRotationQuat() {
    return GetPlayerRotationQuat(this.id);
  }
  getDialogID(): number {
    return GetPlayerDialogID(this.id);
  }
  getSpectateID(): number {
    return GetPlayerSpectateID(this.id);
  }
  getSpectateType(): SpectateModesEnum {
    return GetPlayerSpectateType(this.id);
  }
  getRawIp(): string {
    return GetPlayerRawIp(this.id);
  }
  setGravity(gravity: number): number {
    return SetPlayerGravity(this.id, gravity);
  }
  getGravity(): number {
    return GetPlayerGravity(this.id);
  }
  setAdmin(admin: boolean) {
    return SetPlayerAdmin(this.id, admin);
  }
  isSpawned(): boolean {
    return IsPlayerSpawned(this.id);
  }
  isControllable(): boolean {
    return IsPlayerControllable(this.id);
  }
  isCameraTargetEnabled(): boolean {
    return IsPlayerCameraTargetEnabled(this.id);
  }
  toggleGhostMode(toggle: boolean) {
    return TogglePlayerGhostMode(this.id, toggle);
  }
  getGhostMode(): boolean {
    return GetPlayerGhostMode(this.id);
  }
  getBuildingsRemoved(): number {
    return GetPlayerBuildingsRemoved(this.id);
  }
  getAttachedObject(index: number) {
    return GetPlayerAttachedObject(this.id, index);
  }
  removeWeapon(weaponid: number): number {
    return RemovePlayerWeapon(this.id, weaponid);
  }
  isUsingOfficialClient() {
    return IsPlayerUsingOfficialClient(this.id);
  }
  allowWeapons(allow: boolean) {
    return AllowPlayerWeapons(this.id, allow);
  }
  areWeaponsAllowed() {
    return ArePlayerWeaponsAllowed(this.id);
  }
  gpci(charset?: string) {
    return playerFunc.GPCI(this.id, charset);
  }
}
