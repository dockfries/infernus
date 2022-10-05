import {
  OnPlayerCommandText,
  OnPlayerText,
  promisifyCallback,
} from "@/utils/helperUtils";
import * as cbs from "@/wrapper/callbacks";
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
import { TCommonCallback } from "@/types";

// Each instance can be called to callbacks, so you can split the logic.

const ICmdErrInfo: Record<string, ICmdErr> = {
  format: { code: 0, msg: "incorrect command" },
  notExist: { code: 1, msg: "does not exist" },
};

export abstract class BasePlayerEvent<P extends BasePlayer> {
  public readonly players = new Map<number, P>();
  private readonly cmdBus = new CmdBus<P>();
  public readonly onCommandText = this.cmdBus.on;
  constructor() {
    cbs.OnPlayerConnect((playerid: number): number => {
      const p = this.newPlayer(playerid);
      this.players.set(playerid, p);
      if (!p.isNpc()) p.isAndroid();
      const pFn = promisifyCallback.call(
        this,
        this.onConnect,
        "OnPlayerConnect"
      );
      return pFn(p);
    });

    cbs.OnPlayerDisconnect((playerid: number, reason: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      BaseDialog.close(p);
      delCCTask(playerid, true);
      const pFn = promisifyCallback.call(
        this,
        this.onDisconnect,
        "OnPlayerDisconnect"
      );
      const result = pFn(p, reason);
      this.players.delete(playerid);
      return result;
    });

    OnPlayerText((playerid: number, byteArr: number[]): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const pFn = promisifyCallback.call(this, this.onText, "OnPlayerTextI18n");
      return pFn(p, I18n.decodeFromBuf(byteArr, p.charset));
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
      this.promiseCommand(p, regCmdtext);
      return 1;
    });

