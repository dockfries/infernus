# @infernus/progress — API Reference

> All API calls must be inside event callbacks (`GameMode.onInit`, etc.). Module-level calls silently fail.

Progress bar using TextDraw sprites.

```bash
pnpm add @infernus/core @infernus/progress
```

## ProgressBar

```typescript
import { ProgressBar, ProgressBarDirectionEnum } from "@infernus/progress";

// Create
const bar = new ProgressBar({
  player,
  x: 200,
  y: 300,
  width: 100,
  height: 10,
  color: "#00ff00",
  direction: ProgressBarDirectionEnum.left, // left, right, up, down
  max: 100,
  min: 0,
  value: 50,
  paddingX: 2,
  paddingY: 2,
  show: true,
});
bar.create();

// Methods
bar.getValue();
bar.setValue(75); // → boolean
bar.getMinValue();
bar.setMinValue(0); // → boolean
bar.getMaxValue();
bar.setMaxValue(100); // → boolean
bar.getPos(); // → { x, y }
bar.setPos(x, y); // → boolean
bar.getWidth();
bar.setWidth(w); // → boolean
bar.getHeight();
bar.setHeight(h); // → boolean
bar.getDirection();
bar.setDirection(dir); // → boolean
bar.getPadding();
bar.setPadding(x, y); // → boolean
bar.getColor();
bar.setColor(color); // → boolean
bar.isValid(); // → boolean
bar.show();
bar.hide();
bar.getUsedTextDrawIds(); // → number[]
bar.destroy();
```

## Exception

`ProgressBarException` is thrown on invalid configuration (out-of-range values, invalid direction) or destroyed bar access.

```typescript
import { ProgressBarException } from "@infernus/progress";
```
