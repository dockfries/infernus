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
  load() {
    const vr = PlayerEvent.onCommandText(
      "vrecord",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return false;

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
        if (!player.isAdmin()) return false;

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
      if (!player.isAdmin()) return false;
      Npc.stopRecordingPlayerData(player);
      player.sendClientMessage(0xff0000ff, "Recording: stopped.");
      return next();
    });

    return [vr, ofr, stop];
  },
  unload() {},
};
