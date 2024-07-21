//
//
//  SA-MP Roleplay style chat module for SA-MP 0.3
//  (c) 2012 SA-MP Team
//   All rights reserved
//

import { Player } from "@infernus/core";

export const GENERAL_COLOR = 0xeeeeeeff;
export const LOCAL_TALK_COLOR = 0xd0d0d0ff;
export const SPEECH_BUBBLE_COLOR = 0xeeeeeeff;
export const ACTION_COLOR = 0xc2a2daaa;
export const CMD_USAGE_COLOR = 0xbfc0c2ff;
export const MEGAPHONE_COLOR = 0xffff00aa;
export const WHISPER_COLOR = 0xffff00aa;
export const OOC_COLOR = 0xe0ffffaa;
export const ADMIN_ACTION_COLOR = 0xdaa2acaa;

export const TALK_DISTANCE = 30.0;
export const SHOUT_DISTANCE = 60.0;
export const LOW_DISTANCE = 5.0;
export const ACTION_DISTANCE = 30.0;
export const MEGAPHONE_DISTANCE = 70.0;

export const CHAT_BUBBLE_TIME = 6000;

export const ACTION_ME = 1;
export const ACTION_DO = 2;

export function cmdUsageMessage(player: Player, message: string) {
  const msg = `[{BFC0C2}usage{EEEEEE}] ${message}`;
  player.sendClientMessage(GENERAL_COLOR, msg);
}

export function cmdErrorMessage(player: Player, message: string) {
  const msg = `[{E0C0C0}error{EEEEEE}] ${message}`;
  player.sendClientMessage(GENERAL_COLOR, msg);
}

export function cmdAdminMessage(player: Player, message: string) {
  const msg = `[{5050EE}admin{EEEEEE}] ${message}`;
  player.sendClientMessage(GENERAL_COLOR, msg);
}

export function adminActionMessage(player: Player, message: string) {
  player.playSound(1052, 0.0, 0.0, 0.0);
  player.sendClientMessage(ADMIN_ACTION_COLOR, message);
}

// Send a chat message to players in distance of player
// This includes the origin player.

export function localMessage(
  distance: number,
  player: Player,
  color: string | number,
  message: string,
  chatBubble = false,
) {
  if (!message) return;

  let fPlayerToPlayerDist = 0;

  // send to the origin player
  player.sendClientMessage(color, message);

  // if it requires a chat bubble, show it.
  if (chatBubble) {
    player.setChatBubble(message, color, distance, CHAT_BUBBLE_TIME);
  }

  const { x: fPlayerX, y: fPlayerY, z: fPlayerZ } = player.getPos()!;

  // for every player
  Player.getInstances().forEach((p) => {
    if (p !== player && player.isStreamedIn(p)) {
      fPlayerToPlayerDist = p.getDistanceFromPoint(
        fPlayerX,
        fPlayerY,
        fPlayerZ,
      );
      if (fPlayerToPlayerDist < distance) {
        // receiving player is within the specified distance
        player.sendClientMessage(color, message);
      }
    }
  });
}

// This will send a local talk message and automatically grey-fade it.
// This includes the origin player.

export function talkMessage(
  distance: number,
  player: Player,
  prefix: string,
  message: string,
) {
  if (!message) return;

  const playerName = player.getName();

  const msg = prefix ? `${prefix} ${message}` : message;

  const msgWithName = `${playerName}: ${msg}`;

  player.setChatBubble(msg, SPEECH_BUBBLE_COLOR, distance, CHAT_BUBBLE_TIME);

  // Send to originating player
  player.sendClientMessage(LOCAL_TALK_COLOR, msgWithName);

  const { x: fPlayerX, y: fPlayerY, z: fPlayerZ } = player.getPos()!;

  // for every player
  Player.getInstances().forEach((i) => {
    if (i !== player && player.isStreamedIn(i)) {
      const fPlayerToPlayerDist = i.getDistanceFromPoint(
        fPlayerX,
        fPlayerY,
        fPlayerZ,
      );
      if (fPlayerToPlayerDist < distance) {
        // receiving player is within the specified distance
        // get normalized distance to create a fade.
        const fNormDistance = 1.0 - fPlayerToPlayerDist / distance;
        let colorScale = 0;
        if (fNormDistance > 0.75) colorScale = 220;
        else colorScale = Math.round(96.0 + 128.0 * fNormDistance);
        const colorValue =
          0x000000ff |
          (colorScale << 24) |
          (colorScale << 16) |
          (colorScale << 8);
        i.sendClientMessage(colorValue, msgWithName);
      }
    }
  });
}
