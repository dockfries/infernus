export enum CefInitReasonEnum {
  OK,
  TIMEOUT,
  VERSION_MISMATCH,
  IP_MISMATCH,
  HANDSHAKE_FAILED,
  UNKNOWN,
}

export enum CefCreateStatusEnum {
  SUCCESS,
  ERROR_GENERIC,
  ERROR_ID_ALREADY_IN_USE,
}

export enum CefAudioModeEnum {
  WORLD,
  UI,
}

export enum CefHudComponentEnum {
  ALL,
  AMMO,
  ARMOUR,
  BREATH,
  CROSSHAIR,
  HEALTH,
  MONEY,
  RADAR,
  WANTED_STARS,
  WEAPON,
}
