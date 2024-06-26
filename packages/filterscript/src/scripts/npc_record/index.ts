//-------------------------------------------------
//
//  Recording player data for NPC playback
//  Kye 2009
//
//-------------------------------------------------

import type { IFilterScript } from "@infernus/core";
import { Npc, PlayerEvent, RecordTypesEnum } from "@infernus/core";

export const NpcRecord: IFilterScript = {
  name: "npc_record",
  offs: [],
  load() {
    const vr = PlayerEvent.onCommandText(
      "vrecord",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return next();

        // Start recording vehicle data (/vrecord recording_name[])
        // Find the recording_name[] file in /scriptfiles/
        const [name] = subcommand;
        if (!name) {
          player.sendClientMessage(0xff0000ff, "Usage: /vrecord {name}");
          return next();
        }

        if (!player.isInAnyVehicle()) {
          player.sendClientMessage(0xff0000ff, "Recording: Get in a vehicle.");
          return next();
        }

        Npc.startRecordingPlayerData(player, RecordTypesEnum.DRIVER, name);
        player.sendClientMessage(0xff0000ff, "Recording: started.");

        return next();
      },
    );

    const ofr = PlayerEvent.onCommandText(
      "ofrecord",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return next();

        // Start recording onfoot data (/ofrecord recording_name[])
        // Find the recording_name[] file in /scriptfiles/
        const [name] = subcommand;
        if (!name) {
          player.sendClientMessage(0xff0000ff, "Usage: /ofrecord {name}");
          return next();
        }

        if (player.isInAnyVehicle()) {
          player.sendClientMessage(
            0xff0000ff,
            "Recording: Leave the vehicle and reuse the command.",
          );
          return next();
        }

        Npc.startRecordingPlayerData(player, RecordTypesEnum.ONFOOT, name);
        player.sendClientMessage(0xff0000ff, "Recording: started.");

        return next();
      },
    );

    // Stop recording any data
    const stop = PlayerEvent.onCommandText("stoprecord", ({ player, next }) => {
      if (!player.isAdmin()) return next();
      Npc.stopRecordingPlayerData(player);
      player.sendClientMessage(0xff0000ff, "Recording: stopped.");
      return next();
    });

    this.offs.push(vr, ofr, stop);
  },
  unload() {
    this.offs.forEach((off) => off());
    this.offs = [];
  },
};
