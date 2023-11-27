import {
  NOOP,
  OnPlayerCommandText,
  OnPlayerText,
  defineAsyncCallback,
} from "core/utils/helperUtils";
import * as cbs from "core/wrapper/native/callbacks";
import { I18n } from "../i18n";
import { Player } from "./basePlayer";
import { CmdBus } from "../command";
import type { ICmdErr } from "core/interfaces";
import * as enums from "core/enums";
import { Dialog } from "../promise/dialog";
import { delCCTask } from "../promise/client";
import { playerBus, playerHooks } from "./playerBus";
import type { TCommonCallback, TEventFunc, TEventName } from "core/types";
import { throttle } from "lodash-unified";

// Each instance can be called to callbacks, so you can split the logic.

const ICmdErrInfo: Record<"format" | "notExist" | "rejected", ICmdErr> = {
  format: { code: 0, msg: "failed to recognize command (almost never)" },
  notExist: { code: 1, msg: "command does not exist" },
  rejected: { code: 2, msg: "rejected because true/1 was not returned" },
};

export class PlayerEvent<P extends Player> {
  private readonly players = new Map<number, P>();
  private static cmdBus = new CmdBus();

  constructor(newPlayerFn: (id: number) => P) {
    cbs.OnPlayerConnect((playerid: number): number => {
      const p = newPlayerFn(playerid);
      this.players.set(playerid, p);
      const pFn = defineAsyncCallback(this, "onConnect");
      return pFn(p);
    });

    cbs.OnPlayerDisconnect((playerid: number, reason: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      Dialog.close(p);
      delCCTask(playerid, true);
      const pFn = defineAsyncCallback(this, "onDisconnect");
      const result = pFn(p, reason);
      this.players.delete(playerid);
      return result;
    });

    OnPlayerText((playerid: number, byteArr: number[]): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const pFn = defineAsyncCallback(this, "onText", 0);
      return pFn(p, I18n.decodeFromBuf(byteArr, p.charset));
    });

    OnPlayerCommandText((playerid: number, buf: number[]): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const cmdtext = I18n.decodeFromBuf(buf, p.charset);
      const regCmdtext = cmdtext.match(/[^/\s]+/gi);
      if (regCmdtext === null || regCmdtext.length === 0) {
        this.onCommandError &&
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
        const pFn = defineAsyncCallback(this, "onEnterExitModShop");
        return pFn(p, enterexit, interior);
      }
    );

    cbs.OnPlayerClickMap(
      (playerid: number, fX: number, fY: number, fZ: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = defineAsyncCallback(this, "onClickMap");
        return pFn(p, fX, fY, fZ);
      }
    );

    cbs.OnPlayerClickPlayer(
      (playerid: number, clickedplayerid: number, source: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const cp = this.findPlayerById(clickedplayerid);
        if (!cp) return 0;
        const pFn = defineAsyncCallback(this, "onClickPlayer");
        return pFn(p, cp, source);
      }
    );

    cbs.OnPlayerDeath(
      (playerid: number, killerid: number, reason: number): number => {
        const pFn = defineAsyncCallback(this, "onDeath");
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (killerid === enums.InvalidEnum.PLAYER_ID) {
          return pFn(p, killerid, reason);
        }
        const k = this.findPlayerById(killerid);
        if (!k) return 0;
        return pFn(p, k, reason);
      }
    );

    cbs.OnPlayerGiveDamage(
      (
        playerid: number,
        damageid: number,
        amount: number,
        weaponid: enums.WeaponEnum,
        bodypart: enums.BodyPartsEnum
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const d = this.findPlayerById(damageid);
        if (!d) return 0;
        const pFn = defineAsyncCallback(this, "onGiveDamage");
        return pFn(p, d, amount, weaponid, bodypart);
      }
    );

    cbs.OnPlayerKeyStateChange(
      (playerid: number, newkeys: number, oldkeys: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = defineAsyncCallback(this, "onKeyStateChange");
        return pFn(p, newkeys, oldkeys);
      }
    );

