import { IClientResRaw, IPlayerSettings } from "@/interfaces";
import {
  BanEx,
  GetPlayerName,
  SendClientMessage,
  SendClientMessageToAll,
  SendPlayerMessageToAll,
  SendPlayerMessageToPlayer,
  SetPlayerName,
} from "@/utils/helperUtils";
import * as playerFunc from "@/wrapper/functions";
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
import * as ow from "omp-wrapper";
import { getAnimateDurationByLibName } from "@/utils/animateUtils";
import { DynamicObject } from "../streamer";
import { ccWaitingQueue, delCCTask } from "../promise/client";

export abstract class BasePlayer {
  private _id: number;
  public isRecording = false;
  // public name = "";
  // Note: The locale and character set must be assigned at application level development time. Otherwise i18n will be problematic.
  public abstract settings: IPlayerSettings;
  public lastDrunkLevel = 0;
  public lastFps = 0;
  private _isNpc: boolean;
  private _isAndroid: null | boolean = null;
  public isPaused = false;

  get charset() {
    return this.settings.charset;
  }
  set charset(charset: string) {
    this.settings.charset = charset;
  }

  get locale(): string | number | undefined {
    return this.settings.locale;
  }
  set locale(language: string | number | undefined) {
    this.settings.locale = language;
  }

  get id(): number {
    return this._id;
  }

  public constructor(id: number) {
    this._id = id;
    this._isNpc = playerFunc.IsPlayerNPC(this.id);
  }

  public sendClientMessage(color: string, msg: string): number {
    return SendClientMessage(this, color, msg);
  }

  public static sendClientMessageToAll<P extends BasePlayer>(
    players: Array<P>,
    color: string,
    msg: string
  ) {
    SendClientMessageToAll(players, color, msg);
  }

  public sendPlayerMessage<P extends BasePlayer>(
    player: P,
    message: string
  ): number {
    return SendPlayerMessageToPlayer(player, this.id, message);
  }

  public sendPlayerMessageToAll<P extends BasePlayer>(
    players: Array<P>,
    message: string
  ): number {
    return SendPlayerMessageToAll(players, this.id, message);
  }

  public isNpc(): boolean {
    return this._isNpc;
  }

