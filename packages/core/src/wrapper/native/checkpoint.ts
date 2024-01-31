export const SetPlayerCheckpoint = (
  playerId: number,
  x: number,
  y: number,
  z: number,
  size: number
): number => {
  return samp.callNative(
    "SetPlayerCheckpoint",
    "iffff",
    playerId,
    x,
    y,
    z,
    size
  );
};

export const DisablePlayerCheckpoint = (playerId: number): number => {
  return samp.callNative("DisablePlayerCheckpoint", "i", playerId);
};

export const SetPlayerRaceCheckpoint = (
  playerId: number,
  type: number,
  x: number,
  y: number,
  z: number,
  nextX: number,
  nextY: number,
  nextZ: number,
  size: number
): number => {
  return samp.callNative(
    "SetPlayerRaceCheckpoint",
    "iifffffff",
    playerId,
    type,
    x,
    y,
    z,
    nextX,
    nextY,
    nextZ,
    size
  );
};

export const DisablePlayerRaceCheckpoint = (playerId: number): number => {
  return samp.callNative("DisablePlayerRaceCheckpoint", "i", playerId);
};

export const IsPlayerInCheckpoint = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInCheckpoint", "i", playerId));
};

export const IsPlayerInRaceCheckpoint = (playerId: number): boolean => {
  return Boolean(samp.callNative("IsPlayerInRaceCheckpoint", "i", playerId));
};
