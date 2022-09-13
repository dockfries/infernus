import { OnPlayerCommandText, OnPlayerText } from "@/utils/helperUtils";
import {
  OnClientCheckResponse,
  OnPlayerConnect,
  OnPlayerDisconnect,
  OnPlayerClickMap,
  OnPlayerClickPlayer,
  OnPlayerDeath,
  OnPlayerGiveDamage,
  OnPlayerKeyStateChange,
  OnPlayerRequestSpawn,
  OnPlayerSpawn,
  OnPlayerStateChange,
  OnPlayerStreamIn,
  OnPlayerStreamOut,
  OnPlayerTakeDamage,
  OnPlayerUpdate,
  OnEnterExitModShop,
  OnPlayerInteriorChange,
  OnPlayerFinishedDownloading,
  OnPlayerRequestDownload,
} from "@/wrapper/callbacks";
import { I18n } from "../i18n";
import { BasePlayer } from "./basePlayer";
import { CmdBus } from "../command";
import { ICmdErr } from "@/interfaces";
import {
  BodyPartsEnum,
  // BodyPartsEnum,
  InvalidEnum,
  KeysEnum,
  PlayerStateEnum,
  WeaponEnum,
  // WeaponEnum,
} from "@/enums";
import { throttle } from "lodash";

// Each instance can be called to callbacks, so you can split the logic.

const ICmdErrInfo: Record<string, ICmdErr> = {
  format: { code: 0, msg: "Please enter the correct command" },
  notExist: { code: 1, msg: "The command %s you entered does not exist" },
};

abstract class AbstractPlayerEvent<P extends BasePlayer> {
  public readonly players = new Map<number, P>();
  protected abstract newPlayer(playerid: number): P;
  protected abstract onConnect(player: P): void;
  protected abstract onDisconnect(player: P, reason: number): void;
  protected abstract onText(player: P, text: string): void;
  protected abstract onCommandError(player: P, err: ICmdErr): void;
  protected abstract onClientCheckResponse(
    player: P,
    actionid: number,
    memaddr: number,
    retndata: number
  ): void;
  protected abstract onEnterExitModShop(
    player: P,
    enterexit: number,
    interiorid: number
  ): void;
  protected abstract onClickMap(
    player: P,
    fX: number,
    fY: number,
    fZ: number
  ): void;
  protected abstract onClickPlayer(
    player: P,
    clickedPlayer: P,
    source: number
  ): void;
  protected abstract onDeath(
    player: P,
    killer: P | InvalidEnum.PLAYER_ID,
    reason: number
  ): void;
  protected abstract onGiveDamage(
    player: P,
    damage: P,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ): void;
  protected abstract onKeyStateChange(
    player: P,
    newkeys: KeysEnum,
    oldkeys: KeysEnum
  ): void;
  protected abstract onRequestSpawn(player: P): void;
  protected abstract onSpawn(player: P): void;
  protected abstract onStateChange(
    player: P,
    newstate: PlayerStateEnum,
    oldstate: PlayerStateEnum
  ): void;
  protected abstract onStreamIn(player: P, forPlayer: P): void;
  protected abstract onStreamOut(player: P, forPlayer: P): void;
  protected abstract onTakeDamage(
    player: P,
    damage: P | InvalidEnum.PLAYER_ID,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ): void;
  protected abstract onUpdate(player: P): void;
  protected abstract onInteriorChange(
    player: P,
    newinteriorid: number,
    oldinteriorid: number
  ): void;
  protected abstract onPause(player: P): void;
  protected abstract onResume(player: P): void;
  protected abstract onRequestDownload(
    player: P,
    type: number,
    crc: number
  ): void;
  protected abstract onFinishedDownloading(
    player: P,
    virtualworld: number
  ): void;
}

export abstract class BasePlayerEvent<
  P extends BasePlayer
