import { OnPlayerText } from "@/utils/helper";
import { OnPlayerConnect, OnPlayerDisconnect } from "@/wrapper/callbacks";
import { I18n } from "./i18n";
import { BasePlayer } from "./player";

// Each instance can be called to callbacks, so you can split the logic.
export class BasePlayerEvent<T extends BasePlayer> {
  // Provide a function to find player, by default go to the base player method to find
  constructor(
    findPlayerFn: (playerid: number) => T | undefined = (playerid: number) =>
      <T>BasePlayer.findPlayer(playerid)
  ) {
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
  }

  // ignore class params no used start
  /* eslint-disable @typescript-eslint/no-unused-vars */

  protected onConnect(player: T): void {}

  protected onDisconnect(player: T, reason: number): void {}

  protected onText(player: T, text: string): void {}

  /* eslint-enable @typescript-eslint/no-unused-vars */
  // ignore class params no used end
}

new BasePlayerEvent((playerid: number) => {
  return BasePlayer.findPlayer(playerid);
});
