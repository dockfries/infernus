import {
  Checkpoint,
  GameMode,
  InvalidEnum,
  LimitsEnum,
  Player,
  PlayerStateEnum,
  RaceCheckpoint,
  TextDraw,
  TextDrawAlignEnum,
  Vehicle,
} from "@infernus/core";
import {
  orig_AddPlayerClass,
  orig_AddPlayerClassEx,
  orig_AddStaticVehicle,
  orig_AddStaticVehicleEx,
  orig_CreatePlayerTextDraw,
  orig_CreateVehicle,
  orig_DestroyVehicle,
  orig_EditPlayerClass,
  orig_IsPlayerInCheckpoint,
  orig_IsPlayerInRaceCheckpoint,
  orig_IsPlayerTextDrawVisible,
  orig_IsValidPlayerTextDraw,
  orig_playerMethods,
  orig_PlayerTextDrawAlignment,
  orig_PlayerTextDrawBackgroundColor,
  orig_PlayerTextDrawBoxColor,
  orig_PlayerTextDrawColor,
  orig_PlayerTextDrawDestroy,
  orig_PlayerTextDrawFont,
  orig_PlayerTextDrawGetAlignment,
  orig_PlayerTextDrawGetBackgroundCol,
  orig_PlayerTextDrawGetBoxColor,
  orig_PlayerTextDrawGetColor,
  orig_PlayerTextDrawGetFont,
  orig_PlayerTextDrawGetLetterSize,
  orig_PlayerTextDrawGetOutline,
  orig_PlayerTextDrawGetPos,
  orig_PlayerTextDrawGetPreviewModel,
  orig_PlayerTextDrawGetPreviewRot,
  orig_PlayerTextDrawGetPreviewVehCol,
  orig_PlayerTextDrawGetShadow,
  orig_PlayerTextDrawGetString,
  orig_PlayerTextDrawGetTextSize,
  orig_PlayerTextDrawHide,
  orig_PlayerTextDrawIsBox,
  orig_PlayerTextDrawIsProportional,
  orig_PlayerTextDrawIsSelectable,
  orig_PlayerTextDrawLetterSize,
  orig_PlayerTextDrawSetOutline,
  orig_PlayerTextDrawSetPos,
  orig_PlayerTextDrawSetPreviewModel,
  orig_PlayerTextDrawSetPreviewRot,
  orig_PlayerTextDrawSetPreviewVehCol,
  orig_PlayerTextDrawSetProportional,
  orig_PlayerTextDrawSetSelectable,
  orig_PlayerTextDrawSetShadow,
  orig_PlayerTextDrawSetString,
  orig_PlayerTextDrawShow,
  orig_PlayerTextDrawTextSize,
  orig_PlayerTextDrawUseBox,
  setPlayerHook,
} from "./origin";
import {
  classSpawnInfo,
  deathTimer,
  delayedDeathTimer,
  internalPlayerTextDraw,
  isDying,
  lastStopTick,
  lastVehicleShooter,
  playerArmour,
  playerClass,
  playerHealth,
  playerMaxArmour,
  playerMaxHealth,
  playerSpawnInfo,
  playerTeam,
  restorePlayerTeleport,
  spawnInfoModified,
  spectating,
  vehicleAlive,
  vehicleRespawnTimer,
  vendingUseTimer,
  world,
} from "../struct";
import { WC_WeaponEnum } from "../enums";
import { innerWeaponConfig } from "../config";
import { wc_IsPlayerSpawned } from "../functions/public/is";
import { inflictDamage } from "../functions/internal/damage";
import { updateHealthBar } from "../functions/internal/set";

export * from "./weapon";

export const wc_SpawnPlayer = setPlayerHook("spawn", function () {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS || isDying.get(this.id)) {
    return false;
  }
  if (playerHealth.get(this.id) === 0.0) {
    playerHealth.set(this.id, playerMaxHealth.get(this.id));
  }
  orig_playerMethods.spawn.call(this);
  return true;
});