    cbs.OnEnterExitModShop(
      (playerid: number, enterexit: number, interior: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onEnterExitModShop,
          "OnEnterExitModShop"
        );
        return pFn(p, enterexit, interior);
      }
    );

    cbs.OnPlayerClickMap(
      (playerid: number, fX: number, fY: number, fZ: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onClickMap,
          "OnPlayerClickMap"
        );
        return pFn(p, fX, fY, fZ);
      }
    );

    cbs.OnPlayerClickPlayer(
      (playerid: number, clickedplayerid: number, source: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const cp = this.findPlayerById(clickedplayerid);
        if (!cp) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onClickPlayer,
          "OnPlayerClickPlayer"
        );
        return pFn(p, cp, source);
      }
    );

    cbs.OnPlayerDeath(
      (playerid: number, killerid: number, reason: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (killerid === InvalidEnum.PLAYER_ID) {
          const pFn = promisifyCallback.call(
            this,
            this.onDeath,
            "OnPlayerDeath"
          );
          return pFn(p, killerid, reason);
        }
        const k = this.findPlayerById(killerid);
        if (!k) return 0;
        const pFn = promisifyCallback.call(this, this.onDeath, "OnPlayerDeath");
        return pFn(p, k, reason);
      }
    );

    cbs.OnPlayerGiveDamage(
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
        const pFn = promisifyCallback.call(
          this,
          this.onGiveDamage,
          "OnPlayerGiveDamage"
        );
        return pFn(p, d, amount, weaponid, bodypart);
      }
    );

    cbs.OnPlayerKeyStateChange(
      (playerid: number, newkeys: number, oldkeys: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onKeyStateChange,
          "OnPlayerKeyStateChange"
        );
        return pFn(p, newkeys, oldkeys);
      }
    );

    cbs.OnPlayerRequestClass((playerid: number, classid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onRequestClass,
        "OnPlayerRequestClass"
      );
      return pFn(p, classid);
    });

    cbs.OnPlayerRequestSpawn((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onRequestSpawn,
        "OnPlayerRequestSpawn"
      );
      return pFn(p);
    });

    cbs.OnPlayerSpawn((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback.call(this, this.onSpawn, "OnPlayerSpawn");
      return pFn(p);
    });

    cbs.OnPlayerStateChange(
      (playerid: number, newstate: number, oldstate: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (oldstate === PlayerStateEnum.NONE) p.lastUpdateTick = Date.now();
        const pFn = promisifyCallback.call(
          this,
          this.onStateChange,
          "OnPlayerStateChange"
        );
        return pFn(p, newstate, oldstate);
      }
    );

    cbs.OnPlayerStreamIn((playerid: number, forplayerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onStreamIn,
        "OnPlayerStreamIn"
      );
      return pFn(p, fp);
    });

    cbs.OnPlayerStreamOut((playerid: number, forplayerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return 0;
      const pFn = promisifyCallback.call(
        this,
        this.onStreamOut,
        "OnPlayerStreamOut"
      );
      return pFn(p, fp);
    });

    cbs.OnPlayerTakeDamage(
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
          const pFn = promisifyCallback.call(
            this,
            this.onTakeDamage,
            "OnPlayerTakeDamage"
          );
          return pFn(p, issuerid, amount, weaponid, bodypart);
        }
        const i = this.findPlayerById(issuerid);
        if (!i) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onTakeDamage,
          "OnPlayerTakeDamage"
        );
        return pFn(p, i, amount, weaponid, bodypart);
      }
    );

    /** 30 calls per second for a single player means a peak of 30,000 calls for 1000 players.
     * If there are 10 player event classes, that means there are 30,0000 calls per second.
     * By throttling down to 16.67 calls per second for a single player, performance should be optimized.
     */
    cbs.OnPlayerUpdate((playerid: number): number => {
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
      const pFn = promisifyCallback.call(
        this,
        this.throttleUpdate,
        "OnPlayerUpdate"
      );
      const res = pFn(p);
      if (res === undefined) return 0;
      return res;
    });

    cbs.OnPlayerInteriorChange(
      (
        playerid: number,
        newinteriorid: number,
        oldinteriorid: number
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onInteriorChange,
          "OnPlayerInteriorChange"
        );
        return pFn(p, newinteriorid, oldinteriorid);
      }
    );

    cbs.OnPlayerRequestDownload(
      (playerid: number, type: number, crc: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onRequestDownload,
          "OnPlayerRequestDownload"
        );
        return pFn(p, type, crc);
      }
    );

    cbs.OnPlayerFinishedDownloading(
      (playerid: number, virtualworld: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback.call(
          this,
          this.onFinishedDownloading,
          "OnPlayerFinishedDownloading"
        );
        return pFn(p, virtualworld);
      }
    );
    playerBus.emit(playerHooks.create, this.players);
    playerBus.on(playerHooks.pause, (player: P) => {
      player.isPaused = true;
      this.onPause(player, player.lastUpdateTick);
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
  /**
   * Use eventBus to observe and subscribe to level 1 instructions,
   * support string and array pass, array used for alias.
   */
  private async promiseCommand(p: P, cmd: RegExpMatchArray): Promise<void> {
    const result = await this.cmdBus.emit(p, cmd[0], cmd.slice(1));
    if (result >= 1) return;
    // The command %s you entered does not exist
    promisifyCallback(this.onCommandError, "OnPlayerCommandTextI18n")(
      p,
      cmd.join(" "),
      ICmdErrInfo.notExist
    );
  }
  protected abstract newPlayer(playerid: number): P;
  protected abstract onConnect(player: P): TCommonCallback;
  protected abstract onDisconnect(player: P, reason: number): TCommonCallback;
  protected abstract onText(player: P, text: string): TCommonCallback;
  protected abstract onCommandError(
    player: P,
    command: string,
    err: ICmdErr
  ): TCommonCallback;
  protected abstract onEnterExitModShop(
    player: P,
    enterexit: number,
    interiorid: number
  ): TCommonCallback;
  protected abstract onClickMap(
    player: P,
    fX: number,
    fY: number,
    fZ: number
  ): TCommonCallback;
  protected abstract onClickPlayer(
    player: P,
    clickedPlayer: P,
    source: number
  ): TCommonCallback;
  protected abstract onDeath(
    player: P,
    killer: P | InvalidEnum.PLAYER_ID,
    reason: number
  ): TCommonCallback;
  protected abstract onGiveDamage(
    player: P,
    damage: P,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ): TCommonCallback;
  protected abstract onKeyStateChange(
    player: P,
    newkeys: KeysEnum,
    oldkeys: KeysEnum
  ): TCommonCallback;
  protected abstract onRequestClass(
    player: P,
    classid: number
  ): TCommonCallback;
  protected abstract onRequestSpawn(player: P): TCommonCallback;
  protected abstract onSpawn(player: P): TCommonCallback;
  protected abstract onStateChange(
    player: P,
    newstate: PlayerStateEnum,
    oldstate: PlayerStateEnum
  ): TCommonCallback;
  protected abstract onStreamIn(player: P, forPlayer: P): TCommonCallback;
  protected abstract onStreamOut(player: P, forPlayer: P): TCommonCallback;
  protected abstract onTakeDamage(
    player: P,
    damage: P | InvalidEnum.PLAYER_ID,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ): TCommonCallback;
  protected abstract onUpdate(player: P): TCommonCallback;
  protected abstract onInteriorChange(
    player: P,
    newinteriorid: number,
    oldinteriorid: number
  ): TCommonCallback;
  protected abstract onPause(player: P, timestamp: number): TCommonCallback;
  protected abstract onResume(player: P, pauseMs: number): TCommonCallback;
  protected abstract onRequestDownload(
    player: P,
    type: number,
    crc: number
  ): TCommonCallback;
  protected abstract onFinishedDownloading(
    player: P,
    virtualworld: number
  ): TCommonCallback;
}
