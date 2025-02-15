import { CppObject, CppTypeValueMap } from "../types";

export function Field(
  fieldType: Exclude<keyof CppTypeValueMap, "struct" | "union">,
  sort?: number,
): PropertyDecorator;

export function Field(
  fieldType: "struct" | "union",
  sort?: number,
  structUnionFields?: CppObject<"struct" | "union">,
): PropertyDecorator;

export function Field(
  fieldType: keyof CppTypeValueMap,
  sort: number = 0,
  structUnionFields?: CppObject<"struct" | "union">,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const metadataKey = `field:${propertyKey.toString()}`;
    const value = ["struct", "union"].includes(fieldType)
      ? structUnionFields!
      : 0;

    const cppField: any = {
      type: fieldType,
      field: propertyKey.toString(),
      sort,
      value,
    };
    Reflect.defineMetadata(metadataKey, cppField, target);
  };
}
