// Base FS
// Contains /pm /kick /ban commands.

import { Player, PlayerEvent } from "@infernus/core";
import { ColorEnum } from "./enums/color";

export const Base = {
  name: "base",
  offs: [] as (() => void)[],
  load() {
    // PM Command
    const pm = PlayerEvent.onCommandText(
      "pm",
      ({ player, subcommand, next }) => {
        if (!subcommand.length || subcommand[0].length > 4) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "Usage: /pm (id) (message)",
          );
          return next();
        }

        const [id, gMessage] = subcommand;

        if (!gMessage) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "Usage: /pm (id) (message)",
          );
          return next();
        }

        if (!Player.isConnected(+id)) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "/pm : Bad player ID",
          );
          return next();
        }

        if (player.id === +id) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "You cannot PM yourself",
          );
          return next();
        }

        const iPlayer = Player.getInstance(+id)!;
        const iName = iPlayer.getName();
        const pName = player.getName();

        let message = `>> ${iName}(${id}): ${gMessage}`;
        player.sendClientMessage(ColorEnum.PM_OUTGOING, message);

        message = `** ${pName}(${player.id}): ${gMessage}`;
        iPlayer.sendClientMessage(ColorEnum.PM_INCOMING, message);
        iPlayer.playSound(1085, 0.0, 0.0, 0.0);

        console.log("PM: %s", message);

        return next();
      },
    );

    //Kick Command
    const kick = PlayerEvent.onCommandText(
      "kick",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "/kick : You are not an admin",
          );
          return next();
        }

        if (!subcommand.length || subcommand[0].length > 4) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "Usage: /kick (id) [reason]",
          );
          return next();
        }

        const [id, gMessage] = subcommand;

        if (!Player.isConnected(+id)) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "/kick : Bad player ID",
          );
          return next();
        }

        const iPlayer = Player.getInstance(+id)!;
        const iName = iPlayer.getName();

        iPlayer.sendClientMessage(
          ColorEnum.ADMINFS_MESSAGE,
          "-- You have been kicked from the server.",
        );

        if (gMessage) {
          const message = `Reason: ${gMessage}`;
          iPlayer.sendClientMessage(ColorEnum.ADMINFS_MESSAGE, message);
        }

        const message = `>> ${iName}(${id}) has been kicked.`;
        player.sendClientMessage(ColorEnum.ADMINFS_MESSAGE, message);

        setTimeout(() => {
          iPlayer.kick();
        }, iPlayer.getPing() + 100);

        return next();
      },
    );

    //Ban Command
    const ban = PlayerEvent.onCommandText(
      "ban",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "/ban : You are not an admin",
          );
          return next();
        }

        if (!subcommand.length || subcommand[0].length > 4) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "Usage: /ban (id) [reason]",
          );
          return next();
        }

        const [id, gMessage] = subcommand;

        if (!Player.isConnected(+id)) {
          player.sendClientMessage(
            ColorEnum.ADMINFS_MESSAGE,
            "/ban : Bad player ID",
          );
          return next();
        }

        const iPlayer = Player.getInstance(+id)!;
        const iName = iPlayer.getName();

        iPlayer.sendClientMessage(
          ColorEnum.ADMINFS_MESSAGE,
          "-- You have been baned from the server.",
        );

        if (gMessage) {
          const message = `Reason: ${gMessage}`;
          iPlayer.sendClientMessage(ColorEnum.ADMINFS_MESSAGE, message);
        }

        const message = `>> ${iName}(${id}) has been banned.`;
        player.sendClientMessage(ColorEnum.ADMINFS_MESSAGE, message);

        setTimeout(() => {
          iPlayer.ban();
        }, iPlayer.getPing() + 100);

        return next();
      },
    );

    this.offs.push(pm, kick, ban);

    console.log("\n--Base FS loaded.\n");
  },
  unload() {
    this.offs.forEach((o) => o());
  },
};
