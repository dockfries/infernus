// Example FilterScript for the new SA-MP Animations
// -------------------------------------------------
// By Matite in January 2015
//
// This script tests the new SA-MP animation/pose inside the SAMP.ifp file.
//

import { LogLevelEnum, GameText, PlayerEvent } from "@infernus/core";
import type { IFilterScript } from "@infernus/core";

export const SampAnims: IFilterScript = {
  name: "samp_anims",
  load() {
    const fish = PlayerEvent.onCommandText("fish", ({ player, next }) => {
      // Apply animation
      player.applyAnimation("SAMP", "FishingIdle", 4.1, false, true, true, true, 1);
      // Send a gametext message to the player
      new GameText("~b~~h~Fishing Animation Pose!", 3000, 3).forPlayer(player);
      return next();
    });

    // Display information in the Server Console
    samp.logprint("\n", LogLevelEnum.INFO);
    samp.logprint("  |---------------------------------------------------", LogLevelEnum.INFO);
    samp.logprint("  |--- SA-MP Animations FilterScript by Matite", LogLevelEnum.INFO);
    samp.logprint("  |--  Script v1.01", LogLevelEnum.INFO);
    samp.logprint("  |--  12th January 2015", LogLevelEnum.INFO);
    samp.logprint("  |---------------------------------------------------", LogLevelEnum.INFO);

    return [fish];
  },
  unload() {
    // Display information in the Server Console
    samp.logprint("  |---------------------------------------------------", LogLevelEnum.INFO);
    samp.logprint("  |--  SA-MP Animations FilterScript Unloaded", LogLevelEnum.INFO);
    samp.logprint("  |---------------------------------------------------", LogLevelEnum.INFO);
  },
};
