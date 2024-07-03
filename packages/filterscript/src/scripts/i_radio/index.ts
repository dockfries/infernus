//-------------------------------------------------
// Internet radio example
// (c) 2011 SA-MP Team
//-------------------------------------------------

import type { IFilterScript, Player } from "@infernus/core";
import { PlayerEvent, PlayerStateEnum } from "@infernus/core";

const alhambraSet = new Set<Player>();

export const IRadio: IFilterScript = {
  name: "i_radio",
  load() {
    const onStateChange = PlayerEvent.onStateChange(
      ({ player, newState, oldState, next }) => {
        // play an internet radio stream when they are in a vehicle
        if (
          newState === PlayerStateEnum.DRIVER ||
          newState === PlayerStateEnum.PASSENGER
        ) {
          player.playAudioStream("http://somafm.com/tags.pls");
        }
        // stop the internet stream
        else if (
          oldState === PlayerStateEnum.DRIVER ||
          oldState === PlayerStateEnum.PASSENGER
        ) {
          player.stopAudioStream();
        }
        return next();
      },
    );

    const onUpdate = PlayerEvent.onUpdate(({ player, next }) => {
      if (player.isNpc()) return next();
      // Handle playing SomaFM at the alhambra
      if (player.getInterior() === 17) {
        if (player.isInRangeOfPoint(70.0, 489.5824, -14.7563, 1000.6797)) {
          // alhambra middle
          if (!alhambraSet.has(player)) {
            alhambraSet.add(player);
            player.playAudioStream(
              "http://somafm.com/tags.pls",
              480.9575,
              -3.5402,
              1002.0781,
              40.0,
            );
          }
        }
      } else {
        if (alhambraSet.has(player)) {
          alhambraSet.delete(player);
          player.stopAudioStream();
        }
      }
      return next();
    });

    return [onStateChange, onUpdate];
  },
  unload() {
    alhambraSet.clear();
  },
};
