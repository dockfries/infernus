export const IsMenuDisabled = (menuId: number): boolean => {
  return Boolean(samp.callNative("IsMenuDisabled", "i", menuId));
};

export const IsMenuRowDisabled = (menuId: number, row: number): boolean => {
  return Boolean(samp.callNative("IsMenuRowDisabled", "ii", menuId, row));
};

export const GetMenuColumns = (menuId: number): number => {
  return samp.callNative("GetMenuColumns", "i", menuId);
};

export const GetMenuItems = (menuId: number, column: number): number => {
  return samp.callNative("GetMenuItems", "ii", menuId, column);
};

export const GetMenuPos = (menuId: number) => {
  const [fX = 0.0, fY = 0.0]: number[] = samp.callNative(
    "GetMenuPos",
    "iFF",
    menuId
  );
  return { fX, fY };
};

export const GetMenuColumnWidth = (menuId: number) => {
  const [fColumn1 = 0.0, fColumn2 = 0.0]: number[] = samp.callNative(
    "GetMenuColumnWidth",
    "iFF",
    menuId
  );
  return { fColumn1, fColumn2 };
};

export const GetMenuColumnHeader = (menuId: number, column: number): string => {
  return samp.callNative("GetMenuColumnHeader", "iiSi", menuId, column, 31);
};

export const GetMenuItem = (
  menuId: number,
  column: number,
  itemId: number
): string => {
  return samp.callNative("GetMenuItem", "iiiSi", menuId, column, itemId, 31);
};
