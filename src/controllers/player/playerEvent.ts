import { OnPlayerCommandText, OnPlayerText } from "@/utils/helperUtils";
import { OnPlayerConnect, OnPlayerDisconnect } from "@/wrapper/callbacks";
import { I18n } from "../i18n";
import { BasePlayer } from ".";
import { CmdBus } from "../command";
import { ICmdErr } from "@/interfaces";

// Each instance can be called to callbacks, so you can split the logic.

const ICmdErrInfo: Record<string, ICmdErr> = {
  format: { code: 0, msg: "Please enter the correct command" },
  notExist: { code: 1, msg: "The command %s you entered does not exist" },
};

export class BasePlayerEvent<T extends BasePlayer> {
  // Provide a function to find class extends BasePlayer by playerid
  constructor(findPlayerFn: (playerid: number) => T) {
    OnPlayerConnect((playerid: number): void => {
      const p = findPlayerFn(playerid);
      if (p) this.onConnect(p);
    });

    OnPlayerDisconnect((playerid: number, reason: number): void => {
      const p = findPlayerFn(playerid);
      if (p) this.onDisconnect(p, reason);
    });

    OnPlayerText((playerid: number, byteArr: number[]) => {
      const p = findPlayerFn(playerid);
      if (p) this.onText(p, I18n.decodeFromBuf(byteArr, p.charset));
    });

    OnPlayerCommandText((playerid: number, buf: number[]): void => {
      const p = findPlayerFn(playerid);
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

  /* eslint-disable @typescript-eslint/no-unused-vars */

  protected onConnect(player: T): void {}

  protected onDisconnect(player: T, reason: number): void {}

  protected onText(player: T, text: string): void {}

  protected onCommandError(player: T, err: ICmdErr): void {}

  /* eslint-enable @typescript-eslint/no-unused-vars */
}
