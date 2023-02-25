export const IsMenuDisabled = (menuid: number): boolean => {
  return Boolean(samp.callNative("IsMenuDisabled", "i", menuid));
};

export const IsMenuRowDisabled = (menuid: number, row: number): boolean => {
  return Boolean(samp.callNative("IsMenuRowDisabled", "ii", menuid, row));
};

export const GetMenuColumns = (menuid: number): number => {
  return samp.callNative("GetMenuColumns", "i", menuid);
};

export const GetMenuItems = (menuid: number, column: number): number => {
  return samp.callNative("GetMenuItems", "ii", menuid, column);
};

export const GetMenuPos = (menuid: number) => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "GetMenuPos",
    "iFF",
    menuid
  );
  return { fX, fY };
};

export const GetMenuColumnWidth = (menuid: number) => {
  const [fColumn1 = 0.0, fColumn2 = 0.0]: number[] = samp.callNative(
    "GetMenuColumnWidth",
    "iFF",
    menuid
  );
  return { fColumn1, fColumn2 };
};

export const GetMenuColumnHeader = (menuid: number, column: number): string => {
  return samp.callNative("GetMenuColumnHeader", "iiSi", menuid, column, 31);
};

export const GetMenuItem = (
  menuid: number,
  column: number,
  itemid: number
): string => {
  return samp.callNative("GetMenuItem", "iiiSi", menuid, column, itemid, 31);
};
