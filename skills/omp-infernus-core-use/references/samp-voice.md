# @infernus/samp-voice — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Wraps [SA-MP voice library](https://github.com/AmyrAhmady/sampvoice). In-game voice chat.

```bash
pnpm add @infernus/core @infernus/samp-voice
```

## SampVoice (static API)

```typescript
import { SampVoice } from "@infernus/samp-voice";

SampVoice.init(bitRate);
SampVoice.debug(mode);
SampVoice.getVersion(player);              // → number
SampVoice.hasMicro(player);                // → boolean
SampVoice.startRecord(player);             // → boolean
SampVoice.stopRecord(player);              // → boolean
SampVoice.addKey(player, keyId);           // → boolean
SampVoice.hasKey(player, keyId);           // → boolean
SampVoice.removeKey(player, keyId);        // → boolean
SampVoice.removeAllKeys(player);
SampVoice.mutePlayerStatus(player);        // → boolean
SampVoice.mutePlayerEnable(player);
SampVoice.mutePlayerDisable(player);
```

## Stream Classes

```typescript
import {
    SampVoiceGlobalStream,        // everyone connected hears
    SampVoiceLocalStream,         // positioned stream
    DynamicLocalPlayerStream,     // follows a player
    DynamicLocalPointStream,      // fixed at a point
    DynamicLocalVehicleStream,    // follows a vehicle
    DynamicLocalObjectStream,     // follows an object
    StaticLocalPlayerStream,      // static player-bound
    StaticLocalPointStream,       // static point
    StaticLocalVehicleStream,     // static vehicle
    StaticLocalObjectStream,      // static object
} from "@infernus/samp-voice";

// Global stream
const global = new SampVoiceGlobalStream(color, name);

// Local stream base methods (available on all stream types)
localStream.attachListener(player);       // → boolean
localStream.hasListenerIn(player);        // → boolean
localStream.detachListener(player);       // → boolean
localStream.detachAllListeners();
localStream.attachSpeaker(player);        // → boolean
localStream.hasSpeakerIn(player);         // → boolean
localStream.detachSpeaker(player);        // → boolean
localStream.detachAllSpeakers();
localStream.parameterSet(param, value);
localStream.parameterReset(param);
localStream.parameterHas(param);          // → boolean
localStream.parameterGet(param);          // → number
localStream.parameterSlideFromTo(param, start, end, timeMs);
localStream.parameterSlideTo(param, end, timeMs);
localStream.parameterSlide(param, delta, timeMs);
localStream.delete();

// Dynamic local streams
const dynPlayer = new DynamicLocalPlayerStream(distance, maxPlayers, player, color, name);
const dynPoint = new DynamicLocalPointStream(distance, maxPlayers, x, y, z, color, name);
const dynVeh = new DynamicLocalVehicleStream(distance, maxPlayers, vehicle, color, name);
// Local stream can also update position
localStream.updateDistance(distance);
localStream.updatePosition(x, y, z);
```

## Events

```typescript
import { SampVoiceEvent } from "@infernus/samp-voice";

SampVoiceEvent.onPlayerActivationKeyPress(({ player, keyId, next }) => { return next(); });
SampVoiceEvent.onPlayerActivationKeyRelease(({ player, keyId, next }) => { return next(); });
```

## Audio Effects

```typescript
import { ReverbEffect, EchoEffect, ChorusEffect, FlangerEffect, ... } from "@infernus/samp-voice";

const reverb = new ReverbEffect(priority, inGain, reverbMix, reverbTime, highFreqRtRatio);
reverb.attachStream(stream);
reverb.detachStream(stream);
reverb.delete();
```

## Exception

`SampVoiceException` is thrown on stream creation failure, invalid player/key operations, or initialization errors.

```typescript
import { SampVoiceException } from "@infernus/samp-voice";
```

## Constants & Enums

```typescript
SV_NULL = 0;
SV_INFINITY = -1;
SV_VERSION = 11;

enum SvParameterEnum { FREQUENCY = 1, VOLUME = 2, PANNING = 3, EAX_MIX = 4, SRC = 8 }
```
