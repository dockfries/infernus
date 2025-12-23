import { Player, TextDraw } from "@infernus/core";

export function darkenColor(color: number, factor: number): number {
  const r = (color >> 24) & 0xff;
  const g = (color >> 16) & 0xff;
  const b = (color >> 8) & 0xff;
  const darkenedR = Math.floor(r * factor);
  const darkenedG = Math.floor(g * factor);
  const darkenedB = Math.floor(b * factor);
  return (darkenedR << 24) | (darkenedG << 16) | (darkenedB << 8) | 0xff;
}

export function setupTextDraw(
  td: TextDraw | null,
  layout: { x: number; y: number; width: number; height: number },
  color: number,
  player: Player,
): TextDraw {
  if (!td || !td.isValid()) {
    td = new TextDraw({
      x: layout.x,
      y: layout.y,
      text: "LD_SPAC:white",
      player,
    })
      .create()
      .setFont(4)
      .setColor(color);
  }
  return td
    .setPos(layout.x, layout.y)
    .setColor(color)
    .setTextSize(layout.width, layout.height);
}
