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
SampVoice.debug(mode: boolean);             // enable/disable debug
SampVoice.enableDebug();
SampVoice.disableDebug();
SampVoice.checkDebug();                     // → boolean
SampVoice.getVersion(player);              // → number
SampVoice.hasMicro(player);                // → boolean
SampVoice.startRecord(player);             // → boolean
SampVoice.stopRecord(player);              // → boolean
SampVoice.addKey(player, keyId);           // → boolean
SampVoice.setKeyWithChannels(player, keyId, channels = SV_CHANNELS_ALL);  // → boolean
SampVoice.hasKey(player, keyId);           // → boolean
SampVoice.removeKey(player, keyId);        // → boolean
SampVoice.removeAllKeys(player);
SampVoice.mutePlayerStatus(player);        // → boolean
SampVoice.mutePlayerEnable(player);
SampVoice.mutePlayerDisable(player);
SampVoice.enableListener(player);          // → boolean
SampVoice.disableListener(player);         // → boolean
SampVoice.checkListener(player);           // → boolean
SampVoice.enableSpeaker(player, channelMask = SV_CHANNELS_ALL);   // → boolean
SampVoice.disableSpeaker(player, channelMask = SV_CHANNELS_ALL);  // → boolean
SampVoice.checkSpeaker(player, channelMask = SV_CHANNELS_ALL);    // → boolean
```

## Stream Classes

```typescript
import {
    SampVoiceGlobalStream,        // everyone connected hears
    SampVoiceLocalStream,         // positioned stream (base for all local streams)
    DynamicLocalPlayerStream,     // follows a player
    DynamicLocalPointStream,      // fixed at a point
    DynamicLocalVehicleStream,    // follows a vehicle
    DynamicLocalObjectStream,     // follows an object
    StaticLocalPlayerStream,      // static player-bound
    StaticLocalPointStream,       // static point
    StaticLocalVehicleStream,     // static vehicle
    StaticLocalObjectStream,      // static object
} from "@infernus/samp-voice";

// Global stream (color defaults to SV_NULL, name required)
const global = new SampVoiceGlobalStream(color = SV_NULL, name);

// All stream methods (SampVoiceStream base class)
stream.attachListener(player);                    // → boolean
stream.hasListenerIn(player);                     // → boolean
stream.detachListener(player);                    // → boolean
stream.detachAllListeners();
stream.attachSpeaker(player);                     // → boolean
stream.attachSpeakerWithChannels(player, channelMask = SV_CHANNELS_ALL);  // → boolean
stream.hasSpeakerIn(player);                      // → boolean
stream.detachSpeaker(player);                     // → boolean
stream.detachAllSpeakers();
stream.parameterSet(param, value);
stream.parameterReset(param);
stream.parameterHas(param);                       // → boolean
stream.parameterGet(param);                       // → number
stream.parameterSlideFromTo(param, start, end, timeMs);
stream.parameterSlideTo(param, end, timeMs);
stream.parameterSlide(param, delta, timeMs);
stream.enableTransiter();                         // → boolean
stream.disableTransiter();                        // → boolean
stream.checkTransiter();                          // → boolean
stream.setTarget(targetType: SvTargetEnum, targetId: number);
stream.setIcon(icon: string);
stream.delete();
stream.constructor(ptr, type);                     // internal, used by subclasses

// Static lookup
SampVoiceStream.getInstance(ptr);                  // → SampVoiceStream | undefined
SampVoiceStream.getInstances(type?);               // → SampVoiceStream[]

// Local stream extra methods (SampVoiceLocalStream extends SampVoiceStream)
localStream.updateDistance(distance);
localStream.updatePosition(x, y, z);

// Dynamic local streams (include maxPlayers param)
const dynPlayer = new DynamicLocalPlayerStream(distance, maxPlayers, player, color = SV_NULL, name);
const dynPoint  = new DynamicLocalPointStream(distance, maxPlayers, x, y, z, color = SV_NULL, name);
const dynVeh    = new DynamicLocalVehicleStream(distance, maxPlayers, vehicle, color = SV_NULL, name);
const dynObj    = new DynamicLocalObjectStream(distance, maxPlayers, objectId, color = SV_NULL, name);

// Static local streams (no maxPlayers)
const stPlayer  = new StaticLocalPlayerStream(distance, player, color = SV_NULL, name);
const stPoint   = new StaticLocalPointStream(distance, x, y, z, color = SV_NULL, name);
const stVeh     = new StaticLocalVehicleStream(distance, vehicle, color = SV_NULL, name);
const stObj     = new StaticLocalObjectStream(distance, objectId, color = SV_NULL, name);

