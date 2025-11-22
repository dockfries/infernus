import { GameMode, rgba, TextDraw } from "@infernus/core";
import { DIRECTION_SIZE_MULTIPLIER } from "../constants";
import { ProgressBarDirectionEnum } from "../enums";
import { IProgressBar } from "../interfaces";

const progressBars: ProgressBar[] = [];

GameMode.onExit(() => {
  progressBars.forEach((bar) => bar.destroy());
  progressBars.length = 0;
});

export class ProgressBar {
  private _back: TextDraw | null = null;
  private _fill: TextDraw | null = null;
  private _main: TextDraw | null = null;

  private sourceInfo: Required<IProgressBar>;

  constructor(progressBar: IProgressBar) {
    const _min = progressBar.min ?? 0;
    const requiredBar: Required<IProgressBar> = {
      ...progressBar,
      direction: progressBar.direction ?? ProgressBarDirectionEnum.right,
      width: progressBar.width ?? 55,
      height: progressBar.height ?? 3.2,
      color: progressBar.color ?? 0xff1c1cff,
      min: _min,
      max: progressBar.max ?? 100,
      value: progressBar.value ?? _min,
      paddingX: progressBar.paddingX ?? 1.2,
      paddingY: progressBar.paddingY ?? 1.0,
      show: progressBar.show ?? false,
    };
    if (requiredBar.min > requiredBar.max) {
      const tmp = requiredBar.min;
      requiredBar.min = requiredBar.max;
      requiredBar.max = tmp;
    }
    if (requiredBar.value < requiredBar.min) {
      requiredBar.value = requiredBar.min;
    }
    if (requiredBar.value > requiredBar.max) {
      requiredBar.value = requiredBar.max;
    }
    this.sourceInfo = requiredBar;
  }

  create() {
    const { player } = this.sourceInfo;
    if (!player.isConnected()) {
      throw new Error(
        `attempt to create player progress bar for invalid player ${player.id}`,
      );
    }

    this.sourceInfo.min = this.sourceInfo.min ?? 0;
    this.sourceInfo.value = this.sourceInfo.value ?? 0;
    this.sourceInfo.paddingX = this.sourceInfo.paddingX ?? 1.2;
    this.sourceInfo.paddingY = this.sourceInfo.paddingY ?? 1.0;

    this.renderBar();
    return this;
  }

  destroy() {
    if (this._back && this._back.isValid()) {
      this._back.destroy();
    }
    this._back = null;

    if (this._fill && this._fill.isValid()) {
      this._fill.destroy();
    }
    this._fill = null;

    if (this._main && this._main.isValid()) {
      this._main.destroy();
    }
    this._main = null;
  }

  getPos() {
    return { x: this.sourceInfo.x, y: this.sourceInfo.y };
  }

  setPos(x: number, y: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.x = x;
    this.sourceInfo.y = y;
    this.renderBar();
  }

  getWidth() {
    return this.sourceInfo.width;
  }

  setWidth(width: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.width = width;
    this.renderBar();
    return true;
  }

  getHeight() {
    return this.sourceInfo.height;
  }

  setHeight(height: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.height = height;
    this.renderBar();
    return true;
  }

  getMinValue() {
    return this.sourceInfo.min;
  }

  setMinValue(min: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.min = min;
    this.renderBar();
    return true;
  }

  getMaxValue() {
    return this.sourceInfo.max;
  }

  setMaxValue(max: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.max = max;
    this.renderBar();
    return true;
  }

  getValue() {
    return this.sourceInfo.value;
  }

  setValue(value: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.value = value;
    this.renderBar();
    return true;
  }

  getDirection() {
    return this.sourceInfo.direction;
  }

  setDirection(direction: ProgressBarDirectionEnum) {
    if (!this.isValid()) return false;
    this.sourceInfo.direction = direction;
    this.renderBar();
  }

  getPadding() {
    return { x: this.sourceInfo.paddingX, y: this.sourceInfo.paddingY };
  }

  setPadding(x: number, y: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.paddingX = x;
    this.sourceInfo.paddingY = y;
    this.renderBar();
    return true;
  }

  getColor() {
    return this.sourceInfo.color;
  }

  setColor(color: number | string) {
    if (!this.isValid()) return false;
    this.sourceInfo.color = color;

    const _color = rgba(color);

    this._back?.setBoxColors(0x00000000 | (_color & 0x000000ff));
    this._fill?.setBoxColors(
      (_color & 0xffffff00) | (0x66 & ((_color & 0x000000ff) / 2)),
    );
    this._main?.setBoxColors(_color);
    return true;
  }

  isValid() {
    const { _back, _fill, _main } = this;
    if (!_back || !_fill || !_main) return false;
    return _back.isValid() && _fill.isValid() && _main.isValid();
  }

  show() {
    if (!this.isValid()) {
      return false;
    }

    this.sourceInfo.show = true;

    this._back!.show();
    this._fill!.show();
    this._main!.show();
    return true;
  }

  hide() {
    if (!this.isValid()) {
      return false;
    }

    this.sourceInfo.show = false;

    this._back!.hide();
    this._fill!.hide();
    this._main!.hide();
    return true;
  }

  private getRations() {
    const { direction, max, value, min } = this.sourceInfo;

    const rangeValue = max - min;
    let from = 0;
    let to = 0;
    if (
      direction === ProgressBarDirectionEnum.horizontal ||
      direction === ProgressBarDirectionEnum.vertical
    ) {
      if (max < 0.0) {
        from = 1.0;
      } else if (min > 0.0) {
        from = 0.0;
      } else {
        from = -min / rangeValue;
      }
    } else {
      from = 0.0;
    }
    to = (value - min) / rangeValue;
    return { from, to };
  }

