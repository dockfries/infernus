import { GameMode, rgba, TextDraw } from "@infernus/core";
import { ProgressBarDirectionEnum } from "../enums";
import { IProgressBar } from "../interfaces";
import { darkenColor, setupTextDraw } from "../utils";

const progressBars: ProgressBar[] = [];

GameMode.onExit(({ next }) => {
  progressBars.forEach((bar) => bar.destroy());
  progressBars.length = 0;
  return next();
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
      direction: progressBar.direction ?? ProgressBarDirectionEnum.left,
      min: _min,
      max: progressBar.max ?? 100,
      value: progressBar.value ?? _min,
      paddingX: progressBar.paddingX ?? 1.2,
      paddingY: progressBar.paddingY ?? 1.2,
      show: progressBar.show ?? false,
    };

    if (requiredBar.min > requiredBar.max) {
      [requiredBar.min, requiredBar.max] = [requiredBar.max, requiredBar.min];
    }
    requiredBar.value = Math.max(
      requiredBar.min,
      Math.min(requiredBar.max, requiredBar.value),
    );

    this.sourceInfo = requiredBar;
  }

  create() {
    const { player } = this.sourceInfo;
    if (!player.isConnected()) {
      throw new Error(
        `attempt to create player progress bar for invalid player ${player.id}`,
      );
    }
    this.render();
    return this;
  }

  destroy() {
    [this._back, this._fill, this._main].forEach((td) => {
      if (td && td.isValid()) td.destroy();
    });
    this._back = this._fill = this._main = null;
  }

  getPos() {
    return { x: this.sourceInfo.x, y: this.sourceInfo.y };
  }

  setPos(x: number, y: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.x = x;
    this.sourceInfo.y = y;
    this.render();
    return true;
  }

  getWidth() {
    return this.sourceInfo.width;
  }

  setWidth(width: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.width = width;
    this.render();
    return true;
  }

  getHeight() {
    return this.sourceInfo.height;
  }

  setHeight(height: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.height = height;
    this.render();
    return true;
  }

  getMinValue() {
    return this.sourceInfo.min;
  }

  setMinValue(min: number) {
    if (!this.isValid()) return false;

    if (min > this.sourceInfo.max) {
      [min, this.sourceInfo.max] = [this.sourceInfo.max, min];
    }

    this.sourceInfo.min = min;

    this.sourceInfo.value = Math.max(
      this.sourceInfo.min,
      Math.min(this.sourceInfo.max, this.sourceInfo.value),
    );

    this.render();
    return true;
  }

  getMaxValue() {
    return this.sourceInfo.max;
  }

  setMaxValue(max: number) {
    if (!this.isValid()) return false;

    if (max < this.sourceInfo.min) {
      [this.sourceInfo.min, max] = [max, this.sourceInfo.min];
    }

    this.sourceInfo.max = max;

    this.sourceInfo.value = Math.max(
      this.sourceInfo.min,
      Math.min(this.sourceInfo.max, this.sourceInfo.value),
    );

    this.render();
    return true;
  }

  getValue() {
    return this.sourceInfo.value;
  }

  setValue(value: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.value = Math.max(
      this.sourceInfo.min,
      Math.min(this.sourceInfo.max, value),
    );
    this.render();
    return true;
  }

  getDirection() {
    return this.sourceInfo.direction;
  }

  setDirection(direction: ProgressBarDirectionEnum) {
    if (!this.isValid()) return false;
    this.sourceInfo.direction = direction;
    this.render();
    return true;
  }

  getPadding() {
    return { x: this.sourceInfo.paddingX, y: this.sourceInfo.paddingY };
  }

  setPadding(x: number, y: number) {
    if (!this.isValid()) return false;
    this.sourceInfo.paddingX = x;
    this.sourceInfo.paddingY = y;
    this.render();
    return true;
  }

  getColor() {
    return this.sourceInfo.color;
  }

  setColor(color: number | string) {
    if (!this.isValid()) return false;
    this.sourceInfo.color = color;
    this.render();
    return true;
  }

  isValid() {
    return [this._back, this._fill, this._main].every(
      (td) => td && td.isValid(),
    );
  }

  show() {
    if (!this.isValid()) return false;
    this.sourceInfo.show = true;
    this._back!.show();
    this._fill!.show();
    if (this.getProgressRatio() > 0) {
      this._main!.show();
    } else {
      this._main!.hide();
    }
    return true;
  }

  hide() {
    if (!this.isValid()) return false;
    this.sourceInfo.show = false;
    this._back!.hide();
    this._fill!.hide();
    if (this._main) this._main.hide();
    return true;
  }

  private getProgressRatio(): number {
    const { min, max, value } = this.sourceInfo;
    const range = max - min;
    return range === 0 ? 0 : Math.max(0, Math.min(1, (value - min) / range));
  }

  private computeLayout() {
    const { x, y, width, height, paddingX, paddingY, direction } =
      this.sourceInfo;
    const progress = this.getProgressRatio();

    const totalWidth = width + paddingX * 2;
    const totalHeight = height + paddingY * 2;

    const backX = x;
    const backY = y;
    const backWidth = totalWidth;
    const backHeight = totalHeight;

    const fillX = x + paddingX;
    const fillY = y + paddingY;
    const fillWidth = width;
    const fillHeight = height;

    let progressX = fillX;
    let progressY = fillY;
    let progressWidth = 0;
    let progressHeight = 0;

    const isVertical =
      direction === ProgressBarDirectionEnum.up ||
      direction === ProgressBarDirectionEnum.down;

    if (isVertical) {
      progressHeight = Math.max(0, height * progress);
      progressWidth = width;

      switch (direction) {
        case ProgressBarDirectionEnum.up:
          progressY = fillY + height - progressHeight;
          break;
      }
    } else {
      progressWidth = Math.max(0, width * progress);
      progressHeight = height;

      switch (direction) {
        case ProgressBarDirectionEnum.right:
          progressX = fillX + width - progressWidth;
          break;
      }
    }

    return {
      back: { x: backX, y: backY, width: backWidth, height: backHeight },
      fill: { x: fillX, y: fillY, width: fillWidth, height: fillHeight },
      progress: {
        x: progressX,
        y: progressY,
        width: progressWidth,
        height: progressHeight,
      },
    };
  }

  private render() {
    const { player, color } = this.sourceInfo;
    if (!player.isConnected()) return false;

    try {
      const layout = this.computeLayout();
      const baseColor = rgba(color);
      const backColor = darkenColor(baseColor, 0.3);
      const fillColor = darkenColor(baseColor, 0.6);

      this._back = setupTextDraw(this._back, layout.back, backColor, player);
      this._fill = setupTextDraw(this._fill, layout.fill, fillColor, player);
      this._main = setupTextDraw(
        this._main,
        layout.progress,
        baseColor,
        player,
      );

      if (this.sourceInfo.show) {
        this.show();
      } else {
        this.hide();
      }

      return true;
    } catch {
      this.destroy();
      return false;
    }
  }
}
