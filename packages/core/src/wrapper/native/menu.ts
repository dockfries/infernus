export const IsMenuDisabled = (menuId: number): boolean => {
  return !!samp.callNative("IsMenuDisabled", "i", menuId);
};

export const IsMenuRowDisabled = (menuId: number, row: number): boolean => {
  return !!samp.callNative("IsMenuRowDisabled", "ii", menuId, row);
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
  return { fX, fY, ret: !!ret };
};

export const GetMenuColumnWidth = (menuId: number) => {
  const [fColumn1 = 0.0, fColumn2 = 0.0, ret]: [number, number, number] =
    samp.callNative("GetMenuColumnWidth", "iFF", menuId);
  return { fColumn1, fColumn2, ret: !!ret };
};

export const DestroyMenu = (menuId: number): boolean => {
  return !!samp.callNative("DestroyMenu", "i", menuId);
};

export const ShowMenuForPlayer = (
  menuId: number,
  playerId: number,
): boolean => {
  return !!samp.callNative("ShowMenuForPlayer", "ii", menuId, playerId);
};

export const HideMenuForPlayer = (
  menuId: number,
  playerId: number,
): boolean => {
  return !!samp.callNative("HideMenuForPlayer", "ii", menuId, playerId);
};

export const IsValidMenu = (menuId: number): boolean => {
  return !!samp.callNative("IsValidMenu", "i", menuId);
};

export const DisableMenu = (menuId: number): boolean => {
  return !!samp.callNative("DisableMenu", "i", menuId);
};

export const DisableMenuRow = (menuId: number, row: number): boolean => {
  return !!samp.callNative("DisableMenuRow", "ii", menuId, row);
};

export const GetPlayerMenu = (playerId: number): number => {
  return samp.callNative("GetPlayerMenu", "i", playerId);
};
