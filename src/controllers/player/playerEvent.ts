import { OnPlayerCommandText, OnPlayerText } from "@/utils/helperUtils";
import {
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
  InvalidEnum,
  KeysEnum,
  PlayerStateEnum,
  WeaponEnum,
} from "@/enums";
import { throttle } from "lodash";
import { BaseDialog } from "../promise/dialog";
import { delCCTask } from "../promise/client";
import { playerBus, playerHooks } from "./playerBus";

// Each instance can be called to callbacks, so you can split the logic.

const ICmdErrInfo: Record<string, ICmdErr> = {
  format: { code: 0, msg: "incorrect command" },
  notExist: { code: 1, msg: "does not exist" },
};

abstract class AbstractPlayerEvent<P extends BasePlayer> {
  public readonly players = new Map<number, P>();
  public readonly cmdBus = new CmdBus<P>();
  protected abstract newPlayer(playerid: number): P;
  protected abstract onConnect(player: P): number;
  protected abstract onDisconnect(player: P, reason: number): number;
  protected abstract onText(player: P, text: string): number;
  protected abstract onCommandError(
    player: P,
    command: string,
    err: ICmdErr
  ): number;
  protected abstract onEnterExitModShop(
    player: P,
    enterexit: number,
    interiorid: number
  ): number;
  protected abstract onClickMap(
    player: P,
    fX: number,
    fY: number,
    fZ: number
  ): number;
  protected abstract onClickPlayer(
    player: P,
    clickedPlayer: P,
    source: number
  ): number;
  protected abstract onDeath(
    player: P,
    killer: P | InvalidEnum.PLAYER_ID,
    reason: number
  ): number;
  protected abstract onGiveDamage(
    player: P,
    damage: P,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ): number;
  protected abstract onKeyStateChange(
    player: P,
    newkeys: KeysEnum,
    oldkeys: KeysEnum
  ): number;
  protected abstract onRequestSpawn(player: P): number;
  protected abstract onSpawn(player: P): number;
  protected abstract onStateChange(
    player: P,
    newstate: PlayerStateEnum,
    oldstate: PlayerStateEnum
  ): number;
  protected abstract onStreamIn(player: P, forPlayer: P): number;
  protected abstract onStreamOut(player: P, forPlayer: P): number;
  protected abstract onTakeDamage(
    player: P,
    damage: P | InvalidEnum.PLAYER_ID,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ): number;
  protected abstract onUpdate(player: P): number;
  protected abstract onInteriorChange(
    player: P,
    newinteriorid: number,
    oldinteriorid: number
  ): number;
  protected abstract onPause(player: P): number;
  protected abstract onResume(player: P, pauseMs: number): number;
  protected abstract onRequestDownload(
    player: P,
    type: number,
    crc: number
  ): number;
  protected abstract onFinishedDownloading(
    player: P,
    virtualworld: number
  ): number;
}

export abstract class BasePlayerEvent<
  P extends BasePlayer