export const wc_GetPlayerState = setPlayerHook("getState", function () {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return PlayerStateEnum.NONE;
  }
  if (isDying.get(this.id)) {
    return PlayerStateEnum.WASTED;
  }
  return orig_playerMethods.getState.call(this);
});

export const wc_GetPlayerHealth = setPlayerHook("getHealth", function () {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return { health: 0.0, ret: false };
  }
  return { health: playerHealth.get(this.id), ret: true };
});

export function wcc_setPlayerHealth(player: Player, health: number, armour = -1.0) {
  if (player.id < 0 || player.id >= LimitsEnum.MAX_PLAYERS) {
    return false;
  }
  if (health <= 0.0) {
    playerArmour.set(player.id, 0.0);
    playerHealth.set(player.id, 0.0);
    if (player.isNpc()) {
      updateHealthBar(player, true);
    } else {
      inflictDamage(player, 0.0);
    }
  } else {
    if (armour !== -1.0) {
      if (armour > playerMaxArmour.get(player.id)) {
        armour = playerMaxArmour.get(player.id);
      }
      playerArmour.set(player.id, armour);
    }
    if (health > playerMaxHealth.get(player.id)) {
      health = playerMaxHealth.get(player.id);
    }
    playerHealth.set(player.id, health);
    updateHealthBar(player, true);
  }
  return true;
}

export const wc_SetPlayerHealth = setPlayerHook("setHealth", function (health: number) {
  return wcc_setPlayerHealth(this, health);
});

export const wc_GetPlayerArmour = setPlayerHook("getArmour", function () {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return { armour: 0.0, ret: false };
  }
  return { armour: playerArmour.get(this.id), ret: true };
});

export const wc_SetPlayerArmour = setPlayerHook("setArmour", function (armour: number) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return false;
  }
  if (armour > playerMaxArmour.get(this.id)) {
    armour = playerMaxArmour.get(this.id);
  }
  playerArmour.set(this.id, armour);
  updateHealthBar(this, true);
  return true;
});

export const wc_GetPlayerTeam = setPlayerHook("getTeam", function () {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return InvalidEnum.NO_TEAM;
  }
  if (!this.isConnected()) {
    return InvalidEnum.NO_TEAM;
  }
  return playerTeam.get(this.id);
});

export const wc_SetPlayerTeam = setPlayerHook("setTeam", function (team: number) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return 0;
  }
  playerTeam.set(this.id, team);
  orig_playerMethods.setTeam.call(this, team);
  return 1;
});

export const wc_SendDeathMessage = setPlayerHook(
  "sendDeathMessage",
  function (killer: Player | InvalidEnum.PLAYER_ID, weapon: number) {
    switch (weapon) {
      case WC_WeaponEnum.VEHICLE_M4: {
        weapon = WC_WeaponEnum.M4;
        break;
      }
      case WC_WeaponEnum.VEHICLE_MINIGUN: {
        weapon = WC_WeaponEnum.MINIGUN;
        break;
      }
      case WC_WeaponEnum.VEHICLE_ROCKETLAUNCHER: {
        weapon = WC_WeaponEnum.ROCKETLAUNCHER;
        break;
      }
      case WC_WeaponEnum.PISTOLWHIP: {
        weapon = WC_WeaponEnum.UNARMED;
        break;
      }
      case WC_WeaponEnum.CARPARK: {
        weapon = WC_WeaponEnum.REASON_VEHICLE;
        break;
      }
      case WC_WeaponEnum.UNKNOWN: {
        weapon = WC_WeaponEnum.REASON_DROWN;
        break;
      }
    }
    orig_playerMethods.sendDeathMessage.call(this, killer, weapon);
    return true;
  },
);

export const wc_ApplyAnimation = setPlayerHook("applyAnimation", function (...args) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS || isDying.get(this.id)) {
    return false;
  }
  return orig_playerMethods.applyAnimation.call(this, ...args);
});

