import sharp from "sharp";
import { ART_CHUNK } from "../constants";

export function degreeToRadius(deg: number): number {
  return (Math.PI * deg) / 180;
}

function colorToHex(color: number): string {
  return `{${color.toString(16).padStart(6, "0")}}g`;
}

export function buildString(block: number[], w: number, h: number): string {
  const parts: string[] = [];
  let prev = -1;

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const c = block[i + j * ART_CHUNK];
      if (c !== prev) {
        prev = c;
        parts.push(colorToHex(c));
      } else {
        parts.push("g");
      }
    }
    parts.push("\n");
  }

  return parts.join("");
}

export function clip(a: number, min: number, max: number): number {
  return a > max ? max : Math.max(a, min);
}

export function cutBlock(
  pixels: Buffer,
  imgW: number,
  imgH: number,
  gridX: number,
  gridY: number,
  rotated: boolean,
): { block: number[]; curW: number; curH: number } {
  const curW = Math.min(ART_CHUNK, imgW - gridX * ART_CHUNK);
  const curH = Math.min(ART_CHUNK, imgH - gridY * ART_CHUNK);
  const block = new Array(ART_CHUNK * ART_CHUNK).fill(0);

  for (let j = 0; j < ART_CHUNK; j++) {
    for (let i = 0; i < ART_CHUNK; i++) {
      const sx = gridX * ART_CHUNK + i;
      const sy = gridY * ART_CHUNK + j;

      let color = 0;
      if (sx < imgW && sy < imgH) {
        const idx = (sy * imgW + sx) << 2;
        color = (pixels[idx] << 16) | (pixels[idx + 1] << 8) | pixels[idx + 2];
      }

      block[i + j * ART_CHUNK] = color;
    }
  }

  if (rotated) {
    const rotated_block = new Array(ART_CHUNK * ART_CHUNK).fill(0);
    for (let j = 0; j < ART_CHUNK; j++) {
      for (let i = 0; i < ART_CHUNK; i++) {
        rotated_block[j + (ART_CHUNK - 1 - i) * ART_CHUNK] = block[i + j * ART_CHUNK];
      }
    }
    return { block: rotated_block, curW, curH };
  }

  return { block, curW, curH };
}

export async function loadImage(
  input: string | Buffer,
  resize?: { width: number; height: number },
): Promise<{ pixels: Buffer; width: number; height: number }> {
  let pipeline = sharp(input);
  if (resize) {
    pipeline = pipeline.resize(resize.width, resize.height);
  }

  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  return { pixels: data, width: info.width, height: info.height };
}
