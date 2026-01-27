# @infernus/distance

[![npm](https://img.shields.io/npm/v/@infernus/distance)](https://www.npmx.dev/package/@infernus/distance) ![npm](https://img.shields.io/npm/dw/@infernus/distance) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/distance)

A wrapper of the popular [SA-MP distance library](https://github.com/Y-Less/samp-distance) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/distance
```

## Example

```ts
import { Player, PlayerEvent } from "@infernus/core";
import {
  getClosestVehicleToPlayer,
  isPlayerInRangeOfPlayer,
  isPlayerInRangeOfVehicle,
} from "@infernus/distance";

PlayerEvent.onCommandText("pay", ({ player, subcommand, next }) => {
  const [playerId2, amount] = subcommand;
  if (!playerId2 || !amount) {
    return player.sendClientMessage(
      -1,
      "USAGE: /pay <Player name/ID> <Amount>",
    );
  }

  const player2 = Player.getInstance(+playerId2);

  if (!player2 || !isPlayerInRangeOfPlayer(player, player2, 5.0)) {
    return player.sendClientMessage(
      0xff0000ff,
      "The specified player is not near you!",
    );
  }

  player.giveMoney(-amount);
  player2.giveMoney(+amount);
  return next();
});

PlayerEvent.onCommandText("fixtires", ({ player, next }) => {
  const vehicle = getClosestVehicleToPlayer(player);

  if (!vehicle || !isPlayerInRangeOfVehicle(player, vehicle, 10.0)) {
    return player.sendClientMessage(
      0xff0000ff,
      "You are not near any vehicle!",
    );
  }

  const { panels, doors, lights } = vehicle.getDamageStatus();
  vehicle.updateDamageStatus(panels, doors, lights, 0);
  return next();
});
```
