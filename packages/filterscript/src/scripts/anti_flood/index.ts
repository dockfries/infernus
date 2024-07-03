// a basic anti flood system, and admin chatting for rcon admins
// using # or @<message>

import type { IFilterScript } from "@infernus/core";
import { Player, PlayerEvent } from "@infernus/core";

const iPlayerChatTime = new Map<Player, number>();
const szPlayerChatMsg = new Map<Player, string>();

function isPlayerFlooding(player: Player) {
  if (!iPlayerChatTime.has(player)) return false;
  if (player.isAdmin()) return false;
  if (Date.now() - iPlayerChatTime.get(player)! < 2000) return true;
  return false;
}

export const AntiFlood: IFilterScript = {
  name: "anti_flood",
  load() {
    const onText = PlayerEvent.onText(({ player, text, next }) => {
      // Is the player flooding?
      if (isPlayerFlooding(player)) {
        player.sendClientMessage(
          0xff0000ff,
          "* You can only send a message once every two seconds.",
        );
        return false;
      }

      // Now we handle the admin chat, will be #<message>.
      if (
        (text[0] == "#" || text[0] == "@") &&
        text.length > 1 &&
        player.isAdmin()
      ) {
        const szPlayerName = player.getName();

        const str = `Admin ${szPlayerName}: ${text.slice(1, text.length)}`;

        Player.getInstances().forEach((p) => {
          if (!p.isAdmin()) return;
          p.sendClientMessage(0xffff22aa, str);
        });

        return next();
      }

      // Okay, now it's time for anti repeating.
      if (!player.isAdmin()) {
        const chatMsg = szPlayerChatMsg.get(player);
        if (!chatMsg) return next();

        if (chatMsg === text) {
          player.sendClientMessage(
            0xff0000ff,
            "* Please do not repeat yourself.",
          );
          szPlayerChatMsg.set(player, text);
          return false;
        }
      }

      szPlayerChatMsg.set(player, text);
      iPlayerChatTime.set(player, Date.now());

      return next();
    });

    const onCmdReceived = PlayerEvent.onCommandReceived(({ player, next }) => {
      if (isPlayerFlooding(player)) {
        player.sendClientMessage(
          0xff0000ff,
          "* You can only use commands once every two seconds.",
        );
        return true;
      }

      iPlayerChatTime.set(player, Date.now());

      return next();
    });

    const onDisconnect = PlayerEvent.onDisconnect(({ player, next }) => {
      iPlayerChatTime.delete(player);
      szPlayerChatMsg.delete(player);
      return next();
    });

    console.log("\n--Anti Flood loaded.\n");

    return [onText, onCmdReceived, onDisconnect];
  },
  unload() {
    iPlayerChatTime.clear();
    szPlayerChatMsg.clear();
  },
};