export const wc_ClearAnimations = setPlayerHook("clearAnimations", function (...args) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS || isDying.get(this.id)) {
    return false;
  }
  lastStopTick.set(this.id, Date.now());
  return orig_playerMethods.clearAnimations.call(this, ...args);
});

export const wc_AddPlayerClass = function (
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  weapon1: number,
  weapon1Ammo: number,
  weapon2: number,
  weapon2Ammo: number,
  weapon3: number,
  weapon3Ammo: number,
) {
  const classId = orig_AddPlayerClass(
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  );
  if (classId >= 0 && classId < innerWeaponConfig.MAX_CLASSES) {
    classSpawnInfo.get(classId).skin = modelId;
    classSpawnInfo.get(classId).team = 0x7fffffff;
    classSpawnInfo.get(classId).posX = spawnX;
    classSpawnInfo.get(classId).posY = spawnY;
    classSpawnInfo.get(classId).posZ = spawnZ;
    classSpawnInfo.get(classId).rot = zAngle;
    classSpawnInfo.get(classId).weapon1 = weapon1;
    classSpawnInfo.get(classId).ammo1 = weapon1Ammo;
    classSpawnInfo.get(classId).weapon2 = weapon2;
    classSpawnInfo.get(classId).ammo2 = weapon2Ammo;
    classSpawnInfo.get(classId).weapon3 = weapon3;
    classSpawnInfo.get(classId).ammo3 = weapon3Ammo;
  }
  return classId;
};

GameMode.addPlayerClass = wc_AddPlayerClass;

export const wc_AddPlayerClassEx = function (
  teamId: number,
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  weapon1: number,
  weapon1Ammo: number,
  weapon2: number,
  weapon2Ammo: number,
  weapon3: number,
  weapon3Ammo: number,
) {
  const classId = orig_AddPlayerClassEx(
    teamId,
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  );

  if (classId >= 0 && classId < innerWeaponConfig.MAX_CLASSES) {
    classSpawnInfo.get(classId).skin = modelId;
    classSpawnInfo.get(classId).team = teamId;
    classSpawnInfo.get(classId).posX = spawnX;
    classSpawnInfo.get(classId).posY = spawnY;
    classSpawnInfo.get(classId).posZ = spawnZ;
    classSpawnInfo.get(classId).rot = zAngle;
    classSpawnInfo.get(classId).weapon1 = weapon1;
    classSpawnInfo.get(classId).ammo1 = weapon1Ammo;
    classSpawnInfo.get(classId).weapon2 = weapon2;
    classSpawnInfo.get(classId).ammo2 = weapon2Ammo;
    classSpawnInfo.get(classId).weapon3 = weapon3;
    classSpawnInfo.get(classId).ammo3 = weapon3Ammo;
  }
  return classId;
};

export const wc_SetSpawnInfo = setPlayerHook(
  "setSpawnInfo",
  function (
    team: number,
    skin: number,
    x: number,
    y: number,
    z: number,
    rotation: number,
    weapon1: number,
    weapon1Ammo: number,
    weapon2: number,
    weapon2Ammo: number,
    weapon3: number,
    weapon3Ammo: number,
  ) {
    if (
      orig_playerMethods.setSpawnInfo.call(
        this,
        team,
        skin,
        x,
        y,
        z,
        rotation,
        weapon1,
        weapon1Ammo,
        weapon2,
        weapon2Ammo,
        weapon3,
        weapon3Ammo,
      )
    ) {
      playerClass.set(this.id, -1);
      spawnInfoModified.set(this.id, false);
      playerSpawnInfo.get(this.id).skin = skin;
      playerSpawnInfo.get(this.id).team = team;
      playerSpawnInfo.get(this.id).posX = x;
      playerSpawnInfo.get(this.id).posY = y;
      playerSpawnInfo.get(this.id).posZ = z;
      playerSpawnInfo.get(this.id).rot = rotation;
      playerSpawnInfo.get(this.id).weapon1 = weapon1;
      playerSpawnInfo.get(this.id).ammo1 = weapon1Ammo;
      playerSpawnInfo.get(this.id).weapon2 = weapon2;
      playerSpawnInfo.get(this.id).ammo2 = weapon2Ammo;
      playerSpawnInfo.get(this.id).weapon3 = weapon3;
      playerSpawnInfo.get(this.id).ammo3 = weapon3Ammo;
      return true;
    }
    return false;
  },
);

