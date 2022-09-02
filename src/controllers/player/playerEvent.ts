import { OnPlayerCommandText, OnPlayerText } from "@/utils/helperUtils";
import { OnPlayerConnect, OnPlayerDisconnect } from "@/wrapper/callbacks";
import { I18n } from "../i18n";
import { BasePlayer } from "./basePlayer";
import { CmdBus } from "../command";
import { ICmdErr } from "@/interfaces";

// Each instance can be called to callbacks, so you can split the logic.

const ICmdErrInfo: Record<string, ICmdErr> = {
  format: { code: 0, msg: "Please enter the correct command" },
  notExist: { code: 1, msg: "The command %s you entered does not exist" },
};

abstract class PlayerEvent<P extends BasePlayer> {
  public players: Array<P> = [];
  protected abstract newPlayer(playerid: number): P;
  protected abstract onConnect(player: P): void;
  protected abstract onDisconnect(player: P, reason: number): void;
  protected abstract onText(player: P, text: string): void;
  protected abstract onCommandError(player: P, err: ICmdErr): void;
}

export abstract class BasePlayerEvent<
  P extends BasePlayer
> extends PlayerEvent<P> {
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
