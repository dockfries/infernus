import { IArtType, type CreateArtParams } from "./types";
import { degreeToRadius, buildString, cutBlock, loadImage } from "./utils";
import { ART_CHUNK, ART_TYPES, INVALID_ART_ID, MAX_ART_BLOCKS, MAX_ART_ID } from "./constants";
import { SArtException } from "./exceptions";
import { DynamicObject } from "@infernus/core";
import { artPool } from "./pool.js";

function generateId() {
  const used = [...artPool.keys()];

  if (used.length >= MAX_ART_ID) {
    return INVALID_ART_ID;
  }

  let id: number;
  do {
    id = Math.floor(Math.random() * MAX_ART_ID);
  } while (used.includes(id));

  return id;
}

export class SArt {
  private _id: number = INVALID_ART_ID;
  private objects: DynamicObject[] = [];

  get id() {
    return this._id;
  }

  constructor(private params: CreateArtParams) {}

  async create() {
    this.destroy();

    const { params } = this;
    const { pixels, width, height } = await loadImage(params.image, params.resize);
    if (width <= 0 || height <= 0) {
      throw new SArtException("FAILED to create art: could not load image");
    }

    const typeDef = ART_TYPES[params.type] ?? ART_TYPES[1];
    const { modelId, ws, hs } = typeDef;

    // oxlint-disable-next-line prefer-const
    let [rx, ry, rz] = params.rot;
    const ra = [degreeToRadius(rx), degreeToRadius(ry), degreeToRadius(rz)];

    if (modelId === 18887) {
      ry = -ry + 90;
      rx += 180;
      ra[0] = degreeToRadius(rx);
      ra[1] = degreeToRadius(ry);
    }

    const [sinRx, cosRx] = [Math.sin(ra[0]), Math.cos(ra[0])];
    const [sinRy, cosRy] = [Math.sin(ra[1]), Math.cos(ra[1])];
    const [sinRz, cosRz] = [Math.sin(ra[2]), Math.cos(ra[2])];

    const up: [number, number, number] = [
      sinRy * cosRz + sinRx * sinRz * cosRy,
      sinRz * sinRy - sinRx * cosRy * cosRz,
      -cosRx * cosRy,
    ];

    const right: [number, number, number] = [-sinRz * cosRx, cosRx * cosRz, -sinRx];

    const forward: [number, number, number] = [
      cosRy * cosRz - sinRx * sinRz * sinRy,
      sinRz * cosRy + sinRx * sinRy * cosRz,
      cosRx * sinRy,
    ];

    const cols = Math.ceil(width / ART_CHUNK);
    const rows = Math.ceil(height / ART_CHUNK);
    const total = cols * rows;

    if (total > MAX_ART_BLOCKS) {
      throw new SArtException(
        `FAILED to create art: too large image (${cols}×${rows}=${total} blocks)`,
      );
    }

    const artId = generateId();
    artPool.set(artId, this);
    this._id = artId;

    const [px, py, pz] = params.pos;
    const addRotZ = 180;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const { block, curW, curH } = cutBlock(pixels, width, height, i, j, modelId === 18887);

        let sx: number, sy: number, sz: number;
        if (modelId === 18887) {
          sx = (rows - 1 - i - cols / 2) * ws * right[0] + (j - rows / 2) * hs * forward[0] + px;
          sy = (rows - 1 - i - cols / 2) * ws * right[1] + (j - rows / 2) * hs * forward[1] + py;
          sz = (rows - 1 - i - cols / 2) * ws * right[2] + (j - rows / 2) * hs * forward[2] + pz;
        } else {
          sx = (i - cols / 2) * ws * right[0] + (j - rows / 2) * hs * up[0] + px;
          sy = (i - cols / 2) * ws * right[1] + (j - rows / 2) * hs * up[1] + py;
          sz = (i - cols / 2) * ws * right[2] + (j - rows / 2) * hs * up[2] + pz;
        }

        const colors = buildString(block, curW, curH);
        const addRy = modelId === 2814 ? -94.65 : 0;

        try {
          const obj = new DynamicObject({
            modelId: modelId,
            x: sx,
            y: sy,
            z: sz,
            rx,
            ry: ry + addRy,
            rz: rz + addRotZ,
            worldId: params.worldId,
            interiorId: params.interiorId,
            playerId: params.playerId,
            streamDistance: params.streamDistance,
            drawDistance: params.drawDistance,
          });
          obj.create();
          this.objects.push(obj);
          obj.setMaterialText("utf8", 0, colors, 140, "Webdings", 35, 0, 0, 0, 0);
          if (modelId === 2814) {
            obj.setMaterial(1, -1, "none", "none", 1);
          }
        } catch (e) {
          this.destroy();
          throw e;
        }
      }
    }
  }

  destroy() {
    const { objects, _id: prevId } = this;
    if (prevId === INVALID_ART_ID) return;

    for (const obj of objects) {
      if (obj.isValid()) {
        obj.destroy();
      }
    }

    this._id = INVALID_ART_ID;
    this.objects.length = 0;
    artPool.delete(prevId);
  }

  getObjects() {
    return [...this.objects];
  }

  static setType(type: number, schema: IArtType) {
    ART_TYPES[type] = schema;
  }

  static getType(type: number): IArtType | undefined {
    return ART_TYPES[type];
  }

  static getInstance(id: number) {
    return artPool.get(id);
  }

  static getInstances() {
    return [...artPool.values()];
  }
}
