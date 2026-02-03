export const AddCharModel = (
  baseId: number,
  newid: number,
  dff: string,
  textureLibrary: string,
) => {
  return !!samp.callNative(
    "AddCharModel",
    "iiss",
    baseId,
    newid,
    dff,
    textureLibrary,
  );
};

export const AddSimpleModel = (
  virtualWorld: number,
  baseId: number,
  newId: number,
  dffName: string,
  txdName: string,
): boolean => {
  return !!samp.callNative(
    "AddSimpleModel",
    "iiiss",
    virtualWorld,
    baseId,
    newId,
    dffName,
    txdName,
  );
};

export const AddSimpleModelTimed = (
  virtualWorld: number,
  baseId: number,
  newId: number,
  dffName: string,
  txdName: string,
  timeOn: number,
  timeOff: number,
): boolean => {
  return !!samp.callNative(
    "AddSimpleModelTimed",
    "iiissii",
    virtualWorld,
    baseId,
    newId,
    dffName,
    txdName,
    timeOn,
    timeOff,
  );
};

export const RedirectDownload = (playerId: number, url: string): boolean => {
  return !!samp.callNative("RedirectDownload", "is", playerId, url);
};

export const GetCustomModelPath = (modelId: number) => {
  const [dffPath, txdPath, ret]: [number, number, number] = samp.callNative(
    "GetCustomModelPath",
    "iSiSi",
    modelId,
    255,
    255,
  );
  return {
    dffPath,
    txdPath,
    ret: !!ret,
  };
};

export const FindModelFileNameFromCRC = (crc: number) => {
  const [name, ret] = samp.callNative(
    "FindModelFileNameFromCRC",
    "iSi",
    crc,
    255,
  ) as [string, number];
  return { name, ret };
};

export const FindTextureFileNameFromCRC = (crc: number) => {
  const [name, ret] = samp.callNative(
    "FindTextureFileNameFromCRC",
    "iSi",
    crc,
    255,
  ) as [string, number];
  return { name, ret };
};

export const IsValidCustomModel = (modelId: number): boolean => {
  return !!samp.callNative("IsValidCustomModel", "i", modelId);
};

export const GetPlayerCustomSkin = (playerId: number): number => {
  return samp.callNative("GetPlayerCustomSkin", "i", playerId);
};

export const SetModelDownloadAtConnect = (toggle: boolean): boolean => {
  return !!samp.callNative("SetModelDownloadAtConnect", "i", toggle);
};

export const StartDownloadForPlayer = (playerId: number): boolean => {
  return !!samp.callNative("StartDownloadForPlayer", "i", playerId);
};