  private computeBoundary() {
    const { x, y, paddingX, paddingY, width, height, direction } =
      this.sourceInfo;

    const isVertical = direction > ProgressBarDirectionEnum.horizontal;

    const outerPosX2 = x + width;
    const outerPosY2 = y + height;
    let innerPosX1 = x + paddingX;
    let innerPosX2 = outerPosX2 - paddingX;
    const innerPosY1 = y + paddingY;
    const innerPosY2 = outerPosY2 - paddingY;
    const innerSizeX = innerPosX2 - innerPosX1;
    const innerSizeY = innerPosY2 - innerPosY1;
    let valuePosX1 = 0;
    let valuePosY1 = 0;
    let valuePosX2 = 0;
    let valuePosY2 = 0;

    const sizeMultiplier = DIRECTION_SIZE_MULTIPLIER[direction];
    let { from, to } = this.getRations();
    from *= sizeMultiplier;
    to *= sizeMultiplier;
    if (isVertical) {
      valuePosX1 = innerPosX1;
      valuePosX2 = innerPosX2;
    } else {
      valuePosY1 = innerPosY1;
      valuePosY2 = innerPosY2;
    }

    switch (direction) {
      case ProgressBarDirectionEnum.right: {
        valuePosX1 = innerPosX1;
        break;
      }
      case ProgressBarDirectionEnum.left: {
        valuePosX1 = innerPosX2;
        break;
      }
      case ProgressBarDirectionEnum.horizontal: {
        valuePosX1 = innerPosX1;
        break;
      }
      case ProgressBarDirectionEnum.up: {
        valuePosY1 = innerPosY2;
        break;
      }
      case ProgressBarDirectionEnum.down: {
        valuePosY1 = innerPosY1;
        break;
      }
      case ProgressBarDirectionEnum.vertical: {
        valuePosY1 = innerPosY2;
        break;
      }
    }
    if (isVertical) {
      valuePosY2 = valuePosY1;
      valuePosY1 += innerSizeY * from;
      valuePosY2 += innerSizeY * to;
    } else {
      valuePosX2 = valuePosX1;
      valuePosX1 += innerSizeX * from;
      valuePosX2 += innerSizeX * to;
    }

    if (valuePosX1 > valuePosX2) {
      const tmp = valuePosX1;
      valuePosX1 = valuePosX2;
      valuePosX2 = tmp;
    }

    if (valuePosY1 > valuePosY2) {
      const tmp = valuePosY1;
      valuePosY1 = valuePosY2;
      valuePosY2 = tmp;
    }

    const correctionX = 1.25;
    valuePosX1 += correctionX;
    valuePosX2 -= correctionX;
    innerPosX1 += correctionX;
    innerPosX2 -= correctionX;

    return {
      backgroundPosX: x,
      backgroundPosY: y,
      backgroundRight: outerPosX2,
      backgroundHeight: 0.1 * (outerPosY2 - y),
      fillerPosX: innerPosX1,
      fillerPosY: innerPosY1,
      fillerRight: innerPosX2,
      fillerHeight: 0.1 * (innerPosY2 - innerPosY1),
      valuePosX: valuePosX1,
      valuePosY: valuePosY1,
      valueRight: valuePosX2,
      valueHeight: 0.1 * (valuePosY2 - valuePosY1),
    };
  }

  private isNeedToDrawValue() {
    const { direction, max, value, min } = this.sourceInfo;
    if (
      direction === ProgressBarDirectionEnum.horizontal ||
      direction === ProgressBarDirectionEnum.vertical
    ) {
      if (max < 0.0) {
        return value < max;
      } else if (min > 0.0) {
        return value > min;
      } else {
        return Math.abs(value) > 0.001 * (max - min);
      }
    } else {
      return value > min;
    }
  }

  private renderBar() {
    let back: TextDraw | null = null;
    let fill: TextDraw | null = null;
    let main: TextDraw | null = null;
    try {
      const { player, color } = this.sourceInfo;

      if (!player.isConnected()) {
        return false;
      }

      this.destroy();

      const {
        backgroundPosX,
        backgroundPosY,
        backgroundRight,
        backgroundHeight,
        fillerPosX,
        fillerPosY,
        fillerRight,
        fillerHeight,
        valuePosX,
        valuePosY,
        valueRight,
        valueHeight,
      } = this.computeBoundary();

      back = new TextDraw({
        x: backgroundPosX,
        y: backgroundPosY,
        text: "_",
        player,
      })
        .create()
        .setTextSize(backgroundRight, 0.0)
        .setLetterSize(1.0, backgroundHeight)
        .useBox(true);

      fill = new TextDraw({
        x: fillerPosX,
        y: fillerPosY,
        text: "_",
        player,
      })
        .create()
        .setTextSize(fillerRight, 0.0)
        .setLetterSize(1.0, fillerHeight)
        .useBox(true);

      const drawMain = this.isNeedToDrawValue();

      main = new TextDraw({
        x: valuePosX,
        y: valuePosY,
        text: "_",
        player,
      })
        .create()
        .setTextSize(valueRight, 0.0)
        .setLetterSize(1.0, valueHeight)
        .useBox(drawMain);

      this._back = back;
      this._fill = fill;
      this._main = main;

      this.setColor(color);

      if (this.sourceInfo.show) {
        this.show();
      }

      return true;
    } catch {
      if (back && back.isValid()) {
        back.destroy();
      }
      if (fill && fill.isValid()) {
        fill.destroy();
      }
      if (main && main.isValid()) {
        main.destroy();
      }
    }
    return false;
  }
}
