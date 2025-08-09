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
  const [fX = 0.0, fY = 0.0, ret]: [number, number, number] = samp.callNative(
    "GetMenuPos",
    "iFF",
    menuId,
  );
  return { fX, fY, ret };
};

export const GetMenuColumnWidth = (menuId: number) => {
  const [fColumn1 = 0.0, fColumn2 = 0.0, ret]: [number, number, number] =
    samp.callNative("GetMenuColumnWidth", "iFF", menuId);
  return { fColumn1, fColumn2, ret };
};

export const GetMenuColumnHeader = (menuId: number, column: number) => {
  const [header, ret]: [string, number] = samp.callNative(
    "GetMenuColumnHeader",
    "iiSi",
    menuId,
    column,
    31,
  );
  return { header, ret };
};

export const GetMenuItem = (menuId: number, column: number, itemId: number) => {
  const [item, ret]: [string, number] = samp.callNative(
    "GetMenuItem",
    "iiiSi",
    menuId,
    column,
    itemId,
    31,
  );
  return { item, ret };
};

export const CreateMenu = (
  title: string,
  columns: number,
  x: number,
  y: number,
  col1width: number,
  col2width: number,
): number => {
  return samp.callNative(
    "CreateMenu",
    "siffff",
    title,
    columns,
    x,
    y,
    col1width,
    col2width,
  );
};

export const DestroyMenu = (menuId: number): number => {
  return samp.callNative("DestroyMenu", "i", menuId);
};

export const AddMenuItem = (
  menuId: number,
  column: number,
  menutext: string,
): number => {
  return samp.callNative("AddMenuItem", "iis", menuId, column, menutext);
};

export const SetMenuColumnHeader = (
  menuId: number,
  column: number,
  columnHeader: string,
): number => {
  return samp.callNative(
    "SetMenuColumnHeader",
    "iis",
    menuId,
    column,
    columnHeader,
  );
};

export const ShowMenuForPlayer = (menuId: number, playerId: number): number => {
  return samp.callNative("ShowMenuForPlayer", "ii", menuId, playerId);
};

export const HideMenuForPlayer = (menuId: number, playerId: number): number => {
  return samp.callNative("HideMenuForPlayer", "ii", menuId, playerId);
};

export const IsValidMenu = (menuId: number): boolean => {
  return Boolean(samp.callNative("IsValidMenu", "i", menuId));
};

export const DisableMenu = (menuId: number): number => {
  return samp.callNative("DisableMenu", "i", menuId);
};

export const DisableMenuRow = (menuId: number, row: number): number => {
  return samp.callNative("DisableMenuRow", "ii", menuId, row);
};

export const GetPlayerMenu = (playerId: number): number => {
  return samp.callNative("GetPlayerMenu", "i", playerId);
};
