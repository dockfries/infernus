import * as w from "@infernus/wrapper";

import * as f from "core/wrapper/native/functions";

import type {
  WeaponSkillsEnum,
  FightingStylesEnum,
  CameraModesEnum,
  WeaponEnum,
  WeaponStatesEnum,
  BoneIdsEnum,
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
import { getAnimateDurationByLibName } from "../../utils/animateUtils";
import * as h from "../../utils/helperUtils";
import { logger } from "../../logger";

import type { Vehicle } from "../vehicle";
import type { DynamicObject } from "core/wrapper/streamer";
import { defineEvent } from "../bus";

export const [onCheckResponse] = defineEvent({
  name: "OnClientCheckResponse",
  beforeEach(id: number, actionId: number, memAddr: number, data: number) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { player: Player.getInstance(id)!, actionId, memAddr, data };
  },
});

export class Player {
  static readonly players = new Map<number, Player>();

  charset = "ISO-8859-1";
  locale = "en_US";

  lastDrunkLevel = 0;
  lastFps = 0;
  lastUpdateTick = 0;
  lastUpdateFpsTick = 0;

  isPaused = false;

  isRecording = false;

  constructor(public readonly id: number) {}

  sendClientMessage(color: string | number, msg: string): number {
    return h.SendClientMessage(this, color, msg);
  }

  static sendClientMessageToAll(
    players: Array<Player>,
    color: string | number,
    msg: string
  ) {
    h.SendClientMessageToAll(players, color, msg);
  }

  sendPlayerMessage(player: Player, message: string): number {
    return h.SendPlayerMessageToPlayer(player, this.id, message);
  }

  sendPlayerMessageToAll(players: Array<Player>, message: string): number {
    return h.SendPlayerMessageToAll(players, this.id, message);
  }

  isNpc(): boolean {
    return f.IsPlayerNPC(this.id);
  }

