import fs from "node:fs/promises";
import { CppField } from "../types";
import { DataBlock } from "./dataBlock";
import { RecException } from "../exceptions";

export class BinaryWriter {
  private buffer = Buffer.alloc(0);
  private position = 0;
  private bitOffset = 0;

  constructor() {}

  private ensureCapacity(additionalSize: number): void {
    if (this.position + additionalSize > this.buffer.length) {
      const newSize = Math.max(
        this.buffer.length * 2,
        this.position + additionalSize,
      );
      const newBuffer = Buffer.alloc(newSize);
      this.buffer.copy(newBuffer);
      this.buffer = newBuffer;
    }
  }

  private writeInt(value: number, size: number, field?: CppField): void {
    if (
      field?.bitWidth !== undefined &&
      field.bitWidth > 0 &&
      field.bitWidth < 8
    ) {
      if (this.position >= this.buffer.length) {
        this.ensureCapacity(1);
      }
      const byte = this.buffer[this.position];
      const mask = (1 << field.bitWidth) - 1;
      const shiftedValue = (value & mask) << this.bitOffset;

      this.buffer[this.position] =
        (byte & ~(mask << this.bitOffset)) | shiftedValue;

      this.bitOffset += field.bitWidth;
      if (this.bitOffset >= 8) {
        this.position += 1;
        this.bitOffset -= 8;
      }
    } else {
      this.ensureCapacity(size);
      switch (size) {
        case 1:
          this.buffer.writeInt8(value, this.position);
          break;
        case 2:
          this.buffer.writeInt16LE(value, this.position);
          break;
        case 4:
          this.buffer.writeInt32LE(value, this.position);
          break;
        default:
          throw new RecException("Unsupported integer size");
      }
      this.position += size;
      this.bitOffset = 0;
    }
  }

  private writeFloat(value: number): void {
    this.ensureCapacity(4);
    this.buffer.writeFloatLE(value, this.position);
    this.position += 4;
    this.bitOffset = 0;
  }

  private writeBool(value: boolean): void {
    this.ensureCapacity(1);
    this.buffer.writeUInt8(value ? 1 : 0, this.position);
    this.position += 1;
    this.bitOffset = 0;
  }

  private writeField(field: CppField): void {
    if (
      Array.isArray(field.value) &&
      !["struct", "union"].includes(field.type)
    ) {
      field.value.forEach((item) => {
        this.writeSingleField({ ...field, value: item } as CppField);
      });
    } else {
      this.writeSingleField(field);
    }
  }

  private writeSingleField(field: CppField): void {
    if (
      field.bitWidth !== undefined &&
      field.bitWidth > 0 &&
      field.bitWidth < 8
    ) {
      this.writeInt(field.value as number, 1, field);
    } else {
      switch (field.type) {
        case "uint32_t":
          this.writeInt(field.value as number, 4);
          break;
        case "int16_t":
        case "uint16_t":
          this.writeInt(field.value as number, 2);
          break;
        case "float":
          this.writeFloat(field.value as number);
          break;
        case "uint8_t":
          this.writeInt(field.value as number, 1);
          break;
        case "bool":
          this.writeBool(field.value as boolean);
          break;
        case "struct": {
          for (const subField of field.value!) {
            this.writeField(subField);
          }
          break;
        }
        case "union": {
          let foundField = false;
          for (const subField of field.value!) {
            if (
              subField.value !== undefined &&
              subField.value !== null &&
              (!Array.isArray(subField.value) ||
                subField.value.every((v) => !!v))
            ) {
              this.writeField(subField);
              foundField = true;
              break;
            }
          }
          if (!foundField) {
            throw new RecException(
              `No valid field found in union: ${field.field}`,
            );
          }
          break;
        }
      }
    }
  }

  write<T extends DataBlock>(dataBlock: T): void {
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
    for (const field of cppObject) {
      this.writeField(field);
    }
  }

  async writeFile(filePath: string): Promise<void> {
    await fs.writeFile(filePath, this.buffer.subarray(0, this.position));
  }
}
