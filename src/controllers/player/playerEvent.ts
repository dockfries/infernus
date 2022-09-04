import { OnPlayerCommandText, OnPlayerText } from "@/utils/helperUtils";
import {
  OnClientCheckResponse,
  OnPlayerConnect,
  OnPlayerDisconnect,
  OnPlayerClickMap,
  OnPlayerClickPlayer,
  OnPlayerDeath,
  // OnPlayerGiveDamage,
  OnPlayerKeyStateChange,
  OnPlayerRequestSpawn,
  OnPlayerSpawn,
  OnPlayerStateChange,
  OnPlayerStreamIn,
  OnPlayerStreamOut,
  // OnPlayerTakeDamage,
  OnPlayerUpdate,
} from "@/wrapper/callbacks";
import { I18n } from "../i18n";
import { BasePlayer } from "./basePlayer";
import { CmdBus } from "../command";
import { ICmdErr } from "@/interfaces";
import {
  // BodyPartsEnum,
  InvalidEnum,
  KeysEnum,
  PlayerStateEnum,
  // WeaponEnum,
} from "@/enums";

// Each instance can be called to callbacks, so you can split the logic.

const ICmdErrInfo: Record<string, ICmdErr> = {
  format: { code: 0, msg: "Please enter the correct command" },
  notExist: { code: 1, msg: "The command %s you entered does not exist" },
};

abstract class AbstractPlayerEvent<P extends BasePlayer> {
  public players: Array<P> = [];
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
  // protected abstract onEnterExitModShop(
  //   player: P,
  //   enterexit: number,
  //   interiorid: number
  // ): void;
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
    killer: P | InvalidEnum.INVALID_PLAYER_ID,
    reason: number
  ): void;
  // protected abstract onGiveDamage(
  //   player: P,
  //   damage: P,
  //   amount: number,
  //   weaponid: WeaponEnum,
  //   bodypart: BodyPartsEnum
  // ): void;
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
  // protected abstract onTakeDamage(
  //   player: P,
  //   damage: P | InvalidEnum.INVALID_PLAYER_ID,
  //   amount: number,
  //   weaponid: WeaponEnum,
  //   bodypart: BodyPartsEnum
  // ): void;
  protected abstract onUpdate(player: P): void;
}

export abstract class BasePlayerEvent<
  P extends BasePlayer