  // first call will return 0;
  // should be called at one second intervals, implemented internally by throttling
  getFps(): number {
    return this.lastFps;
  }
  getDrunkLevel(): number {
    return f.GetPlayerDrunkLevel(this.id);
  }
  setDrunkLevel(level: number): void {
    if (level < 0 || level > 50000)
      return logger.error(
        new Error("[Player]: player's drunk level ranges from 0 to 50000")
      );
    f.SetPlayerDrunkLevel(this.id, level);
  }
  allowTeleport(allow: boolean): void {
    w.AllowPlayerTeleport(this.id, allow);
  }
  isTeleportAllowed() {
    return w.IsPlayerTeleportAllowed(this.id);
  }
  enableCameraTarget(enable: boolean): void {
    f.EnablePlayerCameraTarget(this.id, enable);
  }
  enableStuntBonus(enable: boolean): void {
    f.EnableStuntBonusForPlayer(this.id, enable);
  }
  getInterior(): number {
    return f.GetPlayerInterior(this.id);
  }
  setInterior(interiorId: number): number {
    return f.SetPlayerInterior(this.id, interiorId);
  }
  showPlayerNameTag(showPlayer: Player, show: boolean): void {
    f.ShowPlayerNameTagForPlayer(this.id, showPlayer.id, show);
  }
  setColor(color: string | number): void {
    f.SetPlayerColor(this.id, color);
  }
  getColor(): number {
    return f.GetPlayerColor(this.id);
  }
  setPlayerMarker(showPlayer: Player, color: string | number) {
    f.SetPlayerMarkerForPlayer(this.id, showPlayer.id, color);
  }
  resetMoney(): number {
    return f.ResetPlayerMoney(this.id);
  }
  getMoney(): number {
    return f.GetPlayerMoney(this.id);
  }
  giveMoney(money: number): number {
    return f.GivePlayerMoney(this.id, money);
  }
  resetWeapons(): number {
    return f.ResetPlayerWeapons(this.id);
  }
  spawn(): number {
    if (this.isSpectating()) {
      this.toggleSpectating(false);
      return 1;
    }
    return f.SpawnPlayer(this.id);
  }
  setHealth(health: number): number {
    return f.SetPlayerHealth(this.id, health);
  }
  getHealth(): number {
    return f.GetPlayerHealth(this.id);
  }
  toggleClock(toggle: boolean): number {
    return f.TogglePlayerClock(this.id, toggle);
  }
  toggleControllable(toggle: boolean): number {
    return f.TogglePlayerControllable(this.id, toggle);
  }
  toggleSpectating(toggle: boolean): number {
    return f.TogglePlayerSpectating(this.id, toggle);
  }
  spectatePlayer(targetPlayer: Player, mode = SpectateModesEnum.NORMAL) {
    return f.PlayerSpectatePlayer(this.id, targetPlayer.id, mode);
  }
  spectateVehicle<V extends Vehicle>(
    targetVehicle: V,
    mode = SpectateModesEnum.NORMAL
  ) {
    return f.PlayerSpectateVehicle(this.id, targetVehicle.id, mode);
  }
  forceClassSelection(): void {
    f.ForceClassSelection(this.id);
  }
  kick(): void {
    f.Kick(this.id);
  }
  ban(): void {
    f.Ban(this.id);
  }
  banEx(reason: string, charset: string): void {
    h.BanEx(this.id, reason, charset);
  }
  isAdmin() {
    return f.IsPlayerAdmin(this.id);
  }
  isInRangeOfPoint(range: number, x: number, y: number, z: number) {
    return f.IsPlayerInRangeOfPoint(this.id, range, x, y, z);
  }
  isStreamedIn(forplayer: Player) {
    return f.IsPlayerStreamedIn(this.id, forplayer.id);
  }
  setSkin(skinId: number, ignoreRange = false): number {
    if (!ignoreRange && (skinId < 0 || skinId > 311 || skinId == 74)) return 0;
    if (this.getHealth() <= 0) return 0;
    if (this.isInAnyVehicle()) return 0;
    if (this.getSpecialAction() === SpecialActionsEnum.DUCK) return 0;
    return f.SetPlayerSkin(this.id, skinId);
  }
  getSkin(): number {
    return f.GetPlayerSkin(this.id);
  }
  isInAnyVehicle(): boolean {
    return f.IsPlayerInAnyVehicle(this.id);
  }
  getSpecialAction(): SpecialActionsEnum {
    return f.GetPlayerSpecialAction(this.id);
  }
  setSpecialAction(actionId: SpecialActionsEnum): number {
    return f.SetPlayerSpecialAction(this.id, actionId);
  }
  setScore(score: number): number {
    return f.SetPlayerScore(this.id, score);
  }
  getScore(): number {
    return f.GetPlayerScore(this.id);
  }
  getPing(): number {
    return f.GetPlayerPing(this.id) || 0;
  }
  setPos(x: number, y: number, z: number): number {
    return f.SetPlayerPos(this.id, x, y, z);
  }
  getPos(): TPos | undefined {
    if (
      this.isSpectating() ||
      this.isWasted() ||
      this.getState() === PlayerStateEnum.NONE
    )
      return undefined;
    const [x, y, z] = f.GetPlayerPos(this.id);
    return { x, y, z };
  }
  isSpectating(): boolean {
    return this.getState() === PlayerStateEnum.SPECTATING;
  }
  isWasted(): boolean {
    return this.getState() === PlayerStateEnum.WASTED;
  }
  getState(): PlayerStateEnum {
    return f.GetPlayerState(this.id);
  }
  getVersion(): string {
    if (this.isNpc()) return "";
    return f.GetPlayerVersion(this.id);
  }
  setVirtualWorld(worldId: number): number {
    return f.SetPlayerVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    return f.GetPlayerVirtualWorld(this.id);
  }
  removeFromVehicle(): number {
    return f.RemovePlayerFromVehicle(this.id);
  }
  setWantedLevel(level: number): number {
    if (level < 0 || level > 6) {
      logger.error("[Player]: player's wanted level ranges from 0 to 6");
      return 0;
    }
    return f.SetPlayerWantedLevel(this.id, level);
  }
  getWantedLevel(): number {
    return f.GetPlayerWantedLevel(this.id);
  }
  setFacingAngle(ang: number): number {
    return f.SetPlayerFacingAngle(this.id, ang);
  }
  getFacingAngle(): number {
    return f.GetPlayerFacingAngle(this.id);
  }
  setWeather(weather: number): void {
    if (weather < 0 || weather > 255) {
      logger.warn("[Player]: The valid weather value is only 0 to 255");
      return;
    }
    f.SetPlayerWeather(this.id, weather);
  }
  getWeather(): number {
    return w.GetPlayerWeather(this.id);
  }
  setTime(hour: number, minute: number): void | number {
    if (hour < 0 || hour > 23) {
      logger.warn("[Player]: The valid hour value is only 0 to 23");
      return;
    }
    if (minute < 0 || minute > 59) {
      logger.warn("[Player]: The valid minute value is only 0 to 59");
      return;
    }
    return f.SetPlayerTime(this.id, hour, minute);
  }
  getTime() {
    const [hour, minute] = f.GetPlayerTime(this.id);
    return { hour, minute };
  }
  removeBuilding(
    modelId: number,
    fX: number,
    fY: number,
    fZ: number,
    fRadius: number
  ): void {
    f.RemoveBuildingForPlayer(this.id, modelId, fX, fY, fZ, fRadius);
  }
  setTeam(team: number): void {
    if (team < 0 || team > InvalidEnum.NO_TEAM) return;
    f.SetPlayerTeam(this.id, team);
  }
  getTeam(): number {
    return f.GetPlayerTeam(this.id);
  }
  setSkillLevel(skill: WeaponSkillsEnum, level: number): void {
    if (level < 0 || level > 999) {
      logger.warn("[Player]: The valid skill level is only 0 to 999");
      return;
    }
    f.SetPlayerSkillLevel(this.id, skill, level);
  }
  getName(): string {
    return h.GetPlayerName(this);
  }
  setName(name: string): number {
    return h.SetPlayerName(this, name);
  }
  setVelocity(x: number, y: number, z: number): number {
    return f.SetPlayerVelocity(this.id, x, y, z);
  }
  getVelocity(): TPos {
    const [x, y, z] = f.GetPlayerVelocity(this.id);
    return { x, y, z };
  }
  getKeys() {
    const [keys, updown, leftright] = f.GetPlayerKeys(this.id);
    return { keys, updown, leftright };
  }
  getIp(): string {
    return f.GetPlayerIp(this.id);
  }
  getFightingStyle(): FightingStylesEnum {
    return f.GetPlayerFightingStyle(this.id);
  }
  setFightingStyle(style: FightingStylesEnum): void {
    f.SetPlayerFightingStyle(this.id, style);
  }
  setArmour(armour: number): number {
    return f.SetPlayerArmour(this.id, armour);
  }
  getArmour(): number {
    return f.GetPlayerArmour(this.id);
  }
  setCameraBehind(): number {
    return f.SetCameraBehindPlayer(this.id);
  }
  setCameraPos(x: number, y: number, z: number): number {
    return f.SetPlayerCameraPos(this.id, x, y, z);
  }
  setCameraLookAt(
    x: number,
    y: number,
    z: number,
    cut: CameraCutStylesEnum
  ): number {
    return f.SetPlayerCameraLookAt(this.id, x, y, z, cut);
  }
  getCameraAspectRatio(): number {
    return f.GetPlayerCameraAspectRatio(this.id);
  }
  getCameraFrontVector(): TPos {
    const [x, y, z] = f.GetPlayerCameraFrontVector(this.id);
    return { x, y, z };
  }
  getCameraMode(): CameraModesEnum {
    return f.GetPlayerCameraMode(this.id);
  }
  getCameraPos(): TPos {
    const [x, y, z] = f.GetPlayerCameraPos(this.id);
    return { x, y, z };
  }
  getCameraTargetPlayer(players: Array<Player>): Player | undefined {
    const target = f.GetPlayerCameraTargetPlayer(this.id);
    return players.find((p) => p.id === target);
  }
  getCameraTargetVehicle<V extends Vehicle>(vehicles: Array<V>): V | undefined {
    const target = f.GetPlayerCameraTargetVehicle(this.id);
    return vehicles.find((v) => v.id === target);
  }
  getCameraZoom(): number {
    return f.GetPlayerCameraZoom(this.id);
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
    return f.PlayAudioStreamForPlayer(
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
    f.StopAudioStreamForPlayer(this.id);
  }
  playSound(
    soundid: number,
    relativeX = 0.0,
    relativeY = 0.0,
    relativeZ = 0.0
  ): number {
    return f.PlayerPlaySound(this.id, soundid, relativeX, relativeY, relativeZ);
  }
  static getPoolSize(): number {
    return f.GetPlayerPoolSize();
  }
  static getMaxPlayers(): number {
    return f.GetMaxPlayers();
  }
  playCrimeReport(suspect: Player, crimeId: number): number {
    if (crimeId < 3 || crimeId > 22) {
      logger.warn("[Player]: Available crime ids range from 3 to 22");
      return 0;
    }
    return f.PlayCrimeReportForPlayer(this.id, suspect.id, crimeId);
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
    f.InterpolateCameraPos(
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
    f.InterpolateCameraLookAt(
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
      logger.error("[Player]: The valid explosion type value is only 0 to 13");
      return 0;
    }
    return f.CreateExplosionForPlayer(this.id, X, Y, Z, type, Radius);
  }
  static isConnected(id: number): boolean {
    return f.IsPlayerConnected(id);
  }
  isConnected(): boolean {
    return f.IsPlayerConnected(this.id);
  }
  disableRemoteVehicleCollisions(disable: boolean) {
    return f.DisableRemoteVehicleCollisions(this.id, disable);
  }
  getVehicle<V extends Vehicle>(vehicles: Array<V>): V | undefined {
    if (!this.isInAnyVehicle()) return undefined;
    const vehId: number = f.GetPlayerVehicleID(this.id);
    return vehicles.find((v) => v.id === vehId);
  }
  getVehicleSeat(): number {
    return f.GetPlayerVehicleSeat(this.id);
  }
  getSurfingVehicle<V extends Vehicle>(vehicles: Array<V>): V | undefined {
    const vehId = f.GetPlayerSurfingVehicleID(this.id);
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
      return logger.error("[Player]: Invalid anim library or name");
    f.ApplyAnimation(
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
    f.ClearAnimations(this.id, forceSync);
  }
  getAnimationIndex(): number {
    return f.GetPlayerAnimationIndex(this.id);
  }
  getAnimationName() {
    const [animLib, animName] = f.GetAnimationName(this.getAnimationIndex());
    return { animLib, animName };
  }
  setShopName(shopName: string): void {
    f.SetPlayerShopName(this.id, shopName);
  }
  setPosFindZ(x: number, y: number, z = 150): Promise<number> {
    return new Promise<number>((resolve) => {
      f.SetPlayerPos(this.id, x, y, z);
      setTimeout(() => resolve(f.SetPlayerPosFindZ(this.id, x, y, z)));
    });
  }
  setWorldBounds(
    x_max: number,
    x_min: number,
    y_max: number,
    y_min: number
  ): void {
    f.SetPlayerWorldBounds(this.id, x_max, x_min, y_max, y_min);
  }
  setChatBubble(
    text: string,
    color: string | number,
    drawDistance: number,
    expireTime: number
  ): void {
    f.SetPlayerChatBubble(this.id, text, color, drawDistance, expireTime);
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return f.GetPlayerDistanceFromPoint(this.id, X, Y, Z);
  }
  getCustomSkin(): number {
    return f.GetPlayerCustomSkin(this.id);
  }
  getTargetPlayer(players: Array<Player>): undefined | Player {
    const pid = f.GetPlayerTargetPlayer(this.id);
    if (pid === InvalidEnum.PLAYER_ID) return undefined;
    return players.find((p) => p.id === pid);
  }
  getLastShotVectors() {
    const [fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ] =
      f.GetPlayerLastShotVectors(this.id);
    return { fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ };
  }
  getWeapon(): WeaponEnum | -1 {
    return f.GetPlayerWeapon(this.id);
  }
  getWeaponData(slot: number) {
    if (slot < 0 || slot > 12) {
      logger.error("[Player]: weapon slots range from 0 to 12");
      return;
    }
    const [weapons, ammo] = f.GetPlayerWeaponData(this.id, slot);
    return { weapons, ammo };
  }
  getWeaponState(): WeaponStatesEnum {
    return f.GetPlayerWeaponState(this.id);
  }
  giveWeapon(weaponid: WeaponEnum, ammo: number): number {
    return f.GivePlayerWeapon(this.id, weaponid, ammo);
  }
  setAmmo(weaponid: number, ammo: number) {
    return f.SetPlayerAmmo(this.id, weaponid, ammo);
  }
  getAmmo(): number {
    return f.GetPlayerAmmo(this.id);
  }
  setArmedWeapon(weaponid: number): number {
    return f.SetPlayerArmedWeapon(this.id, weaponid);
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
  sendDeathMessage(
    killer: Player | InvalidEnum.PLAYER_ID,
    weapon: WeaponEnum | DamageDeathReasonEnum
  ): void {
    f.SendDeathMessage(
      killer === InvalidEnum.PLAYER_ID ? killer : killer.id,
      this.id,
      weapon
    );
  }
  sendDeathMessageToPlayer(
    killer: Player | InvalidEnum.PLAYER_ID,
    killee: Player | InvalidEnum.PLAYER_ID,
    weapon: WeaponEnum | DamageDeathReasonEnum
  ): void {
    f.SendDeathMessageToPlayer(
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
    f.SetSpawnInfo(
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
    return f.RedirectDownload(this.id, url);
  }
  sendClientCheck(
    type: number,
    memAddr: number,
    memOffset: number,
    byteCount: number
  ) {
    const validTypes = [2, 5, 69, 70, 71, 72];
    if (!validTypes.includes(type)) {
      return logger.error(
        `[Player]: sendClientCheck valid types are ${validTypes.toString()}`
      );
    }

    return new Promise<IClientResRaw>((resolve, reject) => {
      if (this.isPaused) {
        return reject(
          "[Player]: An attempt to check the player client response, but the player paused the game"
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
            reject(timeoutMsg);
          } else {
            resolve({ actionId, memAddr, data });
          }
          const ret = next();
          off();
          return ret;
        }
      );

      timer = setTimeout(() => {
        off();
        reject(timeoutMsg);
      }, shouldResTime);

      f.SendClientCheck(this.id, type, memAddr, memOffset, byteCount);
    });
  }
  selectTextDraw(color: string | number): void {
    f.SelectTextDraw(this.id, color);
  }
  cancelSelectTextDraw(): void {
    f.CancelSelectTextDraw(this.id);
  }
  beginObjectSelecting(): void {
    f.BeginObjectSelecting(this.id);
  }
  endObjectEditing(): void {
    f.EndObjectEditing(this.id);
  }
  getSurfingObject(objects: Map<number, DynamicObject>): void | DynamicObject {
    const id: number = f.GetPlayerSurfingObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return objects.get(id);
  }
  getSurfingPlayerObject(
    objects: Map<number, DynamicObject>
  ): void | DynamicObject {
    const id: number = f.GetPlayerSurfingPlayerObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return objects.get(id);
  }
  isAttachedObjectSlotUsed(index: number): boolean {
    return f.IsPlayerAttachedObjectSlotUsed(this.id, index);
  }
  setAttachedObject(
    index: number,
    modelId: number,
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
    materialColor1: string | number,
    materialColor2: string | number
  ): void | number {
    if (this.isAttachedObjectSlotUsed(index)) return 0;
    return f.SetPlayerAttachedObject(
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
      materialColor2
    );
  }
  removeAttachedObject(index: number): number {
    if (!this.isAttachedObjectSlotUsed(index)) return 0;
    return f.RemovePlayerAttachedObject(this.id, index);
  }
  toggleWidescreen(set: boolean): number {
    return w.TogglePlayerWidescreen(this.id, set);
  }
  isPlayerWidescreenToggled(): boolean {
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
  setGravity(gravity: number): number {
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
  removeWeapon(weaponid: number): number {
    return w.RemovePlayerWeapon(this.id, weaponid);
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
    return f.gpci(this.id, charset);
  }

  static getInstance(id: number) {
    return this.players.get(id);
  }
  static getInstances() {
    return [...this.players.values()];
  }
}
