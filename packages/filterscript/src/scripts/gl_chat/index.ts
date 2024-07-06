//
//
//  SA-MP Roleplay style chat module for Grand Larceny
//  (c) 2012 SA-MP Team
//   All rights reserved
//

import type { IFilterScript } from "@infernus/core";
import { Player, PlayerEvent } from "@infernus/core";
import {
  RETURN_USER_FAILURE,
  RETURN_USER_MULTIPLE,
  returnUser,
} from "filterscript/utils/gl_common";
import * as gl_message from "filterscript/utils/gl_message";

function processChatText(player: Player, text: string) {
  let useIndex = 1;
  // Handle shouting prefix (!)
  if (text[0] === "!" && text.length > 1) {
    if (text[1] === " ") useIndex++;
    gl_message.talkMessage(
      gl_message.SHOUT_DISTANCE,
      player,
      "*shouts*",
      text[useIndex],
    );
    return;
  }

  // Handle quiet prefix (#)
  if (text[0] === "#" && text.length > 1) {
    if (text[1] === " ") useIndex++;
    gl_message.talkMessage(
      gl_message.LOW_DISTANCE,
      player,
      "*quietly*",
      text[useIndex],
    );
    return;
  }

  // Send to other players in range and fade
  gl_message.talkMessage(gl_message.TALK_DISTANCE, player, "", text);
}

function processActionText(
  player: Player,
  message: string,
  actionType: number,
) {
  let actionText = "";
  let actionBubble = "";
  const playerName = player.getName();

  if (actionType === gl_message.ACTION_DO) {
    actionText = `* ${message} ((${playerName}))`;
    actionBubble = `* (( ${message} ))`;
  } else {
    actionText = `* ${playerName} ${message}`;
    actionBubble = `* ${message}`;
  }

  gl_message.localMessage(
    gl_message.ACTION_DISTANCE,
    player,
    gl_message.ACTION_COLOR,
    actionText,
  );
  player.setChatBubble(
    actionBubble,
    gl_message.ACTION_COLOR,
    gl_message.ACTION_DISTANCE,
    gl_message.CHAT_BUBBLE_TIME,
  );
}

let gOOCDisabled = false;

function globalOOCMessage(player: Player, message: string) {
  if (gOOCDisabled) {
    gl_message.cmdErrorMessage(
      player,
      "The OOC channel is not enabled right now",
    );
    return;
  }

  const playerName = player.getName();
  const msg = `(( ${playerName}: ${message} ))`;

  // for every player
  Player.getInstances().forEach((p) => {
    p.sendClientMessage(gl_message.OOC_COLOR, msg);
  });
}

function toggleOOC(player: Player) {
  if (player.isAdmin()) {
    // toggle it
    if (gOOCDisabled) gOOCDisabled = false;
    else gOOCDisabled = true;

    if (!gOOCDisabled) {
      Player.sendClientMessageToAll(
        gl_message.GENERAL_COLOR,
        "{D0D0D0}[ooc] channel is {80CC80}enabled",
      );
    } else {
      Player.sendClientMessageToAll(
        gl_message.GENERAL_COLOR,
        "{D0D0D0}[ooc] channel is {CC8080}disabled",
      );
    }
  } else {
    gl_message.cmdErrorMessage(
      player,
      "Your admin level isn't high enough to change this",
    );
  }
}

function processLocalOOC(player: Player, message: string) {
  const playerName = player.getName();
  const new_message = `${playerName} (( ${message} ))`;
  gl_message.localMessage(
    gl_message.TALK_DISTANCE,
    player,
    gl_message.LOCAL_TALK_COLOR,
    new_message,
  );
}

function processMegaphone(player: Player, message: string) {
  // Todo: add permissions on megaphone usage
  const playerName = player.getName();
  const new_message = `(megaphone) ${playerName} >> ${message}`;
  gl_message.localMessage(
    gl_message.MEGAPHONE_DISTANCE,
    player,
    gl_message.MEGAPHONE_COLOR,
    new_message,
    true,
  );
}

function processWhisper(player: Player, toPlayer: Player, message: string) {
  const playerName = player.getName();
  const toPlayerName = toPlayer.getName();
  let pmMessage = `>> ${toPlayerName}(${toPlayer.id}): ${message};`;
  player.sendClientMessage(gl_message.WHISPER_COLOR, pmMessage);

  pmMessage = `** ${playerName}(${player.id}): ${message}`;

  toPlayer.sendClientMessage(gl_message.WHISPER_COLOR, pmMessage);
  toPlayer.playSound(1085, 0.0, 0.0, 0.0);
}