> extends AbstractPlayerEvent<P> {
  constructor() {
    super();

    OnPlayerConnect((playerid: number): number => {
      const p = this.newPlayer(playerid);
      this.players.set(playerid, p);
      if (!p.isNpc()) p.isAndroid();
      return this.onConnect(p);
    });

    OnPlayerDisconnect((playerid: number, reason: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      BaseDialog.close(p);
      delCCTask(playerid, true);
      const result = this.onDisconnect(p, reason);
      this.players.delete(playerid);
      return result;
    });

    OnPlayerText((playerid: number, byteArr: number[]): number => {
      const p = this.findPlayerById(playerid);
      if (p) return this.onText(p, I18n.decodeFromBuf(byteArr, p.charset));
      return 1;
    });

    OnPlayerCommandText((playerid: number, buf: number[]): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const cmdtext = I18n.decodeFromBuf(buf, p.charset);
      const regCmdtext = cmdtext.match(/[^/\s]+/gi);
      if (regCmdtext === null || regCmdtext.length === 0) {
        this.onCommandError(p, cmdtext, ICmdErrInfo.format);
        return 0;
      }
      /* 
        Use eventBus to observe and subscribe to level 1 instructions, 
        support string and array pass, array used for alias.
      */
      (async () => {
        const result = await this.cmdBus.emit(
          p,
          regCmdtext[0],
          regCmdtext.slice(1)
        );
        // The command %s you entered does not exist
        if (result >= 1) return;
        const finalRes = this.onCommandError(
          p,
          regCmdtext.join(" "),
          ICmdErrInfo.notExist
        );
        const fn = () => finalRes;
        samp.addEventListener("OnPlayerCommandTextI18n", fn);
        samp.removeEventListener("OnPlayerCommandTextI18n", fn);
        return;
      })();
      return 1;
    });

    OnEnterExitModShop(
      (playerid: number, enterexit: number, interior: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        return this.onEnterExitModShop(p, enterexit, interior);
      }
    );

    OnPlayerClickMap(
      (playerid: number, fX: number, fY: number, fZ: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        return this.onClickMap(p, fX, fY, fZ);
      }
    );

    OnPlayerClickPlayer(
      (playerid: number, clickedplayerid: number, source: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const cp = this.findPlayerById(clickedplayerid);
        if (!cp) return 0;
        return this.onClickPlayer(p, cp, source);
      }
    );

    OnPlayerDeath(
      (playerid: number, killerid: number, reason: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (killerid === InvalidEnum.PLAYER_ID) {
          return this.onDeath(p, killerid, reason);
        }
        const k = this.findPlayerById(killerid);
        if (!k) return 0;
        return this.onDeath(p, k, reason);
      }
    );

    OnPlayerGiveDamage(
      (
        playerid: number,
        damageid: number,
        amount: number,
        weaponid: WeaponEnum,
        bodypart: BodyPartsEnum
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const d = this.findPlayerById(damageid);
        if (!d) return 0;
        return this.onGiveDamage(p, d, amount, weaponid, bodypart);
      }
    );

    OnPlayerKeyStateChange(
      (playerid: number, newkeys: number, oldkeys: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        return this.onKeyStateChange(p, newkeys, oldkeys);
      }
    );

    OnPlayerRequestSpawn((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      return this.onRequestSpawn(p);
    });

    OnPlayerSpawn((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      return this.onSpawn(p);
    });

    OnPlayerStateChange(
      (playerid: number, newstate: number, oldstate: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (oldstate === PlayerStateEnum.NONE) p.lastUpdateTick = Date.now();
        return this.onStateChange(p, newstate, oldstate);
      }
    );

    OnPlayerStreamIn((playerid: number, forplayerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return 0;
      return this.onStreamIn(p, fp);
    });

    OnPlayerStreamOut((playerid: number, forplayerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return 0;
      return this.onStreamOut(p, fp);
    });

    OnPlayerTakeDamage(
      (
        playerid: number,
        issuerid: number,
        amount: number,
        weaponid: WeaponEnum,
        bodypart: BodyPartsEnum
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (issuerid === InvalidEnum.PLAYER_ID) {
          return this.onTakeDamage(p, issuerid, amount, weaponid, bodypart);
        }
        const i = this.findPlayerById(issuerid);
        if (!i) return 0;
        return this.onTakeDamage(p, i, amount, weaponid, bodypart);
      }
    );

    /** 30 calls per second for a single player means a peak of 30,000 calls for 1000 players.
     * If there are 10 player event classes, that means there are 30,0000 calls per second.
     * By throttling down to 16.67 calls per second for a single player, performance should be optimized.
     */
    OnPlayerUpdate((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      if (!p.isNpc()) {
        const now = Date.now();
        if (p.isPaused) {
          p.isPaused = false;
          this.onResume(p, now - p.lastUpdateTick);
        }
        p.lastUpdateTick = now;
        this.fpsHeartbeat(p);
      }
      const res = this.throttleUpdate(p);
      if (res !== undefined) return res;
      return 0;
    });

    OnPlayerInteriorChange(
      (
        playerid: number,
        newinteriorid: number,
        oldinteriorid: number
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        return this.onInteriorChange(p, newinteriorid, oldinteriorid);
      }
    );

    OnPlayerRequestDownload(
      (playerid: number, type: number, crc: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        return this.onRequestDownload(p, type, crc);
      }
    );

    OnPlayerFinishedDownloading(
      (playerid: number, virtualworld: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        return this.onFinishedDownloading(p, virtualworld);
      }
    );
    playerBus.emit(playerHooks.create, this.players);
    playerBus.on(playerHooks.pause, (player) => {
      player.isPaused = true;
      this.onPause(player);
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
    player.lastFps = player.lastDrunkLevel - nowDrunkLevel - 1;
    player.lastDrunkLevel = nowDrunkLevel;
  }, 1000);
}
