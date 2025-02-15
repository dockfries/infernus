import fs from "fs/promises";
import { CppField } from "../types";
import { DataBlock } from "./dataBlock";

export class BinaryReader {
  private buffer: DataView;
  private position = 0;
  private bitOffset = 0;

  constructor(data: Buffer) {
    this.buffer = new DataView(data.buffer);
  }

  private readInt(size: number, field: CppField): number {
    let value: number;

    if (
      field.bitWidth !== undefined &&
      field.bitWidth > 0 &&
      field.bitWidth < 8
    ) {
      const byte = this.buffer.getUint8(this.position);
      const mask = (1 << field.bitWidth) - 1;
      value = (byte >> this.bitOffset) & mask;

      this.bitOffset += field.bitWidth;
      if (this.bitOffset >= 8) {
        this.position += 1;
        this.bitOffset -= 8;
      }
    } else {
      switch (size) {
        case 1:
          value = this.buffer.getInt8(this.position);
          break;
        case 2:
          value = this.buffer.getInt16(this.position, true);
          break;
        case 4:
          value = this.buffer.getInt32(this.position, true);
          break;
        default:
          throw new Error("Unsupported integer size");
      }
      this.position += size;
      this.bitOffset = 0;
    }

    return value;
  }

  private readFloat(): number {
    const value = this.buffer.getFloat32(this.position, true);
    this.position += 4;
    this.bitOffset = 0;
    return value;
  }

  private readBool(): boolean {
    const value = this.buffer.getUint8(this.position) !== 0;
    this.position += 1;
    this.bitOffset = 0;
    return value;
  }

  private readField(field: CppField): any {
    if (
      Array.isArray(field.value) &&
      !["struct", "union"].includes(field.type)
    ) {
      return field.value.map(() => this.readSingleField(field));
    }
    return this.readSingleField(field);
  }

  private readSingleField(field: CppField): any {
    if (
      field.bitWidth !== undefined &&
      field.bitWidth > 0 &&
      field.bitWidth < 8
    ) {
      return this.readInt(1, field);
    }

    switch (field.type) {
      case "uint32_t":
        return this.readInt(4, field);
      case "int16_t":
      case "uint16_t":
        return this.readInt(2, field);
      case "float":
        return this.readFloat();
      case "uint8_t":
        return this.readInt(1, field);
      case "bool":
        return this.readBool();
      case "struct":
        return field.value!.reduce(
          (acc, subField) => {
            acc[subField.field] = this.readField(subField);
            return acc;
          },
          {} as Record<string, any>,
        );
      case "union": {
        const originPosition = this.position;
        return field.value!.reduce(
          (acc, subField) => {
            this.position = originPosition;
            acc[subField.field] = this.readField(subField);
            return acc;
          },
          {} as Record<string, any>,
        );
      }
    }
  }

  read<T extends DataBlock>(dataBlock: T): T {
    const cppObject = Object.keys(dataBlock)
      .map((key) => {
        const metaData = Reflect.getMetadata(`field:${key}`, dataBlock);
        if (!metaData) return null;
        return {
          ...metaData,
          value: ["struct", "union"].includes(metaData.type)
            ? metaData.value.map((cppField: any) => {
                return {
                  ...cppField,
                  value: dataBlock[key as keyof DataBlock][cppField.field],
                };
              })
            : dataBlock[key as keyof DataBlock],
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.sort - b.sort);
    const result: any = {};
    for (const field of cppObject) {
      result[field.field] = this.readField(field);
    }
    return result;
  }

  static async fromFile(filePath: string): Promise<BinaryReader> {
    const data = await fs.readFile(filePath);
    return new BinaryReader(data);
  }

  hasMoreData(): boolean {
    return this.position < this.buffer.byteLength;
  }

  getSize() {
    return this.buffer.byteLength;
  }
}