  // first call will return 0;
  // should be called at one second intervals, implemented internally by throttling
  public getFps(): number {
    return this.lastFps;
  }
  public getDrunkLevel(): number {
    return playerFunc.GetPlayerDrunkLevel(this.id);
  }
  public setDrunkLevel(level: number): void {
    if (level < 0 || level > 50000)
      return logger.error(
        new Error("[BasePlayer]: player's drunk level ranges from 0 to 50000")
      );
    playerFunc.SetPlayerDrunkLevel(this.id, level);
  }
  public allowTeleport(allow: boolean): void {
    playerFunc.AllowPlayerTeleport(this.id, allow);
  }
  public enableCameraTarget(enable: boolean): void {
    playerFunc.EnablePlayerCameraTarget(this.id, enable);
  }
  public enableStuntBonus(enable: boolean): void {
    playerFunc.EnableStuntBonusForPlayer(this.id, enable);
  }
  public getInterior(): number {
    return playerFunc.GetPlayerInterior(this.id);
  }
  public setInterior(interiorId: number): number {
    return playerFunc.SetPlayerInterior(this.id, interiorId);
  }
  public showPlayerNameTag<P extends BasePlayer>(
    showPlayer: P,
    show: boolean
  ): void {
    playerFunc.ShowPlayerNameTagForPlayer(this.id, showPlayer.id, show);
  }
  public setColor(color: string): void {
    playerFunc.SetPlayerColor(this.id, color);
  }
  public getColor(): number {
    return playerFunc.GetPlayerColor(this.id);
  }
  public setPlayerMarker<P extends BasePlayer>(showPlayer: P, color: string) {
    playerFunc.SetPlayerMarkerForPlayer(this.id, showPlayer.id, color);
  }
  public resetMoney(): number {
    return playerFunc.ResetPlayerMoney(this.id);
  }
  public getMoney(): number {
    return playerFunc.GetPlayerMoney(this.id);
  }
  public giveMoney(money: number): number {
    return playerFunc.GivePlayerMoney(this.id, money);
  }
  public resetWeapons(): number {
    return playerFunc.ResetPlayerWeapons(this.id);
  }
  public spawn(): number {
    if (this.isSpectating()) {
      this.toggleSpectating(false);
      return 1;
    }
    return playerFunc.SpawnPlayer(this.id);
  }
  public setHealth(health: number): number {
    return playerFunc.SetPlayerHealth(this.id, health);
  }
  public getHealth(): number {
    return playerFunc.GetPlayerHealth(this.id);
  }
  public toggleClock(toggle: boolean): number {
    return playerFunc.TogglePlayerClock(this.id, toggle);
  }
  public toggleControllable(toggle: boolean): number {
    return playerFunc.TogglePlayerControllable(this.id, toggle);
  }
  public toggleSpectating(toggle: boolean): number {
    return playerFunc.TogglePlayerSpectating(this.id, toggle);
  }
  public spectatePlayer<P extends BasePlayer>(
    targetPlayer: P,
    mode: SpectateModesEnum
  ) {
    return playerFunc.PlayerSpectatePlayer(this.id, targetPlayer.id, mode);
  }
  public spectateVehicle<V extends BaseVehicle>(
    targetVehicle: V,
    mode: SpectateModesEnum
  ) {
    return playerFunc.PlayerSpectateVehicle(this.id, targetVehicle.id, mode);
  }
  public forceClassSelection(): void {
    playerFunc.ForceClassSelection(this.id);
  }
  public kick(): void {
    playerFunc.Kick(this.id);
  }
  public ban(): void {
    playerFunc.Ban(this.id);
  }
  public banEx(reason: string, charset: string): void {
    BanEx(this.id, reason, charset);
  }
  public isAdmin() {
    return playerFunc.IsPlayerAdmin(this.id);
  }
  public isInRangeOfPoint(range: number, x: number, y: number, z: number) {
    return playerFunc.IsPlayerInRangeOfPoint(this.id, range, x, y, z);
  }
  public isStreamedIn<P extends BasePlayer>(forplayer: P) {
    return playerFunc.IsPlayerStreamedIn(this.id, forplayer.id);
  }
  public setSkin(skinId: number): number {
    if (skinId < 0 || skinId > 311 || skinId == 74) return 0;
    if (this.getHealth() <= 0) return 0;
    if (this.isInAnyVehicle()) return 0;
    if (this.getSpecialAction() === SpecialActionsEnum.DUCK) return 0;
    return playerFunc.SetPlayerSkin(this.id, skinId);
  }
  public getSkin(): number {
    return playerFunc.GetPlayerSkin(this.id);
  }
  public isInAnyVehicle(): boolean {
    return playerFunc.IsPlayerInAnyVehicle(this.id);
  }
  public getSpecialAction(): SpecialActionsEnum {
    return playerFunc.GetPlayerSpecialAction(this.id);
  }
  public setSpecialAction(actionId: SpecialActionsEnum): number {
    return playerFunc.SetPlayerSpecialAction(this.id, actionId);
  }
  public setScore(score: number): number {
    return playerFunc.SetPlayerScore(this.id, score);
  }
  public getScore(): number {
    return playerFunc.GetPlayerScore(this.id);
  }
  public getPing(): number {
    return playerFunc.GetPlayerPing(this.id) || 0;
  }
  public setPos(x: number, y: number, z: number): number {
    return playerFunc.SetPlayerPos(this.id, x, y, z);
  }
  public getPos(): TBasePos | undefined {
    if (
      this.isSpectating() ||
      this.isWasted() ||
      this.getState() === PlayerStateEnum.NONE
    )
      return undefined;
    const [x, y, z] = playerFunc.GetPlayerPos(this.id);
    return { x, y, z };
  }
  public isSpectating(): boolean {
    return this.getState() === PlayerStateEnum.SPECTATING;
  }
  public isWasted(): boolean {
    return this.getState() === PlayerStateEnum.WASTED;
  }
  public getState(): PlayerStateEnum {
    return playerFunc.GetPlayerState(this.id);
  }
  public getVersion(): string {
    if (this.isNpc()) return "";
    return playerFunc.GetPlayerVersion(this.id);
  }
  public setVirtualWorld(worldId: number): number {
    return playerFunc.SetPlayerVirtualWorld(this.id, worldId);
  }
  public getVirtualWorld(): number {
    return playerFunc.GetPlayerVirtualWorld(this.id);
  }
  public removeFromVehicle(): number {
    return playerFunc.RemovePlayerFromVehicle(this.id);
  }
  public setWantedLevel(level: number): number {
    if (level < 0 || level > 6) {
      logger.error("[BasePlayer]: player's wanted level ranges from 0 to 6");
      return 0;
    }
    return playerFunc.SetPlayerWantedLevel(this.id, level);
  }
  public getWantedLevel(): number {
    return playerFunc.GetPlayerWantedLevel(this.id);
  }
  public setFacingAngle(ang: number): number {
    return playerFunc.SetPlayerFacingAngle(this.id, ang);
  }
  public getFacingAngle(): number {
    return playerFunc.GetPlayerFacingAngle(this.id);
  }
  public setWeather(weather: number): void {
    if (weather < 0 || weather > 255) {
      logger.warn("[BasePlayer]: The valid weather value is only 0 to 255");
      return;
    }
    playerFunc.SetPlayerWeather(this.id, weather);
  }
  public getWeather(): number {
    return ow.GetPlayerWeather(this.id);
  }
  public setTime(hour: number, minute: number): void | number {
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
  public getTime() {
    const [hour, minute] = playerFunc.GetPlayerTime(this.id);
    return { hour, minute };
  }
  public removeBuilding(
    modelid: number,
    fX: number,
    fY: number,
    fZ: number,
    fRadius: number
  ): void {
    playerFunc.RemoveBuildingForPlayer(this.id, modelid, fX, fY, fZ, fRadius);
  }
  public setTeam(team: number): void {
    if (team < 0 || team > InvalidEnum.NO_TEAM) return;
    playerFunc.SetPlayerTeam(this.id, team);
  }
  public getTeam(): number {
    return playerFunc.GetPlayerTeam(this.id);
  }
  public setSkillLevel(skill: WeaponSkillsEnum, level: number): void {
    if (level < 0 || level > 999) {
      logger.warn("[BasePlayer]: The valid skill level is only 0 to 999");
      return;
    }
    playerFunc.SetPlayerSkillLevel(this.id, skill, level);
  }
  public getName(): string {
    return GetPlayerName(this);
  }
  public setName(name: string): number {
    return SetPlayerName(this, name);
  }
  public setVelocity(x: number, y: number, z: number): number {
    return playerFunc.SetPlayerVelocity(this.id, x, y, z);
  }
  public getVelocity(): TBasePos {
    const [x, y, z] = playerFunc.GetPlayerVelocity(this.id);
    return { x, y, z };
  }
  public getKeys() {
    const [keys, updown, leftright] = playerFunc.GetPlayerKeys(this.id);
    return { keys, updown, leftright };
  }
  public getIp(): string {
    return playerFunc.GetPlayerIp(this.id);
  }
  public getFightingStyle(): FightingStylesEnum {
    return playerFunc.GetPlayerFightingStyle(this.id);
  }
  public setFightingStyle(style: FightingStylesEnum): void {
    playerFunc.SetPlayerFightingStyle(this.id, style);
  }
  public setArmour(armour: number): number {
    return playerFunc.SetPlayerArmour(this.id, armour);
  }
  public getArmour(): number {
    return playerFunc.GetPlayerArmour(this.id);
  }
  public setCameraBehind(): number {
    return playerFunc.SetCameraBehindPlayer(this.id);
  }
  public setCameraPos(x: number, y: number, z: number): number {
    return playerFunc.SetPlayerCameraPos(this.id, x, y, z);
  }
  public setCameraLookAt(
    x: number,
    y: number,
    z: number,
    cut: CameraCutStylesEnum
  ): number {
    return playerFunc.SetPlayerCameraLookAt(this.id, x, y, z, cut);
  }
  public getCameraAspectRatio(): number {
    return playerFunc.GetPlayerCameraAspectRatio(this.id);
  }
  public getCameraFrontVector(): TBasePos {
    const [x, y, z] = playerFunc.GetPlayerCameraFrontVector(this.id);
    return { x, y, z };
  }
  public getCameraMode(): CameraModesEnum {
    return playerFunc.GetPlayerCameraMode(this.id);
  }
  public getCameraPos(): TBasePos {
    const [x, y, z] = playerFunc.GetPlayerCameraPos(this.id);
    return { x, y, z };
  }
  public getCameraTargetPlayer<P extends BasePlayer>(
    players: Array<P>
  ): P | undefined {
    const target = playerFunc.GetPlayerCameraTargetPlayer(this.id);
    return players.find((p) => p.id === target);
  }
  public getCameraTargetVehicle<V extends BaseVehicle>(
    vehicles: Array<V>
  ): V | undefined {
    const target = playerFunc.GetPlayerCameraTargetVehicle(this.id);
    return vehicles.find((v) => v.id === target);
  }
  public getCameraZoom(): number {
    return playerFunc.GetPlayerCameraZoom(this.id);
  }
  public playAudioStream(
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
  public stopAudioStream(): void {
    playerFunc.StopAudioStreamForPlayer(this.id);
  }
  public playSound(
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
  public static getPoolSize(): number {
    return playerFunc.GetPlayerPoolSize();
  }
  public static getMaxPlayers(): number {
    return playerFunc.GetMaxPlayers();
  }
  public playCrimeReport<P extends BasePlayer>(
    suspect: P,
    crimeId: number
  ): number {
    if (crimeId < 3 || crimeId > 22) {
      logger.warn("[BasePlayer]: Available crime ids range from 3 to 22");
      return 0;
    }
    return playerFunc.PlayCrimeReportForPlayer(this.id, suspect.id, crimeId);
  }
  public interpolateCameraPos(
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
  public interpolateCameraLookAt(
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
  public createExplosion(
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
  public static isConnected<P extends BasePlayer>(player: P): boolean {
    return playerFunc.IsPlayerConnected(player.id);
  }
  public isConnected(): boolean {
    return playerFunc.IsPlayerConnected(this.id);
  }
  public disableRemoteVehicleCollisions(disable: boolean) {
    return playerFunc.DisableRemoteVehicleCollisions(this.id, disable);
  }
  public getVehicle<V extends BaseVehicle>(vehicles: Array<V>): V | undefined {
    if (!this.isInAnyVehicle()) return undefined;
    const vehId: number = playerFunc.GetPlayerVehicleID(this.id);
    return vehicles.find((v) => v.id === vehId);
  }
  public getVehicleSeat(): number {
    return playerFunc.GetPlayerVehicleSeat(this.id);
  }
  public getSurfingVehicle<V extends BaseVehicle>(
    vehicles: Array<V>
  ): V | undefined {
    const vehId = playerFunc.GetPlayerSurfingVehicleID(this.id);
    if (vehId === InvalidEnum.VEHICLE_ID) return undefined;
    return vehicles.find((v) => v.id === vehId);
  }
  public applyAnimation(
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
  public clearAnimations(forceSync = false): void {
    playerFunc.ClearAnimations(this.id, forceSync);
  }
  public getAnimationIndex(): number {
    return playerFunc.GetPlayerAnimationIndex(this.id);
  }
  public getAnimationName() {
    const [animLib, animName] = playerFunc.GetAnimationName(
      this.getAnimationIndex()
    );
    return { animLib, animName };
  }
  public setShopName(shopName: string): void {
    playerFunc.SetPlayerShopName(this.id, shopName);
  }
  public setPosFindZ(x: number, y: number, z = 150): Promise<number> {
    return new Promise<number>((resolve) => {
      playerFunc.SetPlayerPos(this.id, x, y, z);
      setTimeout(() => resolve(playerFunc.SetPlayerPosFindZ(this.id, x, y, z)));
    });
  }
  public setWorldBounds(
    x_max: number,
    x_min: number,
    y_max: number,
    y_min: number
  ): void {
    playerFunc.SetPlayerWorldBounds(this.id, x_max, x_min, y_max, y_min);
  }
  public setChatBubble(
    text: string,
    color: string,
    drawDistance: number,
    expireTime: number
  ): void {
    playerFunc.SetPlayerChatBubble(
      this.id,
      text,
      color,
      drawDistance,
      expireTime
    );
  }
  public getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return playerFunc.GetPlayerDistanceFromPoint(this.id, X, Y, Z);
  }
  public getCustomSkin(): number {
    return playerFunc.GetPlayerCustomSkin(this.id);
  }
  public getTargetPlayer<P extends BasePlayer>(
    players: Array<P>
  ): undefined | P {
    const pid = playerFunc.GetPlayerTargetPlayer(this.id);
    if (pid === InvalidEnum.PLAYER_ID) return undefined;
    return players.find((p) => p.id === pid);
  }
  public getLastShotVectors() {
    const [fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ] =
      playerFunc.GetPlayerLastShotVectors(this.id);
    return { fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ };
  }
  public getWeapon(): WeaponEnum | -1 {
    return playerFunc.GetPlayerWeapon(this.id);
  }
  public getWeaponData(slot: number) {
    if (slot < 0 || slot > 12) {
      logger.error("[BasePlayer]: weapon slots range from 0 to 12");
      return;
    }
    const [weapons, ammo] = playerFunc.GetPlayerWeaponData(this.id, slot);
    return { weapons, ammo };
  }
  public getWeaponState(): WeaponStatesEnum {
    return playerFunc.GetPlayerWeaponState(this.id);
  }
  public giveWeapon(weaponid: WeaponEnum, ammo: number): number {
    return playerFunc.GivePlayerWeapon(this.id, weaponid, ammo);
  }
  public setAmmo(weaponid: number, ammo: number) {
    return playerFunc.SetPlayerAmmo(this.id, weaponid, ammo);
  }
  public getAmmo(): number {
    return playerFunc.GetPlayerAmmo(this.id);
  }
  public setArmedWeapon(weaponid: number): number {
    return playerFunc.SetPlayerArmedWeapon(this.id, weaponid);
  }
  // not test
  public clearDeathMessage() {
    for (let i = 0; i < 5; i++) {
      this.sendDeathMessageToPlayer(
        InvalidEnum.PLAYER_ID,
        InvalidEnum.PLAYER_ID,
        DamageDeathReasonEnum.CONNECT
      );
    }
  }
  public sendDeathMessage<P extends BasePlayer>(
    killer: P | InvalidEnum.PLAYER_ID,
    weapon: WeaponEnum | DamageDeathReasonEnum
  ): void {
    playerFunc.SendDeathMessage(
      killer === InvalidEnum.PLAYER_ID ? killer : killer.id,
      this.id,
      weapon
    );
  }
  public sendDeathMessageToPlayer<P extends BasePlayer>(
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
  public setSpawnInfo(
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
  public redirectDownload(url: string) {
    return playerFunc.RedirectDownload(this.id, url);
  }
  public sendClientCheck(
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
      if (this.isPaused) return reject(new Error("game paused"));
      const p = new Promise<IClientResRaw>((clientResolve, clientReject) => {
        const ping = this.getPing();
        const shouldResTime = (ping >= 1000 ? 1000 : ping) + 300;
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
  public selectTextDraw(color: string): void {
    playerFunc.SelectTextDraw(this.id, color);
  }
  public cancelSelectTextDraw(): void {
    playerFunc.CancelSelectTextDraw(this.id);
  }
  public selectObject(): void {
    playerFunc.SelectObject(this.id);
  }
  public cancelEdit(): void {
    playerFunc.CancelEdit(this.id);
  }
  public getSurfingObject<O extends DynamicObject>(
    objects: Map<number, O>
  ): void | O {
    const id: number = playerFunc.GetPlayerSurfingObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return objects.get(id);
  }
  public isAttachedObjectSlotUsed(index: number): boolean {
    return playerFunc.IsPlayerAttachedObjectSlotUsed(this.id, index);
  }
  public setAttachedObject(
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
    materialcolor1: string,
    materialcolor2: string
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
      materialcolor1,
      materialcolor2
    );
  }
  public removeAttachedObject(index: number): number {
    if (!this.isAttachedObjectSlotUsed(index)) return 0;
    return playerFunc.RemovePlayerAttachedObject(this.id, index);
  }
  public toggleWidescreen(set: boolean): number {
    return ow.TogglePlayerWidescreen(this.id, set);
  }
  public isPlayerWidescreenToggled(): boolean {
    return ow.IsPlayerWidescreenToggled(this.id);
  }
  public getSpawnInfo() {
    return ow.GetSpawnInfo(this.id);
  }
  public getSkillLevel(skill: WeaponSkillsEnum): number {
    return ow.GetPlayerSkillLevel(this.id, skill);
  }
  public isCheckpointActive(): boolean {
    return ow.IsPlayerCheckpointActive(this.id);
  }
  public getCheckpoint() {
    return ow.GetPlayerCheckpoint(this.id);
  }
  public isRaceCheckpointActive(): boolean {
    return ow.IsPlayerRaceCheckpointActive(this.id);
  }
  public getRaceCheckpoint() {
    return ow.GetPlayerRaceCheckpoint(this.id);
  }
  public getWorldBounds() {
    ow.GetPlayerWorldBounds(this.id);
  }
  public isInModShop(): boolean {
    return ow.IsPlayerInModShop(this.id);
  }
  public getSirenState(): number {
    return ow.GetPlayerSirenState(this.id);
  }
  public getLandingGearState(): number {
    return ow.GetPlayerLandingGearState(this.id);
  }
  public getHydraReactorAngle(): number {
    return ow.GetPlayerHydraReactorAngle(this.id);
  }
  public getTrainSpeed(): number {
    return ow.GetPlayerTrainSpeed(this.id);
  }
  public getZAim(): number {
    return ow.GetPlayerZAim(this.id);
  }
  public getSurfingOffsets() {
    return ow.GetPlayerSurfingOffsets(this.id);
  }
  public getRotationQuat() {
    return ow.GetPlayerRotationQuat(this.id);
  }
  public getDialogID(): number {
    return ow.GetPlayerDialogID(this.id);
  }
  public getSpectateID(): number {
    return ow.GetPlayerSpectateID(this.id);
  }
  public getSpectateType(): SpectateModesEnum {
    return ow.GetPlayerSpectateType(this.id);
  }
  public getRawIp(): string {
    return ow.GetPlayerRawIp(this.id);
  }
  public setGravity(gravity: number): number {
    return ow.SetPlayerGravity(this.id, gravity);
  }
  public getGravity(): number {
    return ow.GetPlayerGravity(this.id);
  }
  public setAdmin(admin: boolean) {
    return ow.SetPlayerAdmin(this.id, admin);
  }
  public isSpawned(): boolean {
    return ow.IsPlayerSpawned(this.id);
  }
  public isControllable(): boolean {
    return ow.IsPlayerControllable(this.id);
  }
  public isCameraTargetEnabled(): boolean {
    return ow.IsPlayerCameraTargetEnabled(this.id);
  }
  public toggleGhostMode(toggle: boolean) {
    return ow.TogglePlayerGhostMode(this.id, toggle);
  }
  public getGhostMode(): boolean {
    return ow.GetPlayerGhostMode(this.id);
  }
  public getBuildingsRemoved(): number {
    return ow.GetPlayerBuildingsRemoved(this.id);
  }
  public getAttachedObject(index: number) {
    return ow.GetPlayerAttachedObject(this.id, index);
  }
  public removeWeapon(weaponid: number): number {
    return ow.RemovePlayerWeapon(this.id, weaponid);
  }
  public isAndroid(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this._isAndroid !== null) return resolve(this._isAndroid);
      setTimeout(async () => {
        let tryCut = 1;
        while (tryCut < 10) {
          tryCut++;
          if (!this.isConnected()) {
            reject(new Error("disconnect"));
            break;
          }
          try {
            const p = await this.sendClientCheck(0x48, 0, 0, 2);
            if (p) {
              this._isAndroid = p.actionid !== 0x48;
              resolve(this._isAndroid);
              break;
            }
            // eslint-disable-next-line no-empty
          } catch (error) {}
        }
        if (tryCut === 10) reject(new Error("try limit"));
      });
    });
  }
}
