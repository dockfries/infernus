import { IPlayerSettings } from "@/interfaces";
import {
  BanEx,
  GetPlayerName,
  SendClientMessage,
  SetPlayerName,
} from "@/utils/helperUtils";
import {
  AllowPlayerTeleport,
  EnablePlayerCameraTarget,
  EnableStuntBonusForPlayer,
  GetPlayerColor,
  GetPlayerDrunkLevel,
  GetPlayerHealth,
  GetPlayerInterior,
  GetPlayerMoney,
  GivePlayerMoney,
  IsPlayerNPC,
  ResetPlayerMoney,
  ResetPlayerWeapons,
  SetPlayerColor,
  SetPlayerDrunkLevel,
  SetPlayerHealth,
  SetPlayerInterior,
  SetPlayerMarkerForPlayer,
  ShowPlayerNameTagForPlayer,
  SpawnPlayer,
  TogglePlayerClock,
  TogglePlayerControllable,
  TogglePlayerSpectating,
  PlayerSpectatePlayer,
  PlayerSpectateVehicle,
  ForceClassSelection,
  Kick,
  Ban,
  IsPlayerAdmin,
  IsPlayerInRangeOfPoint,
  IsPlayerStreamedIn,
  SetPlayerSkin,
  GetPlayerSkin,
  IsPlayerInAnyVehicle,
  GetPlayerSpecialAction,
  SetPlayerSpecialAction,
  SetPlayerScore,
  GetPlayerScore,
  GetPlayerPing,
  SetPlayerPos,
  GetPlayerPos,
  GetPlayerState,
  GetPlayerVersion,
  SetPlayerVirtualWorld,
  GetPlayerVirtualWorld,
  RemovePlayerFromVehicle,
  SetPlayerWantedLevel,
  GetPlayerWantedLevel,
  SetPlayerFacingAngle,
  GetPlayerFacingAngle,
  SetPlayerWeather,
  SetPlayerTime,
  GetPlayerTime,
  RemoveBuildingForPlayer,
  SetPlayerTeam,
  GetPlayerTeam,
  SetPlayerSkillLevel,
  SetPlayerVelocity,
  GetPlayerVelocity,
  GetPlayerKeys,
  GetPlayerIp,
  GetPlayerFightingStyle,
  SetPlayerFightingStyle,
  SetPlayerArmour,
  GetPlayerArmour,
  SetCameraBehindPlayer,
  SetPlayerCameraPos,
  SetPlayerCameraLookAt,
  GetPlayerCameraAspectRatio,
  GetPlayerCameraFrontVector,
  GetPlayerCameraPos,
  GetPlayerCameraMode,
  GetPlayerCameraTargetPlayer,
  GetPlayerCameraTargetVehicle,
  GetPlayerCameraZoom,
  StopAudioStreamForPlayer,
  PlayAudioStreamForPlayer,
  PlayerPlaySound,
  GetPlayerPoolSize,
  PlayCrimeReportForPlayer,
  InterpolateCameraPos,
  InterpolateCameraLookAt,
  CreateExplosionForPlayer,
  GetMaxPlayers,
  IsPlayerConnected,
  DisableRemoteVehicleCollisions,
  GetPlayerVehicleID,
  GetPlayerVehicleSeat,
  GetPlayerSurfingVehicleID,
  ApplyAnimation,
  ClearAnimations,
  GetPlayerAnimationIndex,
  GetAnimationName,
  SetPlayerShopName,
  SetPlayerPosFindZ,
  SetPlayerWorldBounds,
  SetPlayerChatBubble,
  GetPlayerDistanceFromPoint,
  GetPlayerCustomSkin,
  GetPlayerTargetPlayer,
  GetPlayerLastShotVectors,
} from "@/wrapper/functions";
import logger from "@/logger";
import { BaseGameMode } from "../gamemode";
import {
  CameraCutStylesEnum,
  CameraModesEnum,
  FightingStylesEnum,
  InvalidEnum,
  PlayerStateEnum,
  SpecialActionsEnum,
  SpectateModesEnum,
  WeaponSkillsEnum,
} from "@/enums";
import { BaseVehicle } from "../vehicle";
import { basePos } from "@/types";
import { GetPlayerWeather } from "omp-wrapper";
import { getAnimateDurationByLibName } from "@/utils/animateUtils";
import { I18n } from "../i18n";

export abstract class BasePlayer {
  private _id: number;
  public isRecording = false;
  // public name = "";
  // Note: The locale and character set must be assigned at application level development time. Otherwise i18n will be problematic.
  public settings: IPlayerSettings = {
    locale: "",
    charset: BaseGameMode.charset,
  };
  public lastDrunkLevel = 0;
  public lastFps = 0;
  private _isNpc: boolean;
  public isPaused = false;