export const wc_TogglePlayerSpectating = setPlayerHook("toggleSpectating", function (toggle) {
  if (orig_playerMethods.toggleSpectating.call(this, toggle)) {
    if (toggle) {
      if (delayedDeathTimer.get(this.id)) {
        clearTimeout(delayedDeathTimer.get(this.id)!);
        delayedDeathTimer.set(this.id, null);
      }

      if (deathTimer.get(this.id)) {
        clearTimeout(deathTimer.get(this.id)!);
        deathTimer.set(this.id, null);
      }

      if (innerWeaponConfig.CUSTOM_VENDING_MACHINES)
        if (vendingUseTimer.get(this.id)) {
          clearTimeout(vendingUseTimer.get(this.id)!);
          vendingUseTimer.set(this.id, null);
        }
    }

    isDying.set(this.id, false);

    if (restorePlayerTeleport.get(this.id)) {
      restorePlayerTeleport.set(this.id, false);
      orig_playerMethods.allowTeleport.call(this, true);
    }
    return true;
  }
  return false;
});

export const wc_TogglePlayerControllable = setPlayerHook("toggleControllable", function (toggle) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS || isDying.get(this.id)) {
    return false;
  }
  lastStopTick.set(this.id, Date.now());
  return orig_playerMethods.toggleControllable.call(this, toggle);
});

export const wc_SetPlayerPos = setPlayerHook("setPos", function (x, y, z) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS || isDying.get(this.id)) {
    return false;
  }
  lastStopTick.set(this.id, Date.now());
  return orig_playerMethods.setPos.call(this, x, y, z);
});

export const wc_SetPlayerPosFindZ = setPlayerHook("setPosFindZ", function (x, y, z) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS || isDying.get(this.id)) {
    return false;
  }
  lastStopTick.set(this.id, Date.now());
  return orig_playerMethods.setPosFindZ.call(this, x, y, z);
});

export const wc_SetPlayerVelocity = setPlayerHook("setVelocity", function (x, y, z) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS || isDying.get(this.id)) {
    return false;
  }

  if (x === 0.0 && y === 0.0 && z === 0.0) {
    lastStopTick.set(this.id, Date.now());
  }

  return orig_playerMethods.setVelocity.call(this, x, y, z);
});

export const wc_SetPlayerVirtualWorld = setPlayerHook("setVirtualWorld", function (worldId) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return false;
  }
  world.set(this.id, worldId);
  if (isDying.get(this.id)) {
    return true;
  }
  return orig_playerMethods.setVirtualWorld.call(this, worldId);
});

export const wc_GetPlayerVirtualWorld = setPlayerHook("getVirtualWorld", function () {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return 0;
  }
  const worldId = orig_playerMethods.getVirtualWorld.call(this);
  if (worldId === innerWeaponConfig.DEATH_WORLD) {
    return world.get(this.id);
  }
  return worldId;
});

export const wc_PlayerSpectatePlayer = setPlayerHook(
  "spectatePlayer",
  function (targetPlayer, mode) {
    if (orig_playerMethods.spectatePlayer.call(this, targetPlayer, mode)) {
      spectating.set(this.id, targetPlayer.id);
      return true;
    }
    return false;
  },
);

export function wc_DestroyVehicle(vehicleId: number) {
  if (orig_DestroyVehicle(vehicleId)) {
    lastVehicleShooter.set(vehicleId, InvalidEnum.PLAYER_ID);
    vehicleAlive.set(vehicleId, false);
    if (vehicleRespawnTimer.get(vehicleId)) {
      clearTimeout(vehicleRespawnTimer.get(vehicleId)!);
      vehicleRespawnTimer.set(vehicleId, null);
    }
    return true;
  }
  return false;
}

