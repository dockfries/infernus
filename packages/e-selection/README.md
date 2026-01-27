# @infernus/e-selection

[![npm](https://img.shields.io/npm/v/@infernus/e-selection)](https://www.npmx.dev/package/@infernus/e-selection) ![npm](https://img.shields.io/npm/dw/@infernus/e-selection) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/e-selection)

A wrapper of the popular [SA-MP eSelection library](https://github.com/TommyB123/eSelection) for samp-node.

## Getting started

```sh
pnpm add @infernus/core @infernus/e-selection
```

## Example

```ts
import { type Player, PlayerEvent } from "@infernus/core";
import { type IModelData, ModelSelectionMenu } from "@infernus/e-selection";

PlayerEvent.onSpawn(({ player, next }) => {
  showSkinModelMenu(player)
  return next()
})

async function showSkinModelMenu(player: Player) {
  // create a list to populate with models.
  // add skin IDs 0, 1, 29 and 60 with "cool people only" text above skin ID 29.
  const skins: IModelData[] = [
    { modelId: 0 },
    { modelId: 1 },
    { modelId: 29, modelText: 'Cool people only' },
    { modelId: 60 },
  ].concat(Array.from({ length: 15 }).map((_, id): IModelData => {
    return { modelId: id, rotX: Math.random() * 5 }
  }))

  try {
    // use await_arr and set the response array to the model selection menu result
    const skin = await new ModelSelectionMenu({
      player,
      models: skins,
      headerText: 'Skins',
    }).show()

    // make sure the player actually clicked on a model and not the close button
    if (skin) {
      // assign the player the skin of their choosing
      player.setSkin(skin.modelId)
    }
  }
  catch (err) {
    player.sendClientMessage(-1, JSON.stringify(err))
  }
}
```
