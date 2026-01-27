# @infernus/samp-voice

[![npm](https://img.shields.io/npm/v/@infernus/samp-voice)](https://www.npmx.dev/package/@infernus/samp-voice) ![npm](https://img.shields.io/npm/dw/@infernus/samp-voice) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/samp-voice)

A wrapper of the popular [SA-MP voice library](https://github.com/AmyrAhmady/sampvoice) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/samp-voice
```

## Example

```ts
import { GameMode, Player, PlayerEvent } from "@infernus/core";
import {
  DynamicLocalPlayerStream,
  SampVoice,
  SampVoiceEvent,
  SampVoiceGlobalStream,
  SampVoiceLocalStream,
  SV_INFINITY,
  SV_NULL,
} from "@infernus/samp-voice";

let global_stream: SampVoiceGlobalStream | null = null;
const local_stream = new Map<Player, SampVoiceLocalStream>();

/*
    The public OnPlayerActivationKeyPress and OnPlayerActivationKeyRelease
    are needed in order to redirect the player's audio traffic to the
    corresponding streams when the corresponding keys are pressed.
*/

SampVoiceEvent.onPlayerActivationKeyPress(({ player, keyId, next }) => {
  // Attach player to local stream as speaker if 'B' key is pressed
  if (keyId === 0x42 && local_stream.has(player)) {
    local_stream.get(player)!.attachSpeaker(player);
  }
  // Attach the player to the global stream as a speaker if the 'Z' key is pressed
  if (keyId === 0x5a && global_stream) {
    global_stream.attachSpeaker(player);
  }

  return next();
});

SampVoiceEvent.onPlayerActivationKeyRelease(({ player, keyId, next }) => {
  // Detach the player from the local stream if the 'B' key is released
  if (keyId === 0x42 && local_stream.has(player)) {
    local_stream.get(player)!.detachSpeaker(player);
  }
  // Detach the player from the global stream if the 'Z' key is released
  if (keyId === 0x5a && global_stream) {
    global_stream.detachSpeaker(player);
  }

  return next();
});

PlayerEvent.onConnect(({ player, next }) => {
  // Checking for plugin availability
  if (SampVoice.getVersion(player) === SV_NULL) {
    player.sendClientMessage(-1, "Could not find plugin sampvoice.");
  }
  // Checking for a microphone
  else if (SampVoice.hasMicro(player) === false) {
    player.sendClientMessage(-1, "The microphone could not be found.");
  }
  // Create a local stream with an audibility distance of 40.0, an unlimited number of listeners
  // and the name 'Local' (the name 'Local' will be displayed in red in the players' speakerlist)
  else {
    const stream = new DynamicLocalPlayerStream(
      40.0,
      SV_INFINITY,
      player,
      0xff0000ff,
      "Local",
    );

    if (stream.ptr === SV_NULL) {
      return next();
    }

    local_stream.set(player, stream);

    player.sendClientMessage(
      -1,
      "Press Z to talk to global chat and B to talk to local chat.",
    );

    // Attach the player to the global stream as a listener
    if (global_stream) {
      global_stream.attachListener(player);
    }

    // Assign microphone activation keys to the player
    SampVoice.addKey(player, 0x42);
    SampVoice.addKey(player, 0x5a);
  }

  return next();
});

PlayerEvent.onDisconnect(({ player, next }) => {
  // Removing the player's local stream after disconnecting
  if (local_stream.has(player)) {
    local_stream.get(player)!.detachListener(player);
    local_stream.get(player)!.detachSpeaker(player);
    local_stream.get(player)!.delete();
    local_stream.delete(player);
  }
  return next();
});

GameMode.onInit(({ next }) => {
  // Uncomment the line to enable debug mode
  // SampVoice.debug(true);
  local_stream.clear();
  global_stream = new SampVoiceGlobalStream(0xffff0000, "Global");
  return next();
});

GameMode.onExit(({ next }) => {
  if (global_stream) {
    global_stream.detachAllListeners();
    global_stream.detachAllSpeakers();
    global_stream.delete();
    global_stream = null;
  }
  local_stream.clear();
  return next();
});
```