Vehicle.__inject__.destroy = wc_DestroyVehicle;

export function wc_CreateVehicle(
  vehicleType: number,
  x: number,
  y: number,
  z: number,
  rotation: number,
  color1: string | number,
  color2: string | number,
  respawnDelay: number,
  addSiren: boolean,
) {
  const id = orig_CreateVehicle(
    vehicleType,
    x,
    y,
    z,
    rotation,
    color1,
    color2,
    respawnDelay,
    addSiren,
  );

  if (id > 0 && id < LimitsEnum.MAX_VEHICLES) {
    vehicleAlive.set(id, true);
  }

  return id;
}

Vehicle.__inject__.create = wc_CreateVehicle;

export function wc_AddStaticVehicle(
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  color1: string | number,
  color2: string | number,
) {
  const id = orig_AddStaticVehicle(modelId, spawnX, spawnY, spawnZ, zAngle, color1, color2);
  if (id > 0 && id < LimitsEnum.MAX_VEHICLES) {
    vehicleAlive.set(id, true);
  }
  return id;
}

Vehicle.__inject__.addStatic = wc_AddStaticVehicle;

export function wc_AddStaticVehicleEx(
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  color1: string | number,
  color2: string | number,
  respawnDelay: number,
  addSiren: boolean,
) {
  const id = orig_AddStaticVehicleEx(
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    color1,
    color2,
    respawnDelay,
    addSiren,
  );
  if (id > 0 && id < LimitsEnum.MAX_VEHICLES) {
    vehicleAlive.set(id, true);
  }
  return id;
}

Vehicle.__inject__.addStaticEx = wc_AddStaticVehicleEx;

export function wc_IsPlayerInCheckpoint(player: Player) {
  if (!wc_IsPlayerSpawned(player)) {
    return false;
  }
  return orig_IsPlayerInCheckpoint(player);
}

Checkpoint.isPlayerIn = wc_IsPlayerInCheckpoint;

export function wc_IsPlayerInRaceCheckpoint(player: Player) {
  if (!wc_IsPlayerSpawned(player)) {
    return false;
  }
  return orig_IsPlayerInRaceCheckpoint(player);
}

RaceCheckpoint.isPlayerIn = wc_IsPlayerInRaceCheckpoint;

export const wc_SetPlayerSpecialAction = setPlayerHook("setSpecialAction", function (actionId) {
  if (!wc_IsPlayerSpawned(this)) {
    return false;
  }
  return orig_playerMethods.setSpecialAction.call(this, actionId);
});

export function wc_CreatePlayerTextDraw(playerId: number, x: number, y: number, text: number[]) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return InvalidEnum.TEXT_DRAW;
  const td = orig_CreatePlayerTextDraw(playerId, x, y, text);
  if (td !== InvalidEnum.TEXT_DRAW) {
    internalPlayerTextDraw.get(playerId)[td] = false;
  }
  return td;
}

TextDraw.__inject__.createPlayer = wc_CreatePlayerTextDraw;

export function wc_PlayerTextDrawDestroy(playerId: number, text: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawDestroy(playerId, text);
}

TextDraw.__inject__.destroyPlayer = wc_PlayerTextDrawDestroy;

export function wc_PlayerTextDrawLetterSize(playerId: number, text: number, x: number, y: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawLetterSize(playerId, text, x, y);
}

TextDraw.__inject__.setLetterSizePlayer = wc_PlayerTextDrawLetterSize;

export function wc_PlayerTextDrawTextSize(playerId: number, text: number, x: number, y: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawTextSize(playerId, text, x, y);
}

TextDraw.__inject__.setTextSizePlayer = wc_PlayerTextDrawTextSize;

export function wc_PlayerTextDrawAlignment(
  playerId: number,
  text: number,
  alignment: TextDrawAlignEnum,
) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawAlignment(playerId, text, alignment);
}

TextDraw.__inject__.setAlignmentPlayer = wc_PlayerTextDrawAlignment;

export function wc_PlayerTextDrawColor(playerId: number, text: number, color: string | number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawColor(playerId, text, color);
}