export const GlChat: IFilterScript = {
  name: "gl_chat",
  load() {
    // Action commands
    const me = PlayerEvent.onCommandText(
      "me",
      ({ player, subcommand, next }) => {
        const message = subcommand[0];
        if (!message) {
          gl_message.cmdUsageMessage(player, "/me [action]");
          return next();
        }
        processActionText(player, message, gl_message.ACTION_ME);
        return next();
      },
    );

    const doCmd = PlayerEvent.onCommandText(
      "do",
      ({ player, subcommand, next }) => {
        const message = subcommand[0];
        if (!message) {
          gl_message.cmdUsageMessage(player, "/do [action]");
          return next();
        }
        processActionText(player, message, gl_message.ACTION_DO);
        return next();
      },
    );

    // Talk commands

    // /low
    const low = PlayerEvent.onCommandText(
      ["l", "low"],
      ({ player, subcommand, next }) => {
        const message = subcommand[0];
        if (!message) {
          gl_message.cmdUsageMessage(player, "(/l)ow [text]");
          return next();
        }
        gl_message.talkMessage(
          gl_message.LOW_DISTANCE,
          player,
          "*quietly*",
          message,
        );
        return next();
      },
    );

    // /shout
    const shout = PlayerEvent.onCommandText(
      ["s", "shout"],
      ({ player, subcommand, next }) => {
        const message = subcommand[0];
        if (!message) {
          gl_message.cmdUsageMessage(player, "(/s)hout [text]");
          return next();
        }
        gl_message.talkMessage(
          gl_message.SHOUT_DISTANCE,
          player,
          "*shouts*",
          message,
        );
        return next();
      },
    );

    // /b (local ooc)
    const bCmd = PlayerEvent.onCommandText(
      "b",
      ({ player, subcommand, next }) => {
        const message = subcommand[0];
        if (!message) {
          gl_message.cmdUsageMessage(player, "/b [text]");
          return next();
        }
        processLocalOOC(player, message);
        return next();
      },
    );

    // /megaphone
    const mCmd = PlayerEvent.onCommandText(
      ["m", "megaphone"],
      ({ player, subcommand, next }) => {
        const message = subcommand[0];
        if (!message) {
          gl_message.cmdUsageMessage(player, "(/m)egaphone [text]");
          return next();
        }
        processMegaphone(player, message);
        return next();
      },
    );

    // Global OOC /o and /ooc
    const ooc = PlayerEvent.onCommandText(
      ["o", "ooc"],
      ({ player, subcommand, next }) => {
        const message = subcommand[0];
        if (!message) {
          gl_message.cmdUsageMessage(player, "(/o)oc [text]");
          return next();
        }
        globalOOCMessage(player, message);
        return next();
      },
    );

    // Toggle the OOC channel /togooc
    const togooc = PlayerEvent.onCommandText("togooc", ({ player, next }) => {
      toggleOOC(player);
      return next();
    });

    // /whisper /pm
    const pm = PlayerEvent.onCommandText(
      ["w", "wisper", "pm"],
      ({ player, subcommand, next }) => {
        const tmp = subcommand[0];

        if (!tmp) {
          gl_message.cmdUsageMessage(
            player,
            "(/w)isper [playerId/PartOfName] [whisper text]",
          );
          return next();
        }

        const toPlayerId = returnUser(tmp);

        if (toPlayerId === RETURN_USER_MULTIPLE) {
          gl_message.cmdErrorMessage(
            player,
            "Multiple matches found for [name]. Please narrow the search.",
          );
          return next();
        }

        if (
          toPlayerId === RETURN_USER_FAILURE ||
          !Player.isConnected(toPlayerId)
        ) {
          gl_message.cmdErrorMessage(
            player,
            "That player isn't connected right now.",
          );
          return next();
        }

        const message = subcommand[1];

        if (!message) {
          gl_message.cmdUsageMessage(
            player,
            "(/w)isper [playerId/PartOfName] [whisper text]",
          );
          return next();
        }

        const toPlayer = Player.getInstance(toPlayerId);
        if (toPlayer) {
          processWhisper(player, toPlayer, message);
        }

        return next();
      },
    );

    const onText = PlayerEvent.onText(({ player, text, next }) => {
      processChatText(player, text);
      return next();
    });

    return [me, doCmd, low, shout, bCmd, mCmd, ooc, togooc, pm, onText];
  },
  unload() {},
};