> extends AbstractPlayerEvent<P> {
  constructor() {
    super();
    OnPlayerConnect((playerid: number): void => {
      const p = this.newPlayer(playerid);
      this.players.set(playerid, p);
      this.onConnect(p);
    });

    OnPlayerDisconnect((playerid: number, reason: number): void => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      this.onDisconnect(p, reason);
      this.players.delete(playerid);
    });

    OnPlayerText((playerid: number, byteArr: number[]) => {
      const p = this.findPlayerById(playerid);
      if (p) this.onText(p, I18n.decodeFromBuf(byteArr, p.charset));
    });

    OnPlayerCommandText((playerid: number, buf: number[]): void => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const cmdtext = I18n.decodeFromBuf(buf, p.charset);
      const regCmdtext = cmdtext.match(/[^/\s]+/gi);
      if (regCmdtext === null || regCmdtext.length === 0) {
        return this.onCommandError(p, ICmdErrInfo.format);
      }
      /* 
        Use eventBus to observe and subscribe to level 1 instructions, 
        support string and array pass, array used for alias.
      */
      const exist: boolean = CmdBus.emit(
        p,
        regCmdtext[0],
        regCmdtext.splice(1)
      );
      if (exist) return;
      // The command %s you entered does not exist
      this.onCommandError(p, ICmdErrInfo.notExist);
    });

    OnClientCheckResponse(
      (
        playerid: number,
        actionid: number,
        memaddr: number,
        retndata: number
      ): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        this.onClientCheckResponse(p, actionid, memaddr, retndata);
      }
    );

    OnEnterExitModShop(
      (playerid: number, enterexit: number, interior: number): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        this.onEnterExitModShop(p, enterexit, interior);
      }
    );

    OnPlayerClickMap(
      (playerid: number, fX: number, fY: number, fZ: number): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        this.onClickMap(p, fX, fY, fZ);
      }
    );

    OnPlayerClickPlayer(
      (playerid: number, clickedplayerid: number, source: number): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        const cp = this.findPlayerById(clickedplayerid);
        if (!cp) return;
        this.onClickPlayer(p, cp, source);
      }
    );

    OnPlayerDeath(
      (playerid: number, killerid: number, reason: number): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        if (killerid === InvalidEnum.PLAYER_ID) {
          this.onDeath(p, killerid, reason);
          return;
        }
        const k = this.findPlayerById(killerid);
        if (!k) return;
        this.onDeath(p, k, reason);
      }
    );

    OnPlayerGiveDamage(
      (
        playerid: number,
        damageid: number,
        amount: number,
        weaponid: WeaponEnum,
        bodypart: BodyPartsEnum
      ): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        const d = this.findPlayerById(damageid);
        if (!d) return;
        this.onGiveDamage(p, d, amount, weaponid, bodypart);
      }
    );

    OnPlayerKeyStateChange(
      (playerid: number, newkeys: number, oldkeys: number): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        this.onKeyStateChange(p, newkeys, oldkeys);
      }
    );

    OnPlayerRequestSpawn((playerid: number): void => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      this.onRequestSpawn(p);
    });

    OnPlayerSpawn((playerid: number): void => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      this.onSpawn(p);
    });

    OnPlayerStateChange(
      (playerid: number, newstate: number, oldstate: number): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        this.onStateChange(p, newstate, oldstate);
      }
    );

    OnPlayerStreamIn((playerid: number, forplayerid: number): void => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return;
      this.onStreamIn(p, fp);
    });

    OnPlayerStreamOut((playerid: number, forplayerid: number): void => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return;
      this.onStreamOut(p, fp);
    });

    OnPlayerTakeDamage(
      (
        playerid: number,
        issuerid: number,
        amount: number,
        weaponid: WeaponEnum,
        bodypart: BodyPartsEnum
      ): void => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        if (issuerid === InvalidEnum.PLAYER_ID) {
          this.onTakeDamage(p, issuerid, amount, weaponid, bodypart);
          return;
        }
        const i = this.findPlayerById(issuerid);
        if (!i) return;
        this.onTakeDamage(p, i, amount, weaponid, bodypart);
      }
    );

    /** 30 calls per second for a single player means a peak of 30,000 calls for 1000 players.
     * If there are 10 player event classes, that means there are 30,0000 calls per second.
     * By throttling down to 16.67 calls per second for a single player, performance should be optimized.
     */
    OnPlayerUpdate((playerid: number): void => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      if (!p.isNpc()) this.fpsHeartbeat(p);
      this.throttleUpdate(p);
    });

    OnPlayerInteriorChange(
      (playerid: number, newinteriorid: number, oldinteriorid: number) => {
        const p = this.findPlayerById(playerid);
        if (!p) return;
        this.onInteriorChange(p, newinteriorid, oldinteriorid);
      }
    );

    OnPlayerRequestDownload((playerid: number, type: number, crc: number) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      this.onRequestDownload(p, type, crc);
    });

    OnPlayerFinishedDownloading((playerid: number, virtualworld: number) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      this.onFinishedDownloading(p, virtualworld);
    });
  }
  public findPlayerById(playerid: number) {
    return this.players.get(playerid);
  }
  public getPlayersArr(): Array<P> {
    return [...this.players.values()];
  }
  private throttleUpdate = throttle((player: P) => this.onUpdate(player), 60);
  private fpsHeartbeat = throttle((player: P) => {
    if (!BasePlayer.isConnected(player)) return;
    const nowDrunkLevel = player.getDrunkLevel();
    if (nowDrunkLevel < 100) {
      player.setDrunkLevel(2000);
      player.lastDrunkLevel = 2000;
      player.lastFps = 0;
      return;
    }
    if (!player.isPaused && player.lastDrunkLevel === nowDrunkLevel) {
      player.isPaused = true;
      this.onPause(player);
      return;
    }
    if (player.isPaused) {
      player.isPaused = false;
      this.onResume(player);
    }
    player.lastFps = player.lastDrunkLevel - nowDrunkLevel - 1;
    player.lastDrunkLevel = nowDrunkLevel;
  }, 1000);
}
