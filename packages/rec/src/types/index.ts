export type CppField<OmittedKeys extends keyof CppTypeValueMap = never> = {
  [K in Exclude<keyof CppTypeValueMap, OmittedKeys>]: {
    type: K;
    field: string;
    sort?: number;
    value?: CppTypeValueMap[K];
    bitWidth?: number;
  };
}[Exclude<keyof CppTypeValueMap, OmittedKeys>];

export type CppTypeValueMap = {
  uint32_t: number | number[];
  int16_t: number | number[];
  uint16_t: number | number[];
  float: number | number[];
  uint8_t: number | number[];
  bool: boolean | boolean[];
  struct: CppField<"struct" | "union">[];
  union: CppField<"struct" | "union">[];
};

export type CppObject<OmittedKeys extends keyof CppTypeValueMap = never> =
  CppField<OmittedKeys>[];