  get charset() {
    return this.settings.charset;
  }
  set charset(charset: string) {
    this.settings.charset = charset;
  }

  get locale(): string {
    return this.settings.locale;
  }
  set locale(language: string) {
    this.settings.locale = language;
  }

  get id(): number {
    return this._id;
  }

  public constructor(id: number) {
    this._id = id;
    this._isNpc = IsPlayerNPC(this.id);
  }

  public sendClientMessage(color: string, msg: string): number {
    return SendClientMessage(this, color, msg);
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
    return GetPlayerDrunkLevel(this.id);
  }
  public setDrunkLevel(level: number): void {
    if (level < 0 || level > 50000)
      return logger.error(
        new Error("[BasePlayer]: player's drunk level ranges from 0 to 50000")
      );
    SetPlayerDrunkLevel(this.id, level);
  }
  public allowTeleport(allow: boolean): void {
    AllowPlayerTeleport(this.id, allow);
  }
  public enableCameraTarget(enable: boolean): void {
    EnablePlayerCameraTarget(this.id, enable);
  }
  public enableStuntBonus(enable: boolean): void {
    EnableStuntBonusForPlayer(this.id, enable);
  }
  public getInterior(): number {
    return GetPlayerInterior(this.id);
  }
  public setInterior(interiorId: number): number {
    return SetPlayerInterior(this.id, interiorId);
  }
  public showPlayerNameTag<P extends BasePlayer>(
    showPlayer: P,
    show: boolean
  ): void {
    ShowPlayerNameTagForPlayer(this.id, showPlayer.id, show);
  }
  public setColor(color: string): void {
    SetPlayerColor(this.id, color);
  }
  public getColor(): number {
    return GetPlayerColor(this.id);
  }
  public setPlayerMarker<P extends BasePlayer>(showPlayer: P, color: string) {
    SetPlayerMarkerForPlayer(this.id, showPlayer.id, color);
  }
  public resetMoney(): number {
    return ResetPlayerMoney(this.id);
  }
  public getMoney(): number {
    return GetPlayerMoney(this.id);
  }
  public giveMoney(money: number): number {
    return GivePlayerMoney(this.id, money);
  }
  public resetWeapons(): number {
    return ResetPlayerWeapons(this.id);
  }
  public spawn(): number {
    if (this.isSpectating()) {
      this.toggleSpectating(false);
      return 1;
    }
    return SpawnPlayer(this.id);
  }
  public setHealth(health: number): number {
    return SetPlayerHealth(this.id, health);
  }
  public getHealth(): number {
    return GetPlayerHealth(this.id);
  }
  public toggleClock(toggle: boolean): number {
    return TogglePlayerClock(this.id, toggle);
  }
  public toggleControllable(toggle: boolean): number {
    return TogglePlayerControllable(this.id, toggle);
  }
  public toggleSpectating(toggle: boolean): number {
    return TogglePlayerSpectating(this.id, toggle);
  }
  public spectatePlayer<P extends BasePlayer>(
    targetPlayer: P,
    mode: SpectateModesEnum
  ) {
    return PlayerSpectatePlayer(this.id, targetPlayer.id, mode);
  }
  public spectateVehicle<V extends BaseVehicle>(
    targetVehicle: V,
    mode: SpectateModesEnum
  ) {
    return PlayerSpectateVehicle(this.id, targetVehicle.id, mode);
  }
  public forceClassSelection(): void {
    ForceClassSelection(this.id);
  }
  public kick(): void {
    Kick(this.id);
  }
  public ban(): void {
    Ban(this.id);
  }
  public banEx(reason: string, charset: string): void {
    const buf = I18n.encodeToBuf(reason, charset);
    BanEx(this.id, buf);
  }
  public isAdmin() {
    return IsPlayerAdmin(this.id);
  }
  public isInRangeOfPoint(range: number, x: number, y: number, z: number) {
    return IsPlayerInRangeOfPoint(this.id, range, x, y, z);
  }
  public isStreamedIn<P extends BasePlayer>(forplayer: P) {
    return IsPlayerStreamedIn(this.id, forplayer.id);
  }
  public setSkin(skinId: number): number {
    if (skinId < 0 || skinId > 311 || skinId == 74) return 0;
    if (this.getHealth() <= 0) return 0;
    if (this.isInAnyVehicle()) return 0;
    if (this.getSpecialAction() === SpecialActionsEnum.DUCK) return 0;
    return SetPlayerSkin(this.id, skinId);
  }
  public getSkin(): number {
    return GetPlayerSkin(this.id);
  }
  public isInAnyVehicle(): boolean {
    return IsPlayerInAnyVehicle(this.id);
  }
  public getSpecialAction(): SpecialActionsEnum {
    return GetPlayerSpecialAction(this.id);
  }
  public setSpecialAction(actionId: SpecialActionsEnum): number {
    return SetPlayerSpecialAction(this.id, actionId);
  }
  public setScore(score: number): number {
    return SetPlayerScore(this.id, score);
  }
  public getScore(): number {
    return GetPlayerScore(this.id);
  }
  public getPing(): number {
    return GetPlayerPing(this.id);
  }
  public setPos(x: number, y: number, z: number): number {
    return SetPlayerPos(this.id, x, y, z);
  }
  public getPos(): basePos | undefined {
    if (
      this.isSpectating() ||
      this.isWasted() ||
      this.getState() === PlayerStateEnum.NONE
    )
      return undefined;
    const [x, y, z] = GetPlayerPos(this.id);
    return { x, y, z };
  }
  public isSpectating(): boolean {
    return this.getState() === PlayerStateEnum.SPECTATING;
  }
  public isWasted(): boolean {
    return this.getState() === PlayerStateEnum.WASTED;
  }
  public getState(): PlayerStateEnum {
    return GetPlayerState(this.id);
  }
  public getVersion(): string {
    if (this.isNpc()) return "";
    return GetPlayerVersion(this.id);
  }
  public setVirtualWorld(worldId: number): number {
    return SetPlayerVirtualWorld(this.id, worldId);
  }
  public getVirtualWorld(): number {
    return GetPlayerVirtualWorld(this.id);
  }
  public removeFromVehicle(): number {
    return RemovePlayerFromVehicle(this.id);
  }
  public setWantedLevel(level: number): number {
    if (level < 0 || level > 6) {
      logger.error("[BasePlayer]: player's wanted level ranges from 0 to 6");
      return 0;
    }
    return SetPlayerWantedLevel(this.id, level);
  }
  public getWantedLevel(): number {
    return GetPlayerWantedLevel(this.id);
  }
  public setFacingAngle(ang: number): number {
    return SetPlayerFacingAngle(this.id, ang);
  }
  public getFacingAngle(): number {
    return GetPlayerFacingAngle(this.id);
  }
  public setWeather(weather: number): void {
    if (weather < 0 || weather > 255) {
      logger.warn("[BasePlayer]: The valid weather value is only 0 to 255");
      return;
    }
    SetPlayerWeather(this.id, weather);
  }
  // omp-wrapper
  public getWeather(): number {
    return GetPlayerWeather(this.id);
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
    return SetPlayerTime(this.id, hour, minute);
  }
  public getTime() {
    const [hour, minute] = GetPlayerTime(this.id);
    return { hour, minute };
  }
  public removeBuilding(
    modelid: number,
    fX: number,
    fY: number,
    fZ: number,
    fRadius: number
  ): void {
    RemoveBuildingForPlayer(this.id, modelid, fX, fY, fZ, fRadius);
  }
  public setTeam(team: number): number {
    return SetPlayerTeam(this.id, team);
  }
  public getTeam(): number {
    return GetPlayerTeam(this.id);
  }
  public setSkillLevel(skill: WeaponSkillsEnum, level: number): void {
    if (level < 0 || level > 999) {
      logger.warn("[BasePlayer]: The valid skill level is only 0 to 999");
      return;
    }
    SetPlayerSkillLevel(this.id, skill, level);
  }
  public getName(): string {
    return GetPlayerName(this);
  }
  public setName(name: string): number {
    return SetPlayerName(this, name);
  }
  public setVelocity(x: number, y: number, z: number): number {
    return SetPlayerVelocity(this.id, x, y, z);
  }
  public getVelocity(): basePos {
    const [x, y, z] = GetPlayerVelocity(this.id);
    return { x, y, z };
  }
  public getKeys() {
    const [keys, updown, leftright] = GetPlayerKeys(this.id);
    return { keys, updown, leftright };
  }
  public getIp(): string {
    return GetPlayerIp(this.id);
  }
  public getFightingStyle(): FightingStylesEnum {
    return GetPlayerFightingStyle(this.id);
  }
  public setFightingStyle(style: FightingStylesEnum): void {
    SetPlayerFightingStyle(this.id, style);
  }
  public setArmour(armour: number): number {
    return SetPlayerArmour(this.id, armour);
  }
  public getArmour(): number {
    return GetPlayerArmour(this.id);
  }
  public setCameraBehind(): number {
    return SetCameraBehindPlayer(this.id);
  }
  public setCameraPos(x: number, y: number, z: number): number {
    return SetPlayerCameraPos(this.id, x, y, z);
  }
  public setCameraLookAt(
    x: number,
    y: number,
    z: number,
    cut: CameraCutStylesEnum
  ): number {
    return SetPlayerCameraLookAt(this.id, x, y, z, cut);
  }
  public getCameraAspectRatio(): number {
    return GetPlayerCameraAspectRatio(this.id);
  }
  public getCameraFrontVector(): basePos {
    const [x, y, z] = GetPlayerCameraFrontVector(this.id);
    return { x, y, z };
  }
  public getCameraMode(): CameraModesEnum {
    return GetPlayerCameraMode(this.id);
  }
  public getCameraPos(): basePos {
    const [x, y, z] = GetPlayerCameraPos(this.id);
    return { x, y, z };
  }
  public getCameraTargetPlayer<P extends BasePlayer>(
    players: Array<P>
  ): P | undefined {
    const target = GetPlayerCameraTargetPlayer(this.id);
    return players.find((p) => p.id === target);
  }
  public getCameraTargetVehicle<V extends BaseVehicle>(
    vehicles: Array<V>
  ): V | undefined {
    const target = GetPlayerCameraTargetVehicle(this.id);
    return vehicles.find((v) => v.id === target);
  }
  public getCameraZoom(): number {
    return GetPlayerCameraZoom(this.id);
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
    return PlayAudioStreamForPlayer(
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
    StopAudioStreamForPlayer(this.id);
  }
  public playSound(
    soundid: number,
    relativeX = 0.0,
    relativeY = 0.0,
    relativeZ = 0.0
  ): number {
    return PlayerPlaySound(this.id, soundid, relativeX, relativeY, relativeZ);
  }
  public static getPoolSize(): number {
    return GetPlayerPoolSize();
  }
  public static getMaxPlayers(): number {
    return GetMaxPlayers();
  }
  public playCrimeReport<P extends BasePlayer>(
    suspect: P,
    crimeId: number
  ): number {
    if (crimeId < 3 || crimeId > 22) {
      logger.warn("[BasePlayer]: Available crime ids range from 3 to 22");
      return 0;
    }
    return PlayCrimeReportForPlayer(this.id, suspect.id, crimeId);
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
    InterpolateCameraPos(
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
    InterpolateCameraLookAt(
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
    return CreateExplosionForPlayer(this.id, X, Y, Z, type, Radius);
  }
  public static isConnected<P extends BasePlayer>(player: P) {
    return IsPlayerConnected(player.id);
  }
  public disableRemoteVehicleCollisions(disable: boolean) {
    return DisableRemoteVehicleCollisions(this.id, disable);
  }
  public getVehicle<V extends BaseVehicle>(vehicles: Array<V>): V | undefined {
    if (!this.isInAnyVehicle()) return undefined;
    const vehId: number = GetPlayerVehicleID(this.id);
    return vehicles.find((v) => v.id === vehId);
  }
  public getVehicleSeat(): number {
    return GetPlayerVehicleSeat(this.id);
  }
  public getSurfingVehicle<V extends BaseVehicle>(
    vehicles: Array<V>
  ): V | undefined {
    const vehId = GetPlayerSurfingVehicleID(this.id);
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
    ApplyAnimation(
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
    ClearAnimations(this.id, forceSync);
  }
  public getAnimationIndex(): number {
    return GetPlayerAnimationIndex(this.id);
  }
  public getAnimationName() {
    const [animLib, animName] = GetAnimationName(this.getAnimationIndex());
    return { animLib, animName };
  }
  public setShopName(shopName: string): void {
    SetPlayerShopName(this.id, shopName);
  }
  public setPosFindZ(x: number, y: number, z = 150): Promise<number> {
    return new Promise<number>((resolve) => {
      SetPlayerPos(this.id, x, y, z);
      setTimeout(() => resolve(SetPlayerPosFindZ(this.id, x, y, z)));
    });
  }
  public setWorldBounds(
    x_max: number,
    x_min: number,
    y_max: number,
    y_min: number
  ): void {
    SetPlayerWorldBounds(this.id, x_max, x_min, y_max, y_min);
  }
  public setChatBubble(
    text: string,
    color: string,
    drawDistance: number,
    expireTime: number
  ): void {
    SetPlayerChatBubble(this.id, text, color, drawDistance, expireTime);
  }
  public getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return GetPlayerDistanceFromPoint(this.id, X, Y, Z);
  }
  public getCustomSkin(): number {
    return GetPlayerCustomSkin(this.id);
  }
  public getTargetPlayer<P extends BasePlayer>(
    players: Array<P>
  ): undefined | P {
    const pid = GetPlayerTargetPlayer(this.id);
    if (pid === InvalidEnum.PLAYER_ID) return undefined;
    return players.find((p) => p.id === pid);
  }
  public getLastShotVectors() {
    const [fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ] =
      GetPlayerLastShotVectors(this.id);
    return { fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ };
  }
}