TextDraw.__inject__.setColorPlayer = wc_PlayerTextDrawColor;

export function wc_PlayerTextDrawUseBox(playerId: number, text: number, use: boolean) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawUseBox(playerId, text, use);
}

TextDraw.__inject__.useBoxPlayer = wc_PlayerTextDrawUseBox;

export function wc_PlayerTextDrawBoxColor(playerId: number, text: number, color: string | number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawBoxColor(playerId, text, color);
}

TextDraw.__inject__.setBoxColorPlayer = wc_PlayerTextDrawBoxColor;

export function wc_PlayerTextDrawSetShadow(playerId: number, text: number, size: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawSetShadow(playerId, text, size);
}

TextDraw.__inject__.setShadowPlayer = wc_PlayerTextDrawSetShadow;

export function wc_PlayerTextDrawSetOutline(playerId: number, text: number, size: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawSetOutline(playerId, text, size);
}

TextDraw.__inject__.setOutlinePlayer = wc_PlayerTextDrawSetOutline;

export function wc_PlayerTextDrawBackgroundColor(
  playerId: number,
  text: number,
  color: string | number,
) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawBackgroundColor(playerId, text, color);
}

TextDraw.__inject__.setBackgroundColorPlayer = wc_PlayerTextDrawBackgroundColor;

export function wc_PlayerTextDrawFont(playerId: number, text: number, font: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawFont(playerId, text, font);
}

TextDraw.__inject__.setFontPlayer = wc_PlayerTextDrawFont;

export function wc_PlayerTextDrawSetProportional(playerId: number, text: number, set: boolean) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawSetProportional(playerId, text, set);
}

TextDraw.__inject__.setProportionalPlayer = wc_PlayerTextDrawSetProportional;

export function wc_PlayerTextDrawSetSelectable(playerId: number, text: number, set: boolean) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawSetSelectable(playerId, text, set);
}

TextDraw.__inject__.setSelectablePlayer = wc_PlayerTextDrawSetSelectable;

export function wc_PlayerTextDrawShow(playerId: number, text: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawShow(playerId, text);
}

TextDraw.__inject__.showPlayer = wc_PlayerTextDrawShow;

export function wc_PlayerTextDrawHide(playerId: number, text: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawHide(playerId, text);
}

TextDraw.__inject__.hidePlayer = wc_PlayerTextDrawHide;

export function wc_PlayerTextDrawSetString(playerId: number, text: number, string: number[]) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawSetString(playerId, text, string);
}

TextDraw.__inject__.setStringPlayer = wc_PlayerTextDrawSetString;

export function wc_PlayerTextDrawSetPreviewMode(
  playerId: number,
  text: number,
  modelIndex: number,
) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawSetPreviewModel(playerId, text, modelIndex);
}

TextDraw.__inject__.setPreviewModelPlayer = wc_PlayerTextDrawSetPreviewMode;

export function wc_PlayerTextDrawSetPreviewRot(
  playerId: number,
  text: number,
  fRotX: number,
  fRotY: number,
  fRotZ: number,
  fZoom: number,
) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawSetPreviewRot(playerId, text, fRotX, fRotY, fRotZ, fZoom);
}

TextDraw.__inject__.setPreviewRotPlayer = wc_PlayerTextDrawSetPreviewRot;

export function wc_PlayerTextDrawSetPreviewVehC(
  playerId: number,
  text: number,
  color1: string | number,
  color2: string | number,
) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    text < 0 ||
    text >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[text]
  )
    return false;
  return orig_PlayerTextDrawSetPreviewVehCol(playerId, text, color1, color2);
}

TextDraw.__inject__.setPreviewVehicleColorsPlayer = wc_PlayerTextDrawSetPreviewVehC;

export const wc_AllowPlayerTeleport = setPlayerHook("allowTeleport", function (allow) {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) {
    return false;
  }
  if (isDying.get(this.id)) {
    restorePlayerTeleport.set(this.id, allow);
    return true;
  }
  return orig_playerMethods.allowTeleport.call(this, allow);
});