    cbs.OnPlayerRequestClass((playerid: number, classid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = defineAsyncCallback(this, "onRequestClass");
      return pFn(p, classid);
    });

    cbs.OnPlayerRequestSpawn((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = defineAsyncCallback(this, "onRequestSpawn");
      return pFn(p);
    });

    cbs.OnPlayerSpawn((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = defineAsyncCallback(this, "onSpawn");
      return pFn(p);
    });

    cbs.OnPlayerStateChange(
      (playerid: number, newstate: number, oldstate: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (oldstate === enums.PlayerStateEnum.NONE)
          p.lastUpdateTick = Date.now();
        const pFn = defineAsyncCallback(this, "onStateChange");
        return pFn(p, newstate, oldstate);
      }
    );

    cbs.OnPlayerStreamIn((playerid: number, forplayerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return 0;
      const pFn = defineAsyncCallback(this, "onStreamIn");
      return pFn(p, fp);
    });

    cbs.OnPlayerStreamOut((playerid: number, forplayerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return 0;
      const pFn = defineAsyncCallback(this, "onStreamOut");
      return pFn(p, fp);
    });

    cbs.OnPlayerTakeDamage(
      (
        playerid: number,
        issuerid: number,
        amount: number,
        weaponid: enums.WeaponEnum,
        bodypart: enums.BodyPartsEnum
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (issuerid === enums.InvalidEnum.PLAYER_ID) {
          const pFn = defineAsyncCallback(this, "onTakeDamage");
          return pFn(p, issuerid, amount, weaponid, bodypart);
        }
        const i = this.findPlayerById(issuerid);
        if (!i) return 0;
        const pFn = defineAsyncCallback(this, "onTakeDamage");
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
          this.onResume && this.onResume(p, now - p.lastUpdateTick);
        }
        p.lastUpdateTick = now;
        PlayerEvent.fpsHeartbeat(p);
      }
      const pFn = defineAsyncCallback(this, "throttleUpdate");
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
        const pFn = defineAsyncCallback(this, "onInteriorChange");
        return pFn(p, newinteriorid, oldinteriorid);
      }
    );

    cbs.OnPlayerRequestDownload(
      (playerid: number, type: number, crc: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = defineAsyncCallback(this, "onRequestDownload");
        return pFn(p, type, crc);
      }
    );

    cbs.OnPlayerFinishedDownloading(
      (playerid: number, virtualworld: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = defineAsyncCallback(this, "onFinishedDownloading");
        return pFn(p, virtualworld);
      }
    );
    playerBus.emit(playerHooks.create, this.players);
    playerBus.on(playerHooks.pause, (player: P) => {
      player.isPaused = true;
      this.onPause && this.onPause(player, player.lastUpdateTick);
    });

    playerBus.on(playerHooks.setCommonProp, ({ player, prop, value }) => {
      Reflect.set(player, prop, value);
      this.players.set(player.id, player);
    });
  }
  findPlayerById(playerid: number) {
    return this.players.get(playerid);
  }
  getPlayersArr(): Array<P> {
    return [...this.players.values()];
  }
  getPlayersMap(): Map<number, P> {
    return this.players;
  }
  readonly throttleUpdate = throttle(
    (player: P) => this.onUpdate && this.onUpdate(player),
    60
  );
  private static fpsHeartbeat = throttle((player: Player) => {
    if (!Player.isConnected(player.id)) return;
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
  readonly onCommandText = (
    name: TEventName,
    fn: TEventFunc<this, P> | TEventFunc<this, P>[]
  ): (() => void) => {
    return PlayerEvent.cmdBus.on(this, name, fn);
  };

  readonly offCommandText = (
    name: TEventName,
    fn: TEventFunc<this, P> | TEventFunc<this, P>[]
  ) => {
    PlayerEvent.cmdBus.off(this, name, fn);
  };

  private promiseCommand = async (
    p: P,
    cmd: RegExpMatchArray
  ): Promise<unknown> => {
    const fullCommand = cmd.join(" ");
    const firstLevel = cmd[0];

    const hasAnyRegistered = PlayerEvent.cmdBus.eventMap.get(firstLevel);
    if (!hasAnyRegistered && this.onCommandError) {
      this.onCommandError(p, fullCommand, ICmdErrInfo.notExist);
      return;
    }

    const hasInstanceFns = hasAnyRegistered?.get(this);
    if (!hasInstanceFns) return;

    let rFnRes =
      this.onCommandReceived && this.onCommandReceived(p, fullCommand);

    if (rFnRes !== undefined) {
      if (rFnRes instanceof Promise) rFnRes = await rFnRes;
      if (!rFnRes) return NOOP();
    }

    // deliberately let the for loop not wait
    hasInstanceFns.forEach(async (fn) => {
      // CmdBus emit start
      let result = fn.call(this, p, ...cmd.slice(1));
      if (result instanceof Promise) result = await result;
      if (result === undefined || result === null) result = false;
      // CmdBus emit end

      if (result) {
        let pFnRes =
          this.onCommandPerformed && this.onCommandPerformed(p, fullCommand);
        if (pFnRes instanceof Promise) pFnRes = await pFnRes;
        if (!pFnRes) return NOOP();
        return;
      }

      const pFn = defineAsyncCallback(this, "onCommandError");
      pFn(p, fullCommand, ICmdErrInfo.rejected);
    });
  };

  onConnect?(player: P): TCommonCallback;
  onDisconnect?(player: P, reason: number): TCommonCallback;
  onText?(player: P, text: string): TCommonCallback;
  onCommandReceived?(player: P, command: string): TCommonCallback;
  onCommandPerformed?(player: P, command: string): TCommonCallback;
  onCommandError?(player: P, command: string, err: ICmdErr): TCommonCallback;
  onEnterExitModShop?(
    player: P,
    enterexit: number,
    interiorid: number
  ): TCommonCallback;
  onClickMap?(player: P, fX: number, fY: number, fZ: number): TCommonCallback;
  onClickPlayer?(player: P, clickedPlayer: P, source: number): TCommonCallback;
  onDeath?(
    player: P,
    killer: P | enums.InvalidEnum.PLAYER_ID,
    reason: number
  ): TCommonCallback;
  onGiveDamage?(
    player: P,
    damage: P,
    amount: number,
    weaponid: enums.WeaponEnum,
    bodypart: enums.BodyPartsEnum
  ): TCommonCallback;
  onKeyStateChange?(
    player: P,
    newkeys: enums.KeysEnum,
    oldkeys: enums.KeysEnum
  ): TCommonCallback;
  onRequestClass?(player: P, classid: number): TCommonCallback;
  onRequestSpawn?(player: P): TCommonCallback;
  onSpawn?(player: P): TCommonCallback;
  onStateChange?(
    player: P,
    newstate: enums.PlayerStateEnum,
    oldstate: enums.PlayerStateEnum
  ): TCommonCallback;
  onStreamIn?(player: P, forPlayer: P): TCommonCallback;
  onStreamOut?(player: P, forPlayer: P): TCommonCallback;
  onTakeDamage?(
    player: P,
    damage: P | enums.InvalidEnum.PLAYER_ID,
    amount: number,
    weaponid: enums.WeaponEnum,
    bodypart: enums.BodyPartsEnum
  ): TCommonCallback;
  onUpdate?(player: P): TCommonCallback;
  onInteriorChange?(
    player: P,
    newinteriorid: number,
    oldinteriorid: number
  ): TCommonCallback;
  onPause?(player: P, timestamp: number): TCommonCallback;
  onResume?(player: P, pauseMs: number): TCommonCallback;
  onRequestDownload?(player: P, type: number, crc: number): TCommonCallback;
  onFinishedDownloading?(player: P, virtualworld: number): TCommonCallback;
}
