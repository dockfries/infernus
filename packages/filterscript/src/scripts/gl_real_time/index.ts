//
// Keeps the in game time synced to the server's time and
// draws the current time on the player's hud using a textdraw/
// (1 minute = 1 minute real world time)
//
//  (c) 2009-2014 SA-MP Team

import {
  GameMode,
  Player,
  PlayerEvent,
  PlayerStateEnum,
  TextDraw,
} from "@infernus/core";
import {
  fine_weather_ids,
  foggy_weather_ids,
  wet_weather_ids,
} from "./constants";
import type { IGlRealTimeFS } from "./interfaces";

// Used to override the time in this script
let worldTimeOverride = false;
let worldTimeOverrideHour = 0;
let worldTimeOverrideMin = 0;

let txtTimeDisplay: TextDraw | null = null;

let timer: NodeJS.Timeout | null = null;

let last_weather_update = 0;
let update_weather = false;

function updateWorldWeather() {
  const next_weather_prob = Math.floor(Math.random() * 100);
  if (next_weather_prob < 70)
    GameMode.setWeather(
      fine_weather_ids[Math.floor(Math.random() * fine_weather_ids.length)],
    );
  else if (next_weather_prob < 95)
    GameMode.setWeather(
      foggy_weather_ids[Math.floor(Math.random() * foggy_weather_ids.length)],
    );
  else
    GameMode.setWeather(
      wet_weather_ids[Math.floor(Math.random() * wet_weather_ids.length)],
    );
}

function updateTimeAndWeather() {
  let hour = 0,
    minute = 0;
  // Update time
  if (!worldTimeOverride) {
    const date = new Date();
    hour = date.getHours();
    minute = date.getMinutes();
  } else {
    hour = worldTimeOverrideHour;
    minute = worldTimeOverrideMin;
  }
  const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  txtTimeDisplay!.setString(timeStr);
  GameMode.setWorldTime(hour);

  Player.getInstances().forEach((p) => {
    if (p.getState() !== PlayerStateEnum.NONE) {
      p.setTime(hour, minute);
    }
  });

  if (update_weather) {
    // Update weather every hour
    if (last_weather_update === 0) {
      updateWorldWeather();
    }
    last_weather_update++;
    if (last_weather_update === 60) {
      last_weather_update = 0;
    }
  }
}

export const GlRealTime: IGlRealTimeFS = {
  name: "gl_real_time",
  load(options) {
    update_weather = !!(options && options.updateWeather);

    // Init our text display
    txtTimeDisplay = new TextDraw({ x: 605.0, y: 25.0, text: "00:00" });
    txtTimeDisplay.create();
    txtTimeDisplay.useBox(false);
    txtTimeDisplay.setFont(3);
    txtTimeDisplay.setShadow(0); // no shadow
    txtTimeDisplay.setOutline(2); // thickness 1
    txtTimeDisplay.setBackgroundColors(0x000000ff);
    txtTimeDisplay.setColor(0xffffffff);
    txtTimeDisplay.setAlignment(3);
    txtTimeDisplay.setLetterSize(0.5, 1.5);
    updateTimeAndWeather();
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimeAndWeather, 1000 * 60);

    const onSpawn = PlayerEvent.onSpawn(({ player, next }) => {
      txtTimeDisplay!.show(player);
      let hour = 0,
        minute = 0;
      // Update time
      if (!worldTimeOverride) {
        const date = new Date();
        hour = date.getHours();
        minute = date.getMinutes();
      } else {
        hour = worldTimeOverrideHour;
        minute = worldTimeOverrideMin;
      }

      player.setTime(hour, minute);
      return next();
    });

    const onDeath = PlayerEvent.onDeath(({ player, next }) => {
      txtTimeDisplay!.hide(player);
      return next();
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      player.setTime(hour, minute);
      return next();
    });

    const setHour = PlayerEvent.onCommandText(
      "setHour",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return next(); // this is an admin only script

        worldTimeOverride = true;
        worldTimeOverrideHour = +subcommand[0] || 0;
        updateTimeAndWeather();
        return next();
      },
    );

    const setMinute = PlayerEvent.onCommandText(
      "setMinute",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return next(); // this is an admin only script

        worldTimeOverride = true;
        worldTimeOverrideMin = +subcommand[0] || 0;
        updateTimeAndWeather();
        return next();
      },
    );
    return [onSpawn, onDeath, onConnect, setHour, setMinute];
  },
  unload() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    txtTimeDisplay?.destroy();
  },
};