export const wc_IsPlayerTeleportAllowed = setPlayerHook("isTeleportAllowed", function () {
  if (this.id < 0 || this.id >= LimitsEnum.MAX_PLAYERS) return false;
  if (restorePlayerTeleport.get(this.id)) return true;
  return orig_playerMethods.isTeleportAllowed.call(this);
});

export function wc_IsValidPlayerTextDraw(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return false;
  return orig_IsValidPlayerTextDraw(playerId, textId);
}

TextDraw.__inject__.isValidPlayer = wc_IsValidPlayerTextDraw;

export function wc_IsPlayerTextDrawVisible(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return false;
  return orig_IsPlayerTextDrawVisible(playerId, textId);
}

TextDraw.__inject__.isVisiblePlayer = wc_IsPlayerTextDrawVisible;

export function wc_PlayerTextDrawGetString(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return { str: "", ret: false };
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return { str: "", ret: false };
  return orig_PlayerTextDrawGetString(playerId, textId);
}

TextDraw.__inject__.getStringPlayer = wc_PlayerTextDrawGetString;

export function wc_PlayerTextDrawSetPos(playerId: number, textId: number, x: number, y: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return false;
  return orig_PlayerTextDrawSetPos(playerId, textId, x, y);
}

TextDraw.__inject__.setPosPlayer = wc_PlayerTextDrawSetPos;

export function wc_PlayerTextDrawGetLetterSize(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return { fX: 0, fY: 0, ret: false };
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return { fX: 0, fY: 0, ret: false };
  return orig_PlayerTextDrawGetLetterSize(playerId, textId);
}

TextDraw.__inject__.getLetterSizePlayer = wc_PlayerTextDrawGetLetterSize;

export function wc_PlayerTextDrawGetTextSize(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return { fX: 0, fY: 0, ret: false };
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return { fX: 0, fY: 0, ret: false };
  return orig_PlayerTextDrawGetTextSize(playerId, textId);
}

TextDraw.__inject__.getTextSizePlayer = wc_PlayerTextDrawGetTextSize;

export function wc_PlayerTextDrawGetPos(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return { fX: 0, fY: 0, ret: false };
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return { fX: 0, fY: 0, ret: false };
  return orig_PlayerTextDrawGetPos(playerId, textId);
}

TextDraw.__inject__.getPosPlayer = wc_PlayerTextDrawGetPos;

export function wc_PlayerTextDrawGetColor(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return 0;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return 0;
  return orig_PlayerTextDrawGetColor(playerId, textId);
}

TextDraw.__inject__.getColorPlayer = wc_PlayerTextDrawGetColor;

export function wc_PlayerTextDrawGetBoxColor(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return 0;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return 0;
  return orig_PlayerTextDrawGetBoxColor(playerId, textId);
}

TextDraw.__inject__.getBoxColorPlayer = wc_PlayerTextDrawGetBoxColor;

export function wc_PlayerTextDrawGetShadow(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return 0;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return 0;
  return orig_PlayerTextDrawGetShadow(playerId, textId);
}

TextDraw.__inject__.getShadowPlayer = wc_PlayerTextDrawGetShadow;

export function wc_PlayerTextDrawGetOutline(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return 0;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return 0;
  return orig_PlayerTextDrawGetOutline(playerId, textId);
}

TextDraw.__inject__.getOutlinePlayer = wc_PlayerTextDrawGetOutline;

export function wc_PlayerTextDrawGetFont(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return -1;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return -1;
  return orig_PlayerTextDrawGetFont(playerId, textId);
}

TextDraw.__inject__.getFontPlayer = wc_PlayerTextDrawGetFont;

export function wc_PlayerTextDrawIsBox(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return false;
  return orig_PlayerTextDrawIsBox(playerId, textId);
}

TextDraw.__inject__.isBoxPlayer = wc_PlayerTextDrawIsBox;

