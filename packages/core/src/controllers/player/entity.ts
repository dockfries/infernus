import * as w from "core/wrapper/native";

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

import type { Vehicle } from "../vehicle/entity";
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
  setDrunkLevel(level: number): void {
    if (level < 0 || level > 50000)
      return logger.error(
        new Error("[Player]: player's drunk level ranges from 0 to 50000")
      );
    w.SetPlayerDrunkLevel(this.id, level);
  }
  allowTeleport(allow: boolean): void {
    w.AllowPlayerTeleport(this.id, allow);
  }
  isTeleportAllowed() {
    return w.IsPlayerTeleportAllowed(this.id);
  }
  enableCameraTarget(enable: boolean): void {
    w.EnablePlayerCameraTarget(this.id, enable);
  }
  enableStuntBonus(enable: boolean): void {
    w.EnableStuntBonusForPlayer(this.id, enable);
  }
  getInterior(): number {
    return w.GetPlayerInterior(this.id);
  }
  setInterior(interiorId: number): number {
    return w.SetPlayerInterior(this.id, interiorId);
  }
  showNameTag(showPlayer: Player, show: boolean): void {
    w.ShowPlayerNameTagForPlayer(this.id, showPlayer.id, show);
  }
  setColor(color: string | number): void {
    w.SetPlayerColor(this.id, color);
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
  resetMoney(): number {
    return w.ResetPlayerMoney(this.id);
  }
  getMoney(): number {
    return w.GetPlayerMoney(this.id);
  }
  giveMoney(money: number): number {
    return w.GivePlayerMoney(this.id, money);
  }
  resetWeapons(): number {
    return w.ResetPlayerWeapons(this.id);
  }
  spawn(): number {
    if (this.isSpectating()) {
      this.toggleSpectating(false);
      return 1;
    }
    return w.SpawnPlayer(this.id);
  }
  setHealth(health: number): number {
    return w.SetPlayerHealth(this.id, health);
  }
  getHealth(): number {
    return w.GetPlayerHealth(this.id);
  }
  toggleClock(toggle: boolean): number {
    return w.TogglePlayerClock(this.id, toggle);
  }
  toggleControllable(toggle: boolean): number {
    return w.TogglePlayerControllable(this.id, toggle);
  }
  toggleSpectating(toggle: boolean): number {
    return w.TogglePlayerSpectating(this.id, toggle);
  }
  spectatePlayer(targetPlayer: Player, mode = SpectateModesEnum.NORMAL) {
    return w.PlayerSpectatePlayer(this.id, targetPlayer.id, mode);
  }
  spectateVehicle(targetVehicle: Vehicle, mode = SpectateModesEnum.NORMAL) {
    return w.PlayerSpectateVehicle(this.id, targetVehicle.id, mode);
  }
  forceClassSelection(): void {
    w.ForceClassSelection(this.id);
  }
  kick(): void {
    w.Kick(this.id);
  }
  ban(): void {
    w.Ban(this.id);
  }
  banEx(reason: string, charset: string): void {
    h.BanEx(this.id, reason, charset);
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
  setSkin(skinId: number, ignoreRange = false): number {
    if (!ignoreRange && (skinId < 0 || skinId > 311 || skinId == 74)) return 0;
    if (this.getHealth() <= 0) return 0;
    if (this.isInAnyVehicle()) return 0;
    if (this.getSpecialAction() === SpecialActionsEnum.DUCK) return 0;
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
  setSpecialAction(actionId: SpecialActionsEnum): number {
    return w.SetPlayerSpecialAction(this.id, actionId);
  }
  setScore(score: number): number {
    return w.SetPlayerScore(this.id, score);
  }
  getScore(): number {
    return w.GetPlayerScore(this.id);
  }
  getPing(): number {
    return w.GetPlayerPing(this.id) || 0;
  }
  setPos(x: number, y: number, z: number): number {
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
  setVirtualWorld(worldId: number): number {
    return w.SetPlayerVirtualWorld(this.id, worldId);
  }
  getVirtualWorld(): number {
    return w.GetPlayerVirtualWorld(this.id);
  }
  removeFromVehicle(): number {
    return w.RemovePlayerFromVehicle(this.id);
  }
  setWantedLevel(level: number): number {
    if (level < 0 || level > 6) {
      logger.error("[Player]: player's wanted level ranges from 0 to 6");
      return 0;
    }
    return w.SetPlayerWantedLevel(this.id, level);
  }
  getWantedLevel(): number {
    return w.GetPlayerWantedLevel(this.id);
  }
  setFacingAngle(ang: number): number {
    return w.SetPlayerFacingAngle(this.id, ang);
  }
  getFacingAngle(): number {
    return w.GetPlayerFacingAngle(this.id);
  }
  setWeather(weather: number): void {
    if (weather < 0 || weather > 255) {
      logger.warn("[Player]: The valid weather value is only 0 to 255");
      return;
    }
    w.SetPlayerWeather(this.id, weather);
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
    fRadius: number
  ): void {
    w.RemoveBuildingForPlayer(this.id, modelId, fX, fY, fZ, fRadius);
  }
  setTeam(team: number): void {
    if (team < 0 || team > InvalidEnum.NO_TEAM) return;
    w.SetPlayerTeam(this.id, team);
  }
  getTeam(): number {
    return w.GetPlayerTeam(this.id);
  }
  setSkillLevel(skill: WeaponSkillsEnum, level: number): void {
    if (level < 0 || level > 999) {
      logger.warn("[Player]: The valid skill level is only 0 to 999");
      return;
    }
    w.SetPlayerSkillLevel(this.id, skill, level);
  }
  getName(): string {
    return h.GetPlayerName(this);
  }
  setName(name: string): number {
    return h.SetPlayerName(this, name);
  }
  setVelocity(x: number, y: number, z: number): number {
    return w.SetPlayerVelocity(this.id, x, y, z);
  }
  getVelocity(): TPos {
    const [x, y, z] = w.GetPlayerVelocity(this.id);
    return { x, y, z };
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
  setFightingStyle(style: FightingStylesEnum): void {
    w.SetPlayerFightingStyle(this.id, style);
  }
  setArmour(armour: number): number {
    return w.SetPlayerArmour(this.id, armour);
  }
  getArmour(): number {
    return w.GetPlayerArmour(this.id);
  }
  setCameraBehind(): number {
    return w.SetCameraBehindPlayer(this.id);
  }
  setCameraPos(x: number, y: number, z: number): number {
    return w.SetPlayerCameraPos(this.id, x, y, z);
  }
  setCameraLookAt(
    x: number,
    y: number,
    z: number,
    cut: CameraCutStylesEnum
  ): number {
    return w.SetPlayerCameraLookAt(this.id, x, y, z, cut);
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
  getCameraTargetPlayer(players: Array<Player>): Player | undefined {
    const target = w.GetPlayerCameraTargetPlayer(this.id);
    return players.find((p) => p.id === target);
  }
  getCameraTargetVehicle(vehicles: Array<Vehicle>) {
    const target = w.GetPlayerCameraTargetVehicle(this.id);
    return vehicles.find((v) => v.id === target);
  }
  getCameraZoom(): number {
    return w.GetPlayerCameraZoom(this.id);
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
    return w.PlayAudioStreamForPlayer(
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
    w.StopAudioStreamForPlayer(this.id);
  }
  playSound(
    soundid: number,
    relativeX = 0.0,
    relativeY = 0.0,
    relativeZ = 0.0
  ): number {
    return w.PlayerPlaySound(this.id, soundid, relativeX, relativeY, relativeZ);
  }
  static getMaxPlayers(): number {
    return w.GetMaxPlayers();
  }
  playCrimeReport(suspect: Player, crimeId: number): number {
    if (crimeId < 3 || crimeId > 22) {
      logger.warn("[Player]: Available crime ids range from 3 to 22");
      return 0;
    }
    return w.PlayCrimeReportForPlayer(this.id, suspect.id, crimeId);
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
    w.InterpolateCameraPos(
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
    w.InterpolateCameraLookAt(
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
    return w.CreateExplosionForPlayer(this.id, X, Y, Z, type, Radius);
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
  getVehicle(vehicles: Array<Vehicle>) {
    if (!this.isInAnyVehicle()) return undefined;
    const vehId: number = w.GetPlayerVehicleID(this.id);
    return vehicles.find((v) => v.id === vehId);
  }
  getVehicleSeat(): number {
    return w.GetPlayerVehicleSeat(this.id);
  }
  getSurfingVehicle(vehicles: Array<Vehicle>) {
    const vehId = w.GetPlayerSurfingVehicleID(this.id);
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
    w.ApplyAnimation(
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
    w.ClearAnimations(this.id, forceSync);
  }
  getAnimationIndex(): number {
    return w.GetPlayerAnimationIndex(this.id);
  }
  getAnimationName() {
    const [animLib, animName] = w.GetAnimationName(this.getAnimationIndex());
    return { animLib, animName };
  }
  setShopName(shopName: string): void {
    w.SetPlayerShopName(this.id, shopName);
  }
  setPosFindZ(x: number, y: number, z = 150): Promise<number> {
    return new Promise<number>((resolve) => {
      w.SetPlayerPos(this.id, x, y, z);
      setTimeout(() => resolve(w.SetPlayerPosFindZ(this.id, x, y, z)));
    });
  }
  setWorldBounds(
    x_max: number,
    x_min: number,
    y_max: number,
    y_min: number
  ): void {
    w.SetPlayerWorldBounds(this.id, x_max, x_min, y_max, y_min);
  }
  clearWorldBounds() {
    return w.ClearPlayerWorldBounds(this.id);
  }
  setChatBubble(
    text: string,
    color: string | number,
    drawDistance: number,
    expireTime: number
  ): void {
    w.SetPlayerChatBubble(this.id, text, color, drawDistance, expireTime);
  }
  getDistanceFromPoint(X: number, Y: number, Z: number): number {
    return w.GetPlayerDistanceFromPoint(this.id, X, Y, Z);
  }
  getCustomSkin(): number {
    return w.GetPlayerCustomSkin(this.id);
  }
  getTargetPlayer(players: Array<Player>): undefined | Player {
    const pid = w.GetPlayerTargetPlayer(this.id);
    if (pid === InvalidEnum.PLAYER_ID) return undefined;
    return players.find((p) => p.id === pid);
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
      logger.error("[Player]: weapon slots range from 0 to 12");
      return;
    }
    const [weapons, ammo] = w.GetPlayerWeaponData(this.id, slot);
    return { weapons, ammo };
  }
  getWeaponState(): WeaponStatesEnum {
    return w.GetPlayerWeaponState(this.id);
  }
  giveWeapon(weaponId: WeaponEnum, ammo: number): number {
    return w.GivePlayerWeapon(this.id, weaponId, ammo);
  }
  setAmmo(weaponId: number, ammo: number) {
    return w.SetPlayerAmmo(this.id, weaponId, ammo);
  }
  getAmmo(): number {
    return w.GetPlayerAmmo(this.id);
  }
  setArmedWeapon(weaponId: number): number {
    return w.SetPlayerArmedWeapon(this.id, weaponId);
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
    w.SendDeathMessage(
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
    w.SendDeathMessageToPlayer(
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
    w.SetSpawnInfo(
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
    return w.RedirectDownload(this.id, url);
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

      w.SendClientCheck(this.id, type, memAddr, memOffset, byteCount);
    });
  }
  selectTextDraw(color: string | number): void {
    w.SelectTextDraw(this.id, color);
  }
  cancelSelectTextDraw(): void {
    w.CancelSelectTextDraw(this.id);
  }
  beginObjectSelecting(): void {
    w.BeginObjectSelecting(this.id);
  }
  endObjectEditing(): void {
    w.EndObjectEditing(this.id);
  }
  getSurfingObject(objects: Map<number, DynamicObject>): void | DynamicObject {
    const id: number = w.GetPlayerSurfingObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return objects.get(id);
  }
  getSurfingPlayerObject(
    objects: Map<number, DynamicObject>
  ): void | DynamicObject {
    const id: number = w.GetPlayerSurfingPlayerObjectID(this.id);
    if (id === InvalidEnum.OBJECT_ID) return;
    return objects.get(id);
  }
  isAttachedObjectSlotUsed(index: number): boolean {
    return w.IsPlayerAttachedObjectSlotUsed(this.id, index);
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
      materialColor2
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
  toggleWidescreen(set: boolean): number {
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
  removeWeapon(weaponId: number): number {
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

  static getInstance(id: number) {
    return this.players.get(id);
  }
  static getInstances() {
    return [...this.players.values()];
  }
}
