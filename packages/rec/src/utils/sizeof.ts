import { CppField } from "../types";

export function sizeof(field: CppField): number {
  if (
    field.bitWidth !== undefined &&
    field.bitWidth > 0 &&
    field.bitWidth < 8
  ) {
    return 1;
  }
  const length = Array.isArray(field.value) ? field.value.length : 1;
  switch (field.type) {
    case "uint32_t":
    case "float":
      return length * 4;
    case "int16_t":
    case "uint16_t":
      return length * 2;
    case "uint8_t":
    case "bool":
      return length * 1;
    case "struct": {
      const size = field.value!.reduce((acc, curr) => acc + sizeof(curr), 0);
      if (size === 0) {
        throw new Error(`Invalid struct: ${field.field}`);
      }
      return size;
    }
    case "union": {
      const size = sizeof(field.value![0]);
      const isValid = field
        .value!.slice(1)
        .every((curr) => sizeof(curr) === size);
      if (!isValid) {
        throw new Error(`Invalid union: ${field.field}`);
      }
      return size;
    }
  }
}