export function wc_PlayerTextDrawIsProportional(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return false;
  return orig_PlayerTextDrawIsProportional(playerId, textId);
}

TextDraw.__inject__.isProportionalPlayer = wc_PlayerTextDrawIsProportional;

export function wc_PlayerTextDrawIsSelectable(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return false;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return false;
  return orig_PlayerTextDrawIsSelectable(playerId, textId);
}

TextDraw.__inject__.isSelectablePlayer = wc_PlayerTextDrawIsSelectable;

export function wc_PlayerTextDrawGetAlignment(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return -1;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return -1;
  return orig_PlayerTextDrawGetAlignment(playerId, textId);
}

TextDraw.__inject__.getAlignmentPlayer = wc_PlayerTextDrawGetAlignment;

export function wc_PlayerTextDrawGetPreviewModel(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return 0;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return 0;
  return orig_PlayerTextDrawGetPreviewModel(playerId, textId);
}

TextDraw.__inject__.getPreviewModelPlayer = wc_PlayerTextDrawGetPreviewModel;

export function wc_PlayerTextDrawGetPreviewRot(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS)
    return {
      fRotX: 0,
      fRotY: 0,
      fRotZ: 0,
      fZoom: 0,
      ret: false,
    };
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return {
      fRotX: 0,
      fRotY: 0,
      fRotZ: 0,
      fZoom: 0,
      ret: false,
    };
  return orig_PlayerTextDrawGetPreviewRot(playerId, textId);
}

TextDraw.__inject__.getPreviewRotPlayer = wc_PlayerTextDrawGetPreviewRot;

export function wc_PlayerTextDrawGetBackgroundColor(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS) return 0;
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return 0;
  return orig_PlayerTextDrawGetBackgroundCol(playerId, textId);
}

TextDraw.__inject__.getBackgroundColorPlayer = wc_PlayerTextDrawGetBackgroundColor;

export function wc_PlayerTextDrawGetPreviewVehC(playerId: number, textId: number) {
  if (playerId < 0 || playerId >= LimitsEnum.MAX_PLAYERS)
    return { color1: 0, color2: 0, ret: false };
  if (
    textId < 0 ||
    textId >= LimitsEnum.MAX_PLAYER_TEXT_DRAWS ||
    internalPlayerTextDraw.get(playerId)[textId]
  )
    return { color1: 0, color2: 0, ret: false };
  return orig_PlayerTextDrawGetPreviewVehCol(playerId, textId);
}

TextDraw.__inject__.getPreviewVehicleColorsPlayer = wc_PlayerTextDrawGetPreviewVehC;

export function wc_EditPlayerClass(
  classId: number,
  teamId: number,
  skinId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  weapon1: number,
  weapon1Ammo: number,
  weapon2: number,
  weapon2Ammo: number,
  weapon3: number,
  weapon3Ammo: number,
) {
  if (
    orig_EditPlayerClass(
      classId,
      teamId,
      skinId,
      spawnX,
      spawnY,
      spawnZ,
      zAngle,
      weapon1,
      weapon1Ammo,
      weapon2,
      weapon2Ammo,
      weapon3,
      weapon3Ammo,
    )
  ) {
    classSpawnInfo.get(classId).skin = skinId;
    classSpawnInfo.get(classId).team = teamId;
    classSpawnInfo.get(classId).posX = spawnX;
    classSpawnInfo.get(classId).posY = spawnY;
    classSpawnInfo.get(classId).posZ = spawnZ;
    classSpawnInfo.get(classId).rot = zAngle;
    classSpawnInfo.get(classId).weapon1 = weapon1;
    classSpawnInfo.get(classId).ammo1 = weapon1Ammo;
    classSpawnInfo.get(classId).weapon2 = weapon2;
    classSpawnInfo.get(classId).ammo2 = weapon2Ammo;
    classSpawnInfo.get(classId).weapon3 = weapon3;
    classSpawnInfo.get(classId).ammo3 = weapon3Ammo;
    return true;
  }
  return false;
}

GameMode.editPlayerClass = wc_EditPlayerClass;