// Each subclass also has typed static lookups
DynamicLocalPlayerStream.getInstance(ptr);         // → DynamicLocalPlayerStream | undefined
DynamicLocalPlayerStream.getInstances();           // → DynamicLocalPlayerStream[]
```

## Events

```typescript
import { SampVoiceEvent } from "@infernus/samp-voice";

SampVoiceEvent.onPlayerActivationKeyPress(({ player, keyId, next }) => {
  return next();
});
SampVoiceEvent.onPlayerActivationKeyRelease(({ player, keyId, next }) => {
  return next();
});
```

## Audio Effects

All effects extend `SampVoiceEffect` (abstract base).

```typescript
import {
    SampVoiceEffect,
    ReverbEffect, ChorusEffect, EchoEffect, FlangerEffect,
    CompressorEffect, DistortionEffect, GargleEffect,
    I3dl2reverbEffect, ParamEqEffect, EmptyEffect,
} from "@infernus/samp-voice";

// Create an effect (each constructor creates a native effect)
const reverb = new ReverbEffect(priority, inGain, reverbMix, reverbTime, highFreqRtRatio);
const chorus = new ChorusEffect(priority, wetDryMix, depth, feedback, frequency, waveform, delay, phase);
const echo   = new EchoEffect(priority, wetDryMix, feedback, leftDelay, rightDelay, panDelay);
const flanger = new FlangerEffect(priority, wetDryMix, depth, feedback, frequency, waveform, delay, phase);
const comp   = new CompressorEffect(priority, gain, attack, release, threshold, ratio, preDelay);
const dist   = new DistortionEffect(priority, gain, edge, postEQCenterFrequency, postEQBandwidth, preLowpassCutoff);
const gargle = new GargleEffect(priority, rateHz, waveShape);
const i3dl2  = new I3dl2reverbEffect(priority, room, roomHf, roomRollOffFactor, decayTime, decayHFratio, reflections, reflectionsDelay, reverb, reverbDelay, diffusion, density, hfReference);
const paramEq = new ParamEqEffect(priority, center, bandwidth, gain);
const empty   = new EmptyEffect();

// Base SampVoiceEffect methods
effect.attachStream(stream);
effect.detachStream(stream);
effect.appendFilter(filter: SvFilterEnum, ...args);   // → boolean
effect.removeFilter(filter: SvFilterEnum, priority);   // → boolean
effect.delete();

// Static lookup
SampVoiceEffect.getInstance(ptr);                      // → SampVoiceEffect | undefined
SampVoiceEffect.getInstances();                        // → SampVoiceEffect[]
```

Each effect's `appendFilter` accepts filter-specific args (use `SvFilterEnum`):

| Filter        | Args                                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `CHORUS`      | wetDryMix, depth, feedback, frequency, waveform, delay, phase                                                                                 |
| `COMPRESSOR`  | gain, attack, release, threshold, ratio, preDelay                                                                                             |
| `DISTORTION`  | gain, edge, postEQCenterFrequency, postEQBandwidth, preLowpassCutoff                                                                          |
| `ECHO`        | wetDryMix, feedback, leftDelay, rightDelay, panDelay                                                                                          |
| `FLANGER`     | wetDryMix, depth, feedback, frequency, waveform, delay, phase                                                                                 |
| `GARGLE`      | rateHz, waveShape                                                                                                                             |
| `I3DL2REVERB` | room, roomHf, roomRollOffFactor, decayTime, decayHFratio, reflections, reflectionsDelay, reverb, reverbDelay, diffusion, density, hfReference |
| `PARAMEQ`     | center, bandwidth, gain                                                                                                                       |
| `REVERB`      | inGain, reverbMix, reverbTime, highFreqRtRatio                                                                                                |

## Exception

`SampVoiceException` is thrown on stream creation failure, invalid player/key operations, or initialization errors.

```typescript
import { SampVoiceException } from "@infernus/samp-voice";
```

## Enums

```typescript
enum SvParameterEnum {
  FREQUENCY = 1,
  VOLUME = 2,
  PANNING = 3,
  EAX_MIX = 4,
  SRC = 8,
}

enum SvFilterEnum {
  CHORUS,
  COMPRESSOR,
  DISTORTION,
  ECHO,
  FLANGER,
  GARGLE,
  I3DL2REVERB,
  PARAMEQ,
  REVERB,
}

enum SvTargetEnum {
  VEHICLE = 1,
  PLAYER = 2,
  OBJECT = 3,
}
```

## Constants

```typescript
SV_NULL = 0;
SV_INFINITY = -1;
SV_VERSION = 11;
SV_CHANNELS_ALL = -1;
```
