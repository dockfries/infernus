//
// Example use of chat above player's head
//

import type { IFilterScript } from "@infernus/core";
import { PlayerEvent } from "@infernus/core";

export const GlChatBubble: IFilterScript = {
  name: "gl_chat_bubble",
  load() {
    const MESSAGE_COLOR = 0xeeeeeeff;
    const ECHO_COLOR = 0xeeeeeeff;
    const ACTION_COLOR = 0xee66eeff;

    const onText = PlayerEvent.onText(({ player, text, next }) => {
      if (text.length > 128) return next();

      const to_others = `Says: ${text}`;
      const to_me = `>> ${player.getName()},${text}`;

      player.setChatBubble(to_others, MESSAGE_COLOR, 35.0, 10000);
      player.sendClientMessage(ECHO_COLOR, to_me);

      next();
      return false; // can't do normal chat with this loaded
    });

    const meCommand = PlayerEvent.onCommandText(
      "me",
      ({ player, subcommand, next }) => {
        const actionText = `* ${subcommand.join(" ")}`;
        player.setChatBubble(actionText, ACTION_COLOR, 30.0, 10000);
        player.sendClientMessage(ACTION_COLOR, actionText);
        return next();
      },
    );

    console.log("\n--Speech bubble example loaded.\n");
    return [onText, meCommand];
  },
  unload() {},
};