> extends AbstractPlayerEvent<P> {
  constructor() {
    super();
    OnPlayerConnect((playerid: number): void => {
      const p = this.newPlayer(playerid);
      this.players.push(p);
      this.onConnect(p);
    });

    OnPlayerDisconnect((playerid: number, reason: number): void => {
      const pIdx = this.players.findIndex((p) => p.id === playerid);
      if (pIdx === -1) return;
      this.onDisconnect(this.players[pIdx], reason);
      this.players.splice(pIdx, 1);
    });

    OnPlayerText((playerid: number, byteArr: number[]) => {
      const p = this.players.find((p) => p.id === playerid);
      if (p) this.onText(p, I18n.decodeFromBuf(byteArr, p.charset));
    });

    OnPlayerCommandText((playerid: number, buf: number[]): void => {
      const p = this.players.find((p) => p.id === playerid);
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
        const p = this.players.find((p) => p.id === playerid);
        if (!p) return;
        this.onClientCheckResponse(p, actionid, memaddr, retndata);
      }
    );

    // OnEnterExitModShop(
    //   (playerid: number, enterexit: number, interior: number): void => {
    //     const p = this.players.find((p) => p.id === playerid);
    //     if (!p) return;
    //     this.onEnterExitModShop(p, enterexit, interior);
    //   }
    // );

    OnPlayerClickMap(
      (playerid: number, fX: number, fY: number, fZ: number): void => {
        const p = this.players.find((p) => p.id === playerid);
        if (!p) return;
        this.onClickMap(p, fX, fY, fZ);
      }
    );

    OnPlayerClickPlayer(
      (playerid: number, clickedplayerid: number, source: number): void => {
        const p = this.players.find((p) => p.id === playerid);
        if (!p) return;
        const cp = this.players.find((p) => p.id === clickedplayerid);
        if (!cp) return;
        this.onClickPlayer(p, cp, source);
      }
    );

    OnPlayerDeath(
      (playerid: number, killerid: number, reason: number): void => {
        const p = this.players.find((p) => p.id === playerid);
        if (!p) return;
        if (killerid === InvalidEnum.INVALID_PLAYER_ID) {
          this.onDeath(p, killerid, reason);
          return;
        }
        const k = this.players.find((p) => p.id === killerid);
        if (!k) return;
        this.onDeath(p, k, reason);
      }
    );

    // OnPlayerGiveDamage(
    //   (
    //     playerid: number,
    //     damageid: number,
    //     amount: number,
    //     weaponid: number,
    //     bodypart: number
    //   ): void => {
    //     const p = this.players.find((p) => p.id === playerid);
    //     if (!p) return;
    //     const d = this.players.find((p) => p.id === damageid);
    //     if (!d) return;
    //     this.onGiveDamage(p, d, amount, weaponid, bodypart);
    //   }
    // );

    OnPlayerKeyStateChange(
      (playerid: number, newkeys: number, oldkeys: number): void => {
        const p = this.players.find((p) => p.id === playerid);
        if (!p) return;
        this.onKeyStateChange(p, newkeys, oldkeys);
      }
    );

    OnPlayerRequestSpawn((playerid: number): void => {
      const p = this.players.find((p) => p.id === playerid);
      if (!p) return;
      this.onRequestSpawn(p);
    });

    OnPlayerSpawn((playerid: number): void => {
      const p = this.players.find((p) => p.id === playerid);
      if (!p) return;
      this.onSpawn(p);
    });

    OnPlayerStateChange(
      (playerid: number, newstate: number, oldstate: number): void => {
        const p = this.players.find((p) => p.id === playerid);
        if (!p) return;
        this.onStateChange(p, newstate, oldstate);
      }
    );

    OnPlayerStreamIn((playerid: number, forplayerid: number): void => {
      const p = this.players.find((p) => p.id === playerid);
      if (!p) return;
      const fp = this.players.find((p) => p.id === forplayerid);
      if (!fp) return;
      this.onStreamIn(p, fp);
    });

    OnPlayerStreamOut((playerid: number, forplayerid: number): void => {
      const p = this.players.find((p) => p.id === playerid);
      if (!p) return;
      const fp = this.players.find((p) => p.id === forplayerid);
      if (!fp) return;
      this.onStreamOut(p, fp);
    });

    // OnPlayerTakeDamage(
    //   (
    //     playerid: number,
    //     issuerid: number,
    //     amount: number,
    //     weaponid: number,
    //     bodypart: number
    //   ): void => {
    //     const p = this.players.find((p) => p.id === playerid);
    //     if (!p) return;
    //     if (issuerid === InvalidEnum.INVALID_PLAYER_ID) {
    //       this.onTakeDamage(p, issuerid, amount, weaponid, bodypart);
    //       return;
    //     }
    //     const i = this.players.find((p) => p.id === issuerid);
    //     if (!i) return;
    //     this.onTakeDamage(p, i, amount, weaponid, bodypart);
    //   }
    // );

    OnPlayerUpdate((playerid: number): void => {
      const p = this.players.find((p) => p.id === playerid);
      if (!p) return;
      this.onUpdate(p);
    });
  }
  public findPlayerIdxById(playerid: number) {
    return this.players.findIndex((p) => p.id === playerid);
  }
  public findPlayerById(playerid: number) {
    return this.players.find((p) => p.id === playerid);
  }
}

// make good use of the selected vscode bulb tips
// class MyPlayerEvent extends BasePlayerEvent<BasePlayer> {
//   constructor() {
//     super();
//   }
//   protected newPlayer(playerid: number): BasePlayer {
//     return new BasePlayer(playerid);
//   }
//   protected onConnect(player: BasePlayer): void {}
//   protected onDisconnect(player: BasePlayer, reason: number): void {}
//   protected onText(player: BasePlayer, text: string): void {}
//   protected onCommandError(player: BasePlayer, err: ICmdErr): void {}
//   // ...
// }
