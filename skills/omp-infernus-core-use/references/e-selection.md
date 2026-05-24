# @infernus/e-selection — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Enhanced model selection menu using TextDraw. Wraps [eSelection library](https://github.com/TommyB123/eSelection).

```bash
pnpm add @infernus/core @infernus/e-selection
```

## ModelSelectionMenu

```typescript
import { ModelSelectionMenu } from "@infernus/e-selection";
import type { IModelData, IModelOptions } from "@infernus/e-selection";

const menu = new ModelSelectionMenu({
    player,
    models: [
        { modelId: 0 },
        { modelId: 29, modelText: "Cool people only" },
    ],
    headerText: "Select a skin",
    maxItemPerPage: 20,
    bannerColor: "#333",
    menuBgColor: "#222",
    menuTextColor: "#fff",
    itemBgColor: "#444",
    itemTextColor: "#0f0",
    coolDownMs: 500,
});

const model: IModelData | null = await menu.show();

menu.setPage(page);   // → boolean, navigate to page
```

## Interfaces

```typescript
interface IModelData {
    modelId: number;
    modelText?: string;
    rotX?: number; rotY?: number; rotZ?: number;
    zoom?: number;
    vehColor?: [number, number];
}

interface IModelOptions {
    player: Player;
    models: IModelData[];
    headerText?: string;
    maxItemPerPage?: number;
    bannerColor?: number | string;
    menuBgColor?: number | string;
    menuTextColor?: number | string;
    itemBgColor?: number | string;
    itemTextColor?: number | string;
    coolDownMs?: number;
}
```
