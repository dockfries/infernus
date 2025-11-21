# @infernus/nex-ac

[![npm](https://img.shields.io/npm/v/@infernus/nex-ac)](https://www.npmjs.com/package/@infernus/nex-ac) ![npm](https://img.shields.io/npm/dw/@infernus/nex-ac) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/nex-ac)

A wrapper of the popular [SA-MP nex-ac library](https://github.com/NexiusTailer/Nex-AC/) for samp-node.

## Notice

- Mandatory use raknet and streamer
- Removed SKY and non-streamer code

## Getting started

```sh
pnpm add @infernus/core @infernus/raknet @infernus/nex-ac
```

## Example

```ts
import { GameMode } from '@infernus/core'
import { $t, antiCheatKickWithDesync, defineNexACConfig, onCheatDetected } from '@infernus/nex-ac'

// other imports and code

defineNexACConfig(() => {
  return {
    LOCALE: 'en_US',
    DEBUG: true,
  }
})

onCheatDetected(({ player, ipAddress, type, code, next }) => {
  if (type) {
    GameMode.blockIpAddress(ipAddress, 0)
    return next()
  }

  switch (code) {
    case 5:
    case 6:
    case 11:
    case 14:
    case 22:
    case 32: {
      return next()
    }
    case 40: {
      player.sendClientMessage(-1, $t('MAX_CONNECTS_MSG', null, player.locale))
      break
    }
    case 41: {
      player.sendClientMessage(-1, $t('UNKNOWN_CLIENT_MSG', null, player.locale))
      break
    }
    default: {
      player.sendClientMessage(-1, $t('KICK_MSG', [code], player.locale))
      break
    }
  }
  antiCheatKickWithDesync(player, code)
  return next()
})
```
