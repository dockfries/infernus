import {
  Dialog,
  DynamicPickup,
  E_STREAMER,
  GameMode,
  IDialog,
  InvalidEnum,
  LimitsEnum,
  Player,
  PlayerStateEnum,
  SpecialActionsEnum,
  Streamer,
  StreamerItemTypes,
  Vehicle,
  VehicleParamsEnum,
} from "@infernus/core";
import {
  ac_ClassAmmo,
  ac_ClassPos,
  ac_ClassWeapon,
  ACInfo,
  ACVehInfo,
  ACVehInfoStruct,
} from "../struct";
import {
  ac_writeCfg,
  ac_writeNOPCfg,
  innerACConfig,
  innerGameModeConfig,
} from "../config";
import {
  orig_AddPlayerClass,
  orig_AddPlayerClassEx,
  orig_AddStaticVehicle,
  orig_AddStaticVehicleEx,
  orig_CreateDynamicPickup,
  orig_CreateDynamicPickupEx,
  orig_CreateVehicle,
  orig_DestroyDynamicPickup,
  orig_DestroyVehicle,
  orig_DisableInteriorEnterExits,
  orig_EnableStuntBonusForAll,
  orig_EnableVehicleFriendlyFire,
  orig_playerMethods,
  orig_ShowPlayerDialog,
  orig_StreamerUpdateEx,
  orig_UsePlayerPedAnims,
  orig_vehicleMethods,
  setPlayerHook,
  setVehicleHook,
} from "./origin";
import { ac_GetMaxPassengers, ac_GetSpeed } from "../functions/get";
import {
  ac_IsABusEx,
  ac_IsAmmoSharingInSlot,
  ac_IsARemoteControlEx,
  ac_IsValidWeapon,
  ac_IsVehicleSeatOccupied,
  ac_IsWeaponSlotWithAmmo,
} from "../functions/is";
import { ac_KickTimer } from "../functions/kick";
import { ac_ACAllow, ac_NOPAllow, ac_wModel, ac_wSlot } from "../constants";

export function ac_AddStaticVehicle(
  vehicleId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  z_angle: number,
) {
  const acVeh = new ACVehInfoStruct();
  acVeh.acInt =
    acVeh.acSpeed =
    acVeh.acTires =
    acVeh.acLights =
    acVeh.acDoors =
    acVeh.acPanels =
    acVeh.acLastSpeed =
    acVeh.acSpeedDiff =
      0;
  acVeh.acPaintJob = 3;
  acVeh.acHealth = 1000.0;
  acVeh.acSpawned = true;
  acVeh.acTrSpeed = -1;
  acVeh.acPosDiff = acVeh.acVelX = acVeh.acVelY = acVeh.acVelZ = 0.0;
  acVeh.acSpawnPosX = acVeh.acPosX = spawn_x;
  acVeh.acSpawnPosY = acVeh.acPosY = spawn_y;
  acVeh.acSpawnPosZ = acVeh.acPosZ = spawn_z;
  acVeh.acSpawnZAngle = acVeh.acZAngle = z_angle;
  acVeh.acDriver = InvalidEnum.PLAYER_ID;
  ACVehInfo.set(vehicleId, acVeh);
  return true;
}

export function ac_AddPlayerClass(
  classId: number,
  spawn_x: number,
  spawn_y: number,
  spawn_z: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number,
) {
  if (classId >= 0 && classId < innerACConfig.AC_MAX_CLASSES) {
    ac_ClassPos.set(classId, [spawn_x, spawn_y, spawn_z]);
    ac_ClassWeapon.set(classId, [weapon1, weapon2, weapon3]);
    ac_ClassAmmo.set(classId, [weapon1_ammo, weapon2_ammo, weapon3_ammo]);
  }
  return true;
}

export function ac_SetSpawnInfo(
  player: Player,
  team: number,
  skin: number,
  ac_x: number,
  ac_y: number,
  ac_z: number,
  rotation: number,
  weapon1: number,
  weapon1_ammo: number,
  weapon2: number,
  weapon2_ammo: number,
  weapon3: number,
  weapon3_ammo: number,
) {
  if (
    !player.setSpawnInfo(
      team,
      skin,
      ac_x,
      ac_y,
      ac_z,
      rotation,
      weapon1,
      weapon1_ammo,
      weapon2,
      weapon2_ammo,
      weapon3,
      weapon3_ammo,
    )
  )
    return false;
  ACInfo.get(player.id).acSpawnPosX = ac_x;
  ACInfo.get(player.id).acSpawnPosY = ac_y;
  ACInfo.get(player.id).acSpawnPosZ = ac_z;
  ACInfo.get(player.id).acSpawnWeapon1 = weapon1;
  ACInfo.get(player.id).acSpawnAmmo1 = weapon1_ammo;
  ACInfo.get(player.id).acSpawnWeapon2 = weapon2;
  ACInfo.get(player.id).acSpawnAmmo2 = weapon2_ammo;
  ACInfo.get(player.id).acSpawnWeapon3 = weapon3;
  ACInfo.get(player.id).acSpawnAmmo3 = weapon3_ammo;
  return true;
}

export function ac_CreateDynamicPickup(
  pickupId: number,
  modelId: number,
  type: number,
) {
  Streamer.setIntData(
    StreamerItemTypes.PICKUP,
    pickupId,
    E_STREAMER.EXTRA_ID,
    0,
  );
  if ((type >= 2 && type <= 5) || type === 15 || type === 22) {
    switch (modelId) {
      case 370: {
        Streamer.setIntData(
          StreamerItemTypes.PICKUP,
          pickupId,
          E_STREAMER.EXTRA_ID,
          1,
        );
        break;
      }
      case 1240: {
        Streamer.setIntData(
          StreamerItemTypes.PICKUP,
          pickupId,
          E_STREAMER.EXTRA_ID,
          2,
        );
        break;
      }
      case 1242: {
        Streamer.setIntData(
          StreamerItemTypes.PICKUP,
          pickupId,
          E_STREAMER.EXTRA_ID,
          3,
        );
        break;
      }
      default:
        {
          if (
            (modelId >= 321 && modelId <= 326) ||
            modelId === 331 ||
            (modelId >= 333 && modelId <= 339) ||
            (modelId >= 341 && modelId <= 353) ||
            (modelId >= 355 && modelId <= 369) ||
            modelId === 371 ||
            modelId === 372
          )
            for (let ac_i = 46; ac_i >= 1; --ac_i) {
              if (ac_wModel[ac_i] !== modelId) continue;
              Streamer.setIntData(
                StreamerItemTypes.PICKUP,
                pickupId,
                E_STREAMER.EXTRA_ID,
                ac_i + 100,
              );
              break;
            }
        }
        break;
    }
  }
  return true;
}

export const ac_GetPlayerVersion = setPlayerHook("getIp", function () {
  const ip = orig_playerMethods.getIp.call(this);
  return ip.replaceAll("%", "").replaceAll("~k~", "");
});

export function ac_DestroyVehicle(vehicleId: number) {
  const ac_model_veh = Vehicle.getInstance(vehicleId);
  const ac_model = ac_model_veh
    ? orig_vehicleMethods.getModel.call(ac_model_veh)
    : 0;
  if (ac_model > 0) {
    const ac_gtc = Date.now() + 2650;
    ACVehInfo.get(vehicleId).acSpawned = false;
    Player.getInstances().forEach((ac_i) => {
      if (ACInfo.get(ac_i.id).acSet[8] === vehicleId)
        ACInfo.get(ac_i.id).acSet[8] = -1;
      if (ACInfo.get(ac_i.id).acVeh === vehicleId) {
        ACInfo.get(ac_i.id).acSetPosTick = ACInfo.get(ac_i.id).acGtc[10] =
          ac_gtc;
        ACInfo.get(ac_i.id).acLastModel = ac_model;
      }
    });
  }
  return orig_DestroyVehicle(vehicleId);
}

export function ac_DestroyDynamicPickup(pickupId: number) {
  if (!orig_DestroyDynamicPickup(pickupId)) return false;
  if (innerACConfig.AC_USE_PICKUP_WEAPONS) {
    Player.getInstances().forEach((ac_i) => {
      if (
        ACInfo.get(ac_i.id).acLastPickup < LimitsEnum.MAX_PICKUPS ||
        ACInfo.get(ac_i.id).acLastPickup - LimitsEnum.MAX_PICKUPS !== pickupId
      )
        return;
      ACInfo.get(ac_i.id).acLastPickup = -1;
    });
  }
  return true;
}

export function ac_DisableInteriorEnterExits() {
  innerGameModeConfig.ac_IntEnterExits = false;
  orig_DisableInteriorEnterExits();
  return true;
}

export function ac_UsePlayerPedAnims() {
  innerGameModeConfig.ac_PedAnims = true;
  orig_UsePlayerPedAnims();
  return true;
}

export function ac_EnableVehicleFriendlyFire() {
  innerGameModeConfig.ac_VehFriendlyFire = true;
  orig_EnableVehicleFriendlyFire();
  return true;
}

export function ac_EnableStuntBonusForAll(enable = true) {
  innerGameModeConfig.ac_StuntBonus = enable;
  Player.getInstances().forEach((ac_i) => {
    ACInfo.get(ac_i.id).acStuntBonus = innerGameModeConfig.ac_StuntBonus;
  });
  orig_EnableStuntBonusForAll(enable);
  return true;
}

export function ac_EnableStuntBonusForPlayer(player: Player, enable = true) {
  if (!orig_playerMethods.enableStuntBonus.call(player, enable)) return false;
  ACInfo.get(player.id).acStuntBonus = enable;
  return true;
}

export function ac_ShowPlayerDialog(
  player: Player,
  dialogId: number,
  next = false,
) {
  if (dialogId > 65535) dialogId %= 32768;
  if (next) ACInfo.get(player.id).acNextDialog = dialogId;
  else ACInfo.get(player.id).acDialog = dialogId;
  return true;
}

export function ac_TogglePlayerControllable(player: Player, toggle = false) {
  if (!orig_playerMethods.toggleControllable.call(player, toggle)) return false;
  ACInfo.get(player.id).acUnFrozen = toggle;
  return true;
}

export function ac_TogglePlayerSpectating(player: Player, toggle = false) {
  if (!orig_playerMethods.toggleSpectating.call(player, toggle)) return false;
  if (ACInfo.get(player.id).acSpec || ACInfo.get(player.id).acSet[5] !== -1) {
    if (!toggle) {
      if (ACInfo.get(player.id).acDead) ACInfo.get(player.id).acSet[6] = 4;
      else {
        ACInfo.get(player.id).acSet[3] =
          ACInfo.get(player.id).acSet[5] =
          ACInfo.get(player.id).acSet[7] =
          ACInfo.get(player.id).acSet[8] =
          ACInfo.get(player.id).acNextSpecAct =
            -1;
        for (let ac_i = 12; ac_i >= 0; --ac_i) {
          ACInfo.get(player.id).acSetWeapon[ac_i] = -1;
          ACInfo.get(player.id).acGiveAmmo[ac_i] = -65535;
        }
        ACInfo.get(player.id).acForceClass = ACInfo.get(player.id).acUnFrozen =
          true;
        ACInfo.get(player.id).acSet[6] = 1;
      }
      ACInfo.get(player.id).acSpawnRes++;
      ACInfo.get(player.id).acSpec = false;
      ACInfo.get(player.id).acSpawnTick = ACInfo.get(player.id).acNOPCount[9] =
        0;
      ACInfo.get(player.id).acGtc[12] = Date.now() + 2650;
    }
  } else if (toggle) {
    ACInfo.get(player.id).acSet[5] = 1;
    ACInfo.get(player.id).acNOPCount[8] = 0;
    ACInfo.get(player.id).acGtc[11] = Date.now() + 2650;
  }
  return true;
}

export function ac_SpawnPlayer(player: Player) {
  if (!orig_playerMethods.spawn()) return false;
  if (ACInfo.get(player.id).acDead) ACInfo.get(player.id).acSet[6] = 5;
  else {
    ACInfo.get(player.id).acSet[3] =
      ACInfo.get(player.id).acSet[7] =
      ACInfo.get(player.id).acSet[8] =
      ACInfo.get(player.id).acNextSpecAct =
        -1;
    for (let ac_i = 12; ac_i >= 0; --ac_i) {
      ACInfo.get(player.id).acSetWeapon[ac_i] = -1;
      ACInfo.get(player.id).acGiveAmmo[ac_i] = -65535;
    }
    ACInfo.get(player.id).acUnFrozen = true;
    ACInfo.get(player.id).acSet[6] = 2;
  }
  ACInfo.get(player.id).acSpawnRes++;
  ACInfo.get(player.id).acSpawnTick = ACInfo.get(player.id).acNOPCount[9] = 0;
  ACInfo.get(player.id).acGtc[12] = Date.now() + 2650;
  return true;
}

export function ac_SetPlayerHealth(player: Player, health: number) {
  if (health < 0.0) health = 0.0;
  if (!orig_playerMethods.setHealth.call(player, health)) return false;
  ACInfo.get(player.id).acNOPCount[3] = 0;
  ACInfo.get(player.id).acSet[1] =
    health < 0 ? Math.ceil(health) : Math.floor(health);
  ACInfo.get(player.id).acGtc[2] = Date.now() + 2650;
  return true;
}

export function ac_SetPlayerArmour(player: Player, armour: number) {
  if (armour < 0.0) armour = 0.0;
  if (!orig_playerMethods.setArmour.call(player, armour)) return false;
  ACInfo.get(player.id).acNOPCount[5] = 0;
  ACInfo.get(player.id).acSet[2] =
    armour < 0 ? Math.ceil(armour) : Math.floor(armour);
  ACInfo.get(player.id).acGtc[4] = Date.now() + 2650;
  return true;
}

export function ac_GivePlayerWeapon(
  player: Player,
  weaponId: number,
  ammo: number,
) {
  if (ac_IsValidWeapon(weaponId)) {
    const ac_s = ac_wSlot[weaponId];
    if (ammo < -32768) ammo = -32768;
    else if (ammo > 32767) ammo = 32767;
    if (ac_IsWeaponSlotWithAmmo(ac_s)) {
      if (
        ac_IsAmmoSharingInSlot(ac_s) ||
        (ACInfo.get(player.id).acSetWeapon[ac_s] === -1
          ? ACInfo.get(player.id).acWeapon[ac_s]
          : ACInfo.get(player.id).acSetWeapon[ac_s]) === weaponId
      ) {
        let ac_tmp;
        if (ACInfo.get(player.id).acGiveAmmo[ac_s] === -65535)
          ac_tmp = ACInfo.get(player.id).acAmmo[ac_s] + ammo;
        else ac_tmp = ACInfo.get(player.id).acGiveAmmo[ac_s] + ammo;
        if (ac_tmp < -32768) {
          ammo -= ac_tmp + 32768;
          ac_tmp = -32768;
        } else if (ac_tmp > 32767) {
          ammo -= ac_tmp - 32767;
          ac_tmp = 32767;
        }
        ACInfo.get(player.id).acGiveAmmo[ac_s] = ac_tmp;
      } else ACInfo.get(player.id).acGiveAmmo[ac_s] = ammo;
      ACInfo.get(player.id).acCheatCount[12] = ACInfo.get(
        player.id,
      ).acReloadTick = 0;
    } else ACInfo.get(player.id).acGiveAmmo[ac_s] = -65535;
    ACInfo.get(player.id).acNOPCount[0] = ACInfo.get(player.id).acNOPCount[1] =
      0;
    ACInfo.get(player.id).acSetWeapon[ac_s] = weaponId;
    ACInfo.get(player.id).acGtcSetWeapon[ac_s] = ACInfo.get(
      player.id,
    ).acGtcGiveAmmo[ac_s] = Date.now() + 2850;
  }
  return orig_playerMethods.giveWeapon.call(player, weaponId, ammo);
}

export function ac_SetPlayerAmmo(
  player: Player,
  weaponId: number,
  ammo: number,
) {
  if (ac_IsValidWeapon(weaponId)) {
    const ac_s = ac_wSlot[weaponId];
    if (ammo < -32768) ammo = -32768;
    else if (ammo > 32767) ammo = 32767;
    if (
      ac_IsWeaponSlotWithAmmo(ac_s) &&
      (ACInfo.get(player.id).acSetWeapon[ac_s] === -1
        ? ACInfo.get(player.id).acWeapon[ac_s]
        : ACInfo.get(player.id).acSetWeapon[ac_s]) === weaponId
    ) {
      ACInfo.get(player.id).acNOPCount[1] = 0;
      ACInfo.get(player.id).acGiveAmmo[ac_s] = ammo;
      ACInfo.get(player.id).acGtcGiveAmmo[ac_s] = Date.now() + 2850;
    }
  }
  return orig_playerMethods.setAmmo.call(player, weaponId, ammo);
}

export function ac_ResetPlayerWeapons(player: Player) {
  if (!orig_playerMethods.resetWeapons.call(player)) return false;
  for (let ac_i = 12; ac_i >= 0; --ac_i) {
    ACInfo.get(player.id).acWeapon[ac_i] = ACInfo.get(player.id).acAmmo[ac_i] =
      0;
    ACInfo.get(player.id).acSetWeapon[ac_i] = -1;
    ACInfo.get(player.id).acGiveAmmo[ac_i] = -65535;
  }
  ACInfo.get(player.id).acGtc[6] = Date.now() + 2850;
  return true;
}

export function ac_GivePlayerMoney(player: Player, money: number) {
  if (!orig_playerMethods.giveMoney.call(player, money)) return false;
  ACInfo.get(player.id).acNOPCount[11] = innerACConfig.AC_MAX_MONEY_WARNINGS;
  ACInfo.get(player.id).acMoney += money;
  return true;
}

export function ac_ResetPlayerMoney(player: Player) {
  if (!orig_playerMethods.resetMoney.call(player)) return false;
  ACInfo.get(player.id).acNOPCount[11] = 0;
  ACInfo.get(player.id).acMoney = 0;
  return true;
}

export function ac_GetPlayerMoney(player: Player) {
  return ACInfo.get(player.id).acMoney;
}

export function ac_SetPlayerSpecialAction(player: Player, actionId: number) {
  if (!orig_playerMethods.setSpecialAction.call(player, actionId)) return false;
  if (
    actionId === SpecialActionsEnum.USEJETPACK ||
    (actionId >= 24 && actionId <= 25) ||
    ((actionId === SpecialActionsEnum.USECELLPHONE ||
      actionId === 68 ||
      (actionId >= SpecialActionsEnum.DANCE1 &&
        actionId <= SpecialActionsEnum.DANCE4)) &&
      ACInfo.get(player.id).acVeh === 0) ||
    ((actionId === SpecialActionsEnum.HANDSUP ||
      (actionId >= SpecialActionsEnum.DRINK_BEER &&
        actionId <= SpecialActionsEnum.DRINK_SPRUNK)) &&
      ACInfo.get(player.id).acSpecAct !== SpecialActionsEnum.ENTER_VEHICLE &&
      ACInfo.get(player.id).acVeh === 0) ||
    (actionId === SpecialActionsEnum.STOPUSECELLPHONE &&
      ACInfo.get(player.id).acSpecAct === SpecialActionsEnum.USECELLPHONE) ||
    (actionId === SpecialActionsEnum.NONE &&
      ACInfo.get(player.id).acSpecAct !== SpecialActionsEnum.DUCK &&
      ACInfo.get(player.id).acSpecAct !== SpecialActionsEnum.ENTER_VEHICLE &&
      ACInfo.get(player.id).acSpecAct !== SpecialActionsEnum.HANDSUP)
  ) {
    ACInfo.get(player.id).acNOPCount[6] = 0;
    if (
      ((actionId === 68 ||
        (actionId >= SpecialActionsEnum.HANDSUP &&
          actionId <= SpecialActionsEnum.USECELLPHONE) ||
        (actionId >= SpecialActionsEnum.DRINK_BEER && actionId <= 25)) &&
        ACInfo.get(player.id).acSpecAct >= SpecialActionsEnum.DANCE1 &&
        ACInfo.get(player.id).acSpecAct <= SpecialActionsEnum.DANCE4) ||
      ((actionId === SpecialActionsEnum.HANDSUP ||
        (actionId >= SpecialActionsEnum.DRINK_BEER && actionId <= 25)) &&
        ACInfo.get(player.id).acSpecAct >= SpecialActionsEnum.USEJETPACK &&
        ACInfo.get(player.id).acSpecAct <= SpecialActionsEnum.EXIT_VEHICLE) ||
      ((actionId === 68 ||
        (actionId >= SpecialActionsEnum.DRINK_BEER && actionId <= 25)) &&
        ACInfo.get(player.id).acSpecAct === SpecialActionsEnum.USECELLPHONE) ||
      (actionId >= SpecialActionsEnum.DRINK_BEER &&
        actionId <= 25 &&
        (ACInfo.get(player.id).acSpecAct === SpecialActionsEnum.DUCK ||
          ACInfo.get(player.id).acSpecAct === SpecialActionsEnum.HANDSUP ||
          ACInfo.get(player.id).acSpecAct === 68)) ||
      (actionId >= 24 &&
        actionId <= 25 &&
        ACInfo.get(player.id).acSpecAct >= SpecialActionsEnum.DRINK_BEER &&
        ACInfo.get(player.id).acSpecAct <= SpecialActionsEnum.DRINK_SPRUNK) ||
      ((actionId === SpecialActionsEnum.NONE ||
        (actionId >= 24 && actionId <= 25)) &&
        ACInfo.get(player.id).acVeh > 0) ||
      (actionId === SpecialActionsEnum.USEJETPACK &&
        ((ACInfo.get(player.id).acAnim >= 1128 &&
          ACInfo.get(player.id).acAnim <= 1134) ||
          (ACInfo.get(player.id).acAnim >= 1538 &&
            ACInfo.get(player.id).acAnim <= 1544))) ||
      (actionId === 25 && ACInfo.get(player.id).acSpecAct === 24)
    )
      ACInfo.get(player.id).acNextSpecAct = actionId;
    else {
      if (actionId === SpecialActionsEnum.STOPUSECELLPHONE)
        actionId = SpecialActionsEnum.NONE;
      else if (
        actionId === SpecialActionsEnum.USEJETPACK ||
        actionId === SpecialActionsEnum.HANDSUP ||
        actionId === 68 ||
        (actionId >= SpecialActionsEnum.DANCE1 &&
          actionId <= SpecialActionsEnum.DANCE4) ||
        (actionId >= SpecialActionsEnum.DRINK_BEER &&
          actionId <= SpecialActionsEnum.DRINK_SPRUNK)
      )
        ACInfo.get(player.id).acNextSpecAct = ACInfo.get(player.id).acSpecAct;
      else ACInfo.get(player.id).acNextSpecAct = -1;
      ACInfo.get(player.id).acSet[3] = actionId;
      ACInfo.get(player.id).acGtc[5] = Date.now() + 3250;
    }
  }
  return true;
}

export function ac_PlayerSpecPlayerOrVehicle(player: Player) {
  ACInfo.get(player.id).acGtc[16] = Date.now() + 2650;
  return true;
}

export function ac_SetPlayerInterior(player: Player, interiorId: number) {
  if (!(interiorId >= 0 && interiorId <= 255)) interiorId %= 256;
  if (!orig_playerMethods.setInterior.call(player, interiorId)) return false;
  ACInfo.get(player.id).acNOPCount[2] = 0;
  ACInfo.get(player.id).acSet[0] = interiorId;
  ACInfo.get(player.id).acGtc[16] = ACInfo.get(player.id).acGtc[0] =
    Date.now() + 2850;
  return true;
}

export function ac_SetPlayerPos(
  player: Player,
  ac_x: number,
  ac_y: number,
  ac_z: number,
  mode: number,
) {
  if (mode === 2) {
    if (!orig_playerMethods.setPosFindZ.call(player, ac_x, ac_y, ac_z))
      return false;
    ACInfo.get(player.id).acTpToZ = true;
  } else {
    if (mode === 1 && !orig_playerMethods.setPos.call(player, ac_x, ac_y, ac_z))
      return false;
    ACInfo.get(player.id).acTpToZ = false;
  }
  ACInfo.get(player.id).acSet[7] = mode;
  ACInfo.get(player.id).acNOPCount[10] = 0;
  ACInfo.get(player.id).acSetPosX = ac_x;
  ACInfo.get(player.id).acSetPosY = ac_y;
  ACInfo.get(player.id).acSetPosZ = ac_z;
  ACInfo.get(player.id).acSetPosTick = ACInfo.get(player.id).acGtc[10] =
    Date.now() + 3850;
  return true;
}

export function ac_SetPlayerVelocity(
  player: Player,
  ac_X: number,
  ac_Y: number,
  ac_Z: number,
) {
  if (!orig_playerMethods.setVelocity.call(player, ac_X, ac_Y, ac_Z))
    return false;
  ACInfo.get(player.id).acSpeed = ac_GetSpeed(ac_X, ac_Y, ac_Z);
  ACInfo.get(player.id).acGtc[9] = Date.now() + 1650;
  return true;
}

export function ac_PutPlayerInVehicle(
  vehicle: Vehicle,
  player: Player,
  seatId: number,
) {
  const ac_model = vehicle.getModel();
  if (!orig_playerMethods.isConnected.call(player) || ac_model <= 0)
    return false;
  if (
    !(
      ACInfo.get(player.id).acSpecAct >= SpecialActionsEnum.DANCE1 &&
      ACInfo.get(player.id).acSpecAct <= SpecialActionsEnum.DANCE4
    ) &&
    !(
      ACInfo.get(player.id).acSpecAct >= SpecialActionsEnum.DRINK_BEER &&
      ACInfo.get(player.id).acSpecAct <= SpecialActionsEnum.DRINK_SPRUNK
    ) &&
    orig_playerMethods.getVirtualWorld.call(player) ===
      orig_vehicleMethods.getVirtualWorld.call(vehicle)
  ) {
    ACInfo.get(player.id).acNOPCount[7] = 0;
    ACInfo.get(player.id).acSet[8] = vehicle.id;
    if (
      ac_IsABusEx(ac_model) ||
      ac_IsVehicleSeatOccupied(vehicle, seatId) ||
      seatId > ac_GetMaxPassengers(ac_model)
    )
      ACInfo.get(player.id).acSet[4] = -1;
    else ACInfo.get(player.id).acSet[4] = seatId;
    ACInfo.get(player.id).acGtc[1] = Date.now() + 2650;
    const {
      x: acPutPosX,
      y: acPutPosY,
      z: acPutPosZ,
    } = orig_vehicleMethods.getPos.call(vehicle);
    ACInfo.get(player.id).acPutPosX = acPutPosX;
    ACInfo.get(player.id).acPutPosY = acPutPosY;
    ACInfo.get(player.id).acPutPosZ = acPutPosZ;
    if (
      orig_vehicleMethods.isStreamedIn.call(vehicle, player) &&
      ACVehInfo.get(vehicle.id).acDriver === InvalidEnum.PLAYER_ID
    ) {
      ACVehInfo.get(vehicle.id).acZAngle =
        orig_vehicleMethods.getZAngle.call(vehicle);
      orig_vehicleMethods.setPos.call(
        vehicle,
        ACInfo.get(player.id).acPutPosX,
        ACInfo.get(player.id).acPutPosY,
        ACInfo.get(player.id).acPutPosZ,
      );
      orig_vehicleMethods.setZAngle.call(
        vehicle,
        ACVehInfo.get(vehicle.id).acZAngle,
      );
    }
    orig_vehicleMethods.putPlayerIn.call(vehicle, player, seatId);
  }
  return true;
}

export function ac_RemovePlayerFromVehicle(player: Player) {
  if (!orig_playerMethods.removeFromVehicle.call(player)) return false;
  const ac_veh = Vehicle.getInstance(ACInfo.get(player.id).acVeh);
  if (!ac_IsARemoteControlEx(ac_veh ? ac_veh.getModel() : 0)) {
    ACInfo.get(player.id).acSet[9] = 1;
    ACInfo.get(player.id).acGtc[7] = Date.now() + 4650;
  }
  return true;
}

export function ac_SetVehiclePos(
  vehicle: Vehicle,
  ac_x: number,
  ac_y: number,
  ac_z: number,
) {
  if (!orig_vehicleMethods.setPos.call(vehicle, ac_x, ac_y, ac_z)) return false;
  const ac_driver = ACVehInfo.get(vehicle.id).acDriver;
  if (
    ac_driver !== InvalidEnum.PLAYER_ID &&
    (ACInfo.get(ac_driver).acSet[7] === -1 ||
      ACInfo.get(ac_driver).acSet[7] === 3) &&
    ACInfo.get(ac_driver).acSet[8] === -1
  )
    ac_SetPlayerPos(Player.getInstance(ac_driver)!, ac_x, ac_y, ac_z, 3);
  else {
    ACVehInfo.get(vehicle.id).acPosX = ac_x;
    ACVehInfo.get(vehicle.id).acPosY = ac_y;
    ACVehInfo.get(vehicle.id).acPosZ = ac_z;
  }
  return true;
}

export function ac_SetVehicleVelocity(
  vehicle: Vehicle,
  ac_X: number,
  ac_Y: number,
  ac_Z: number,
  angular = false,
) {
  let ac_ret;
  if (!angular)
    ac_ret = orig_vehicleMethods.setVelocity.call(vehicle, ac_X, ac_Y, ac_Z);
  else
    ac_ret = orig_vehicleMethods.setAngularVelocity.call(
      vehicle,
      ac_X,
      ac_Y,
      ac_Z,
    );
  if (ac_ret) {
    const ac_driver = ACVehInfo.get(vehicle.id).acDriver;
    if (ac_driver !== InvalidEnum.PLAYER_ID) {
      ACVehInfo.get(vehicle.id).acVelX = ac_X;
      ACVehInfo.get(vehicle.id).acVelY = ac_Y;
      ACVehInfo.get(vehicle.id).acVelZ = ac_Z;
      ACVehInfo.get(vehicle.id).acSpeed = ac_GetSpeed(ac_X, ac_Y, ac_Z);
      ACInfo.get(ac_driver).acGtc[8] = Date.now() + 1650;
    }
    return true;
  }
  return false;
}

export function ac_LinkVehicleToInterior(vehicle: Vehicle, interiorId: number) {
  if (!(interiorId >= 0 && interiorId <= 255)) interiorId %= 256;
  if (!orig_vehicleMethods.linkToInterior.call(vehicle, interiorId)) return 0;
  ACVehInfo.get(vehicle.id).acInt = interiorId;
  return 1;
}

export function ac_ChangeVehiclePaintjob(
  vehicle: Vehicle,
  paintjobId: 0 | 2 | 1,
) {
  ACVehInfo.get(vehicle.id).acPaintJob = paintjobId;
  return orig_vehicleMethods.changePaintjob.call(vehicle, paintjobId);
}

export function ac_SetVehicleHealth(
  vehicle: Vehicle,
  health: number,
  repair = false,
) {
  if (repair) {
    if (!orig_vehicleMethods.repair.call(vehicle)) return 0;
    ACVehInfo.get(vehicle.id).acPanels =
      ACVehInfo.get(vehicle.id).acDoors =
      ACVehInfo.get(vehicle.id).acLights =
      ACVehInfo.get(vehicle.id).acTires =
        0;
  } else {
    if (health < 0.0) health = 0.0;
    if (!orig_vehicleMethods.setHealth.call(vehicle, health)) return 0;
  }
  const ac_driver = ACVehInfo.get(vehicle.id).acDriver;
  if (
    ac_driver !== InvalidEnum.PLAYER_ID &&
    (ACInfo.get(ac_driver).acSet[7] === -1 ||
      ACInfo.get(ac_driver).acSet[7] === 3) &&
    ACInfo.get(ac_driver).acSet[8] === -1
  ) {
    ACInfo.get(ac_driver).acNOPCount[4] = 0;
    ACInfo.get(ac_driver).acSetVehHealth = health;
    ACInfo.get(ac_driver).acGtc[3] = Date.now() + 2850;
  } else ACVehInfo.get(vehicle.id).acHealth = health;
  return 1;
}

export function ac_UpdateVehicleDamageStatus(
  vehicle: Vehicle,
  panels: number,
  doors: number,
  lights: number,
  tires: number,
) {
  // if(!orig_vehicleMethods.updateDamageStatus.call(vehicle, panels, doors, lights, tires)) return false;
  ACVehInfo.get(vehicle.id).acPanels = panels;
  ACVehInfo.get(vehicle.id).acDoors = doors;
  ACVehInfo.get(vehicle.id).acLights = lights;
  ACVehInfo.get(vehicle.id).acTires = tires;
  // return true;
}

export function ac_SetVehicleParamsEx(
  vehicle: Vehicle,
  engine: boolean | VehicleParamsEnum,
  lights: boolean | VehicleParamsEnum,
  alarm: boolean | VehicleParamsEnum,
  doors: boolean | VehicleParamsEnum,
  bonnet: boolean | VehicleParamsEnum,
  boot: boolean | VehicleParamsEnum,
  objective: boolean | VehicleParamsEnum,
) {
  if (
    !orig_vehicleMethods.setParamsEx.call(
      vehicle,
      engine,
      lights,
      alarm,
      doors,
      bonnet,
      boot,
      objective,
    )
  )
    return 0;
  Player.getInstances().forEach((ac_i) => {
    ACVehInfo.get(vehicle.id).acLocked[ac_i.id] = doors;
  });
  return 1;
}

export function ac_SetVehicleParamsForPlayer(
  vehicle: Vehicle,
  player: Player,
  objective: boolean,
  doorsLocked: boolean,
) {
  if (
    !orig_vehicleMethods.setParamsForPlayer.call(
      vehicle,
      player,
      objective,
      doorsLocked,
    )
  )
    return 0;
  ACVehInfo.get(vehicle.id).acLocked![player.id] = doorsLocked;
  return 1;
}

export function ac_SetVehicleToRespawn(vehicle: Vehicle) {
  const ac_driver = ACVehInfo.get(vehicle.id).acDriver;
  if (ac_driver !== InvalidEnum.PLAYER_ID) {
    ACInfo.get(ac_driver).acGtc[8] = Date.now() + 1650;
    ACVehInfo.get(vehicle.id).acDriver = InvalidEnum.PLAYER_ID;
  }
  ACVehInfo.get(vehicle.id).acPaintJob = 3;
  ACVehInfo.get(vehicle.id).acHealth = 1000.0;
  ACVehInfo.get(vehicle.id).acSpawned = true;
  ACVehInfo.get(vehicle.id).acTrSpeed = -1;
  ACVehInfo.get(vehicle.id).acPosDiff =
    ACVehInfo.get(vehicle.id).acVelX =
    ACVehInfo.get(vehicle.id).acVelY =
    ACVehInfo.get(vehicle.id).acVelZ =
      0.0;
  ACVehInfo.get(vehicle.id).acSpeed =
    ACVehInfo.get(vehicle.id).acTires =
    ACVehInfo.get(vehicle.id).acLights =
    ACVehInfo.get(vehicle.id).acDoors =
    ACVehInfo.get(vehicle.id).acPanels =
    ACVehInfo.get(vehicle.id).acLastSpeed =
    ACVehInfo.get(vehicle.id).acSpeedDiff =
      0;

  const { fX, fY, fZ, fRot } = orig_vehicleMethods.getSpawnInfo.call(vehicle)!;

  ACVehInfo.get(vehicle.id).acPosX = fX;
  ACVehInfo.get(vehicle.id).acPosY = fY;
  ACVehInfo.get(vehicle.id).acPosZ = fZ;
  ACVehInfo.get(vehicle.id).acZAngle = fRot;

  return orig_vehicleMethods.setRespawn.call(vehicle);
}

export function ac_EnableAntiCheat(code: number, enable = true) {
  if (!(code >= 0 && code < ac_ACAllow.length)) return false;
  if (code === 42) {
    if (enable) {
      if (!ac_ACAllow[code]) {
        if (!innerACConfig.AC_USE_QUERY) {
          innerGameModeConfig.ac_QueryEnable =
            GameMode.getConsoleVarAsBool("enable_query");
        }
        innerGameModeConfig.ac_RconEnable =
          GameMode.getConsoleVarAsBool("rcon.enable");
      }
      if (!innerACConfig.AC_USE_QUERY) {
        GameMode.sendRconCommand("enable_query 0");
      }
      GameMode.sendRconCommand("rcon.enable 0");
    } else {
      if (!innerACConfig.AC_USE_QUERY) {
        GameMode.sendRconCommand(
          `enable_query ${innerGameModeConfig.ac_QueryEnable}`,
        );
      }
      GameMode.sendRconCommand(
        `rcon.enable ${innerGameModeConfig.ac_RconEnable}`,
      );
    }
  }
  ac_ACAllow[code] = enable;
  if (enable) {
    Player.getInstances().forEach((ac_i) => {
      ACInfo.get(ac_i.id).acACAllow[code] = ac_ACAllow[code];
      switch (code) {
        case 7: {
          ACInfo.get(ac_i.id).acCheatCount[13] = 0;
          break;
        }
        case 9: {
          ACInfo.get(ac_i.id).acCheatCount[15] = 0;
          break;
        }
        case 10: {
          ACInfo.get(ac_i.id).acCheatCount[18] = ACInfo.get(
            ac_i.id,
          ).acCheatCount[14] = 0;
          break;
        }
        case 15: {
          if (innerACConfig.AC_USE_AMMUNATIONS) {
            ACInfo.get(ac_i.id).acCheatCount[20] = 0;
          }
          break;
        }
        case 17: {
          ACInfo.get(ac_i.id).acCheatCount[7] = 0;
          break;
        }
        case 19: {
          ACInfo.get(ac_i.id).acCheatCount[9] = 0;
          break;
        }
        case 20: {
          ACInfo.get(ac_i.id).acCheatCount[10] = 0;
          break;
        }
        case 23: {
          if (innerACConfig.AC_USE_TUNING_GARAGES) {
            ACInfo.get(ac_i.id).acCheatCount[21] = 0;
          }
          break;
        }
        case 26: {
          ACInfo.get(ac_i.id).acCheatCount[12] = ACInfo.get(
            ac_i.id,
          ).acCheatCount[8] = 0;
          break;
        }
        case 29: {
          ACInfo.get(ac_i.id).acCheatCount[11] = ACInfo.get(
            ac_i.id,
          ).acCheatCount[6] = 0;
          break;
        }
        case 30: {
          ACInfo.get(ac_i.id).acCheatCount[17] = 0;
          break;
        }
        case 34: {
          ACInfo.get(ac_i.id).acCheatCount[5] = 0;
          break;
        }
        case 38: {
          ACInfo.get(ac_i.id).acCheatCount[0] = 0;
          break;
        }
        case 47: {
          ACInfo.get(ac_i.id).acCheatCount[16] = 0;
          break;
        }
      }
    });
  } else {
    Player.getInstances().forEach((ac_i) => {
      ACInfo.get(ac_i.id).acACAllow[code] = ac_ACAllow[code];
    });
  }
  if (
    innerACConfig.AC_USE_CONFIG_FILES &&
    innerACConfig.AUTOSAVE_SETTINGS_IN_CONFIG
  ) {
    ac_writeCfg();
  }
  return true;
}

export function ac_EnableAntiNOP(nopCode: number, enable = true) {
  if (!(nopCode >= 0 && nopCode < ac_NOPAllow.length)) return false;
  ac_NOPAllow[nopCode] = enable;
  Player.getInstances().forEach((ac_i) => {
    if (!ac_i.isConnected()) return;
    ACInfo.get(ac_i.id).acNOPAllow[nopCode] = ac_NOPAllow[nopCode];
  });

  if (
    innerACConfig.AC_USE_CONFIG_FILES &&
    innerACConfig.AUTOSAVE_SETTINGS_IN_CONFIG
  ) {
    ac_writeNOPCfg();
  }
  return true;
}

export function ac_EnableAntiCheatForPlayer(
  player: Player,
  code: number,
  enable = true,
) {
  if (!(code >= 0 && code < ac_ACAllow.length)) return -1;
  ACInfo.get(player.id).acACAllow[code] = enable;
  if (enable) {
    switch (code) {
      case 7:
        ACInfo.get(player.id).acCheatCount[13] = 0;
        break;
      case 9:
        ACInfo.get(player.id).acCheatCount[15] = 0;
        break;
      case 10:
        ACInfo.get(player.id).acCheatCount[18] = ACInfo.get(
          player.id,
        ).acCheatCount[14] = 0;
        break;
      case 15: {
        if (innerACConfig.AC_USE_AMMUNATIONS) {
          ACInfo.get(player.id).acCheatCount[20] = 0;
        }
        break;
      }
      case 17:
        ACInfo.get(player.id).acCheatCount[7] = 0;
        break;
      case 19:
        ACInfo.get(player.id).acCheatCount[9] = 0;
        break;
      case 20:
        ACInfo.get(player.id).acCheatCount[10] = 0;
        break;
      case 23:
        if (innerACConfig.AC_USE_TUNING_GARAGES) {
          ACInfo.get(player.id).acCheatCount[21] = 0;
        }
        break;
      case 26:
        ACInfo.get(player.id).acCheatCount[12] = ACInfo.get(
          player.id,
        ).acCheatCount[8] = 0;
        break;
      case 29:
        ACInfo.get(player.id).acCheatCount[11] = ACInfo.get(
          player.id,
        ).acCheatCount[6] = 0;
        break;
      case 30:
        ACInfo.get(player.id).acCheatCount[17] = 0;
        break;
      case 34:
        ACInfo.get(player.id).acCheatCount[5] = 0;
        break;
      case 38:
        ACInfo.get(player.id).acCheatCount[0] = 0;
        break;
      case 47:
        ACInfo.get(player.id).acCheatCount[16] = 0;
        break;
    }
  }
  return true;
}

export function ac_EnableAntiNOPForPlayer(
  player: Player,
  nopCode: number,
  enable = true,
) {
  if (!(nopCode >= 0 && nopCode < ac_NOPAllow.length)) return -1;
  ACInfo.get(player.id).acNOPAllow[nopCode] = enable;
  return true;
}

export function ac_IsAntiCheatEnabled(code: number) {
  if (!(code >= 0 && code < ac_ACAllow.length)) return false;
  return ac_ACAllow[code];
}

export function ac_IsAntiNOPEnabled(nopCode: number) {
  if (!(nopCode >= 0 && nopCode < ac_NOPAllow.length)) return false;
  return ac_NOPAllow[nopCode];
}

export function ac_IsAntiCheatEnabledForPlayer(player: Player, code: number) {
  if (!(code >= 0 && code < ac_ACAllow.length)) return false;
  return ACInfo.get(player.id).acACAllow[code];
}

export function ac_IsAntiNOPEnabledForPlayer(player: Player, nopCode: number) {
  if (!(nopCode >= 0 && nopCode < ac_NOPAllow.length)) return false;
  return ACInfo.get(player.id).acNOPAllow[nopCode];
}

export function ac_AntiCheatGetSpeed(player: Player) {
  return ACInfo.get(player.id).acSpeed;
}

export function ac_AntiCheatGetAnimationIndex(player: Player) {
  return ACInfo.get(player.id).acAnim;
}

export function ac_AntiCheatGetDialog(player: Player) {
  return ACInfo.get(player.id).acDialog;
}

export function ac_AntiCheatGetInterior(player: Player) {
  return ACInfo.get(player.id).acInt;
}

export function ac_AntiCheatGetEnterVehicle(player: Player) {
  return ACInfo.get(player.id).acEnterVeh;
}

export function ac_AntiCheatGetEnterVehicleSeat(player: Player) {
  return ACInfo.get(player.id).acEnterSeat;
}

export function ac_AntiCheatGetVehicleID(player: Player) {
  return ACInfo.get(player.id).acVeh;
}

export function ac_AntiCheatGetVehicleSeat(player: Player) {
  return ACInfo.get(player.id).acSeat;
}

export function ac_AntiCheatGetWeapon(player: Player) {
  return ACInfo.get(player.id).acHoldWeapon;
}

export function ac_AntiCheatGetWeaponInSlot(player: Player, slot: number) {
  return ACInfo.get(player.id).acWeapon[slot];
}

export function ac_AntiCheatGetAmmoInSlot(player: Player, slot: number) {
  return ACInfo.get(player.id).acAmmo[slot];
}

export function ac_AntiCheatGetSpecAction(player: Player) {
  return ACInfo.get(player.id).acSpecAct;
}

export function ac_AntiCheatGetLastSpecAction(player: Player) {
  return ACInfo.get(player.id).acLastSpecAct;
}

export function ac_AntiCheatGetLastShotWeapon(player: Player) {
  return ACInfo.get(player.id).acShotWeapon;
}

export function ac_AntiCheatGetLastPickup(player: Player) {
  return ACInfo.get(player.id).acLastPickup;
}

export function ac_AntiCheatGetLastUpdateTime(player: Player) {
  return ACInfo.get(player.id).acUpdateTick;
}

export function ac_AntiCheatGetLastReloadTime(player: Player) {
  return ACInfo.get(player.id).acReloadTick;
}

export function ac_AntiCheatGetLastEnterVehTime(player: Player) {
  return ACInfo.get(player.id).acEnterVehTick;
}

export function ac_AntiCheatGetLastShotTime(player: Player) {
  return ACInfo.get(player.id).acShotTick;
}

export function ac_AntiCheatGetLastSpawnTime(player: Player) {
  return ACInfo.get(player.id).acSpawnTick;
}

export function ac_AntiCheatIntEntExitIsEnabled(player: Player) {
  return ACInfo.get(player.id).acIntEnterExits;
}

export function ac_AntiCheatStuntBonusIsEnabled(player: Player) {
  return ACInfo.get(player.id).acStuntBonus;
}

export function ac_AntiCheatIsInModShop(player: Player) {
  return ACInfo.get(player.id).acModShop;
}

export function ac_AntiCheatIsInSpectate(player: Player) {
  return ACInfo.get(player.id).acSpec;
}

export function ac_AntiCheatIsFrozen(player: Player) {
  return !ACInfo.get(player.id).acUnFrozen;
}

export function ac_AntiCheatIsDead(player: Player) {
  return ACInfo.get(player.id).acDead;
}

export function ac_AntiCheatIsConnected(player: Player) {
  return ACInfo.get(player.id).acOnline;
}

export function ac_AntiCheatKickWithDesync(player: Player, code: number) {
  if (ACInfo.get(player.id).acKicked > 0) return -1;
  const ac_gpp = player.getPing() + 150;
  ACInfo.get(player.id).acKickTimerID = setTimeout(
    () => {
      ac_KickTimer(player);
    },
    ac_gpp > innerACConfig.AC_MAX_PING ? innerACConfig.AC_MAX_PING : ac_gpp,
  );
  if (player.getState() === PlayerStateEnum.DRIVER) {
    if (code === 4) ACInfo.get(player.id).acKickVeh = player.getVehicle()!.id;
    ACInfo.get(player.id).acKicked = 2;
  } else ACInfo.get(player.id).acKicked = 1;
  return true;
}

export function ac_AntiCheatIsKickedWithDesync(player: Player) {
  return ACInfo.get(player.id).acKicked;
}

export function ac_AntiCheatGetVehicleDriver(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acDriver;
}

export function ac_AntiCheatGetVehicleInterior(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acInt;
}

export function ac_AntiCheatGetVehiclePaintjob(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acPaintJob;
}

export function ac_AntiCheatGetVehicleSpeed(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acSpeed;
}

export function ac_AntiCheatIsVehicleSpawned(vehicleId: number) {
  return ACVehInfo.get(vehicleId).acSpawned;
}

export function ac_AntiCheatGetNextDialog(player: Player) {
  return ACInfo.get(player.id).acNextDialog;
}

export function acc_AddStaticVehicle(
  modelId: number,
  spawnX: number,
  spawnY: number,
  spawnZ: number,
  zAngle: number,
  color1: string | number,
  color2: string | number,
) {
  const ac_vehId = orig_AddStaticVehicle(
    modelId,
    spawnX,
    spawnY,
    spawnZ,
    zAngle,
    color1,
    color2,
  );
  if (ac_vehId !== InvalidEnum.VEHICLE_ID) {
    ac_AddStaticVehicle(ac_vehId, spawnX, spawnY, spawnZ, zAngle);
  }
  return ac_vehId;
}

Vehicle.__inject_AddStaticVehicle = acc_AddStaticVehicle;

export function acc_AddStaticVehicleEx(
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
  const ac_vehId = orig_AddStaticVehicleEx(
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
  if (ac_vehId !== InvalidEnum.VEHICLE_ID) {
    ac_AddStaticVehicle(ac_vehId, spawnX, spawnY, spawnZ, zAngle);
  }
  return ac_vehId;
}

Vehicle.__inject_AddStaticVehicleEx = acc_AddStaticVehicleEx;

export function acc_CreateVehicle(
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
  const ac_vehId = orig_CreateVehicle(
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
  if (ac_vehId !== InvalidEnum.VEHICLE_ID && ac_vehId > 0) {
    ac_AddStaticVehicle(ac_vehId, x, y, z, rotation);
  }
  return ac_vehId;
}

Vehicle.__inject_CreateVehicle = acc_CreateVehicle;

export function acc_AddPlayerClass(
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
  const ac_class = orig_AddPlayerClass(
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
  ac_AddPlayerClass(
    ac_class,
    spawnX,
    spawnY,
    spawnZ,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  );
  return ac_class;
}

GameMode.addPlayerClass = acc_AddPlayerClass;

export function acc_AddPlayerClassEx(
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
  const ac_class = orig_AddPlayerClassEx(
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
  ac_AddPlayerClass(
    ac_class,
    spawnX,
    spawnY,
    spawnZ,
    weapon1,
    weapon1Ammo,
    weapon2,
    weapon2Ammo,
    weapon3,
    weapon3Ammo,
  );
  return ac_class;
}

GameMode.addPlayerClassEx = acc_AddPlayerClassEx;

export const acc_SetSpawnInfo = setPlayerHook(
  "setSpawnInfo",
  function (...args) {
    return ac_SetSpawnInfo(this, ...args);
  },
);

export function acc_CreateDynamicPickup(
  modelId: number,
  type: number,
  x: number,
  y: number,
  z: number,
  worldId?: number,
  interiorId?: number,
  playerId?: number,
  streamDistance?: number,
  areaId?: number,
  priority?: number,
) {
  const ac_pickId = orig_CreateDynamicPickup(
    modelId,
    type,
    x,
    y,
    z,
    worldId,
    interiorId,
    playerId,
    streamDistance,
    areaId,
    priority,
  );
  if (ac_pickId > 0) {
    if (innerACConfig.AC_USE_PICKUP_WEAPONS) {
      ac_CreateDynamicPickup(ac_pickId, modelId, type);
    }
  }
  return ac_pickId;
}

DynamicPickup.__inject_CreateDynamicPickup = acc_CreateDynamicPickup;

export function acc_CreateDynamicPickupEx(
  modelId: number,
  type: number,
  x: number,
  y: number,
  z: number,
  streamDistance?: number,
  worlds?: number[],
  interiors?: number[],
  players?: number[],
  areas?: number[],
  priority?: number,
) {
  const ac_pickId = orig_CreateDynamicPickupEx(
    modelId,
    type,
    x,
    y,
    z,
    streamDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
  );
  if (ac_pickId > 0) {
    if (innerACConfig.AC_USE_PICKUP_WEAPONS) {
      ac_CreateDynamicPickup(ac_pickId, modelId, type);
    }
  }
  return ac_pickId;
}

DynamicPickup.__inject_CreateDynamicPickupEx = acc_CreateDynamicPickupEx;

export function acc_DestroyVehicle(vehicleId: number) {
  return ac_DestroyVehicle(vehicleId);
}

Vehicle.__inject_DestroyVehicle = acc_DestroyVehicle;

export function acc_DestroyDynamicPickup(pickupId: number) {
  return ac_DestroyDynamicPickup(pickupId);
}

DynamicPickup.__inject_DestroyDynamicPickup = acc_DestroyDynamicPickup;

export function acc_DisableInteriorEnterExits() {
  return ac_DisableInteriorEnterExits();
}

GameMode.disableInteriorEnterExits = acc_DisableInteriorEnterExits;

export function acc_UsePlayerPedAnims() {
  return ac_UsePlayerPedAnims();
}

GameMode.usePlayerPedAnims = acc_UsePlayerPedAnims;

export function acc_EnableVehicleFriendlyFire() {
  return ac_EnableVehicleFriendlyFire();
}

GameMode.enableVehicleFriendlyFire = acc_EnableVehicleFriendlyFire;

export function acc_EnableStuntBonusForAll(enable = true) {
  return ac_EnableStuntBonusForAll(enable);
}

GameMode.enableStuntBonusForAll = acc_EnableStuntBonusForAll;

export const acc_EnableStuntBonusForPlayer = setPlayerHook(
  "enableStuntBonus",
  function (...args) {
    {
      return ac_EnableStuntBonusForPlayer(this, ...args);
    }
  },
);

export function acc_ShowPlayerDialog(
  player: Player,
  id: number,
  dialog: IDialog,
) {
  if (orig_ShowPlayerDialog(player, id, dialog)) {
    return ac_ShowPlayerDialog(player, id, false);
  }
  return false;
}

Dialog.__inject__ShowPlayerDialog = acc_ShowPlayerDialog;

export const acc_TogglePlayerControllable = setPlayerHook(
  "toggleControllable",
  function (...args) {
    {
      return ac_TogglePlayerControllable(this, ...args);
    }
  },
);

export const acc_TogglePlayerSpectating = setPlayerHook(
  "toggleSpectating",
  function (...args) {
    {
      return ac_TogglePlayerSpectating(this, ...args);
    }
  },
);

export const acc_SpawnPlayer = setPlayerHook("spawn", function () {
  {
    return ac_SpawnPlayer(this);
  }
});

export const acc_SetPlayerHealth = setPlayerHook(
  "setHealth",
  function (...args) {
    {
      return ac_SetPlayerHealth(this, ...args);
    }
  },
);

export const acc_SetPlayerArmour = setPlayerHook(
  "setArmour",
  function (...args) {
    {
      if (!(this.id >= 0 && this.id < LimitsEnum.MAX_PLAYERS)) return false;
      return ac_SetPlayerArmour(this, ...args);
    }
  },
);

export const acc_GivePlayerWeapon = setPlayerHook(
  "giveWeapon",
  function (...args) {
    {
      if (!(this.id >= 0 && this.id < LimitsEnum.MAX_PLAYERS)) return false;
      return ac_GivePlayerWeapon(this, ...args);
    }
  },
);

export const acc_SetPlayerAmmo = setPlayerHook("setAmmo", function (...args) {
  {
    if (!(this.id >= 0 && this.id < LimitsEnum.MAX_PLAYERS)) return false;
    return ac_SetPlayerAmmo(this, ...args);
  }
});

export const acc_ResetPlayerWeapons = setPlayerHook(
  "resetWeapons",
  function (...args) {
    {
      return ac_ResetPlayerWeapons(this, ...args);
    }
  },
);

export const acc_GivePlayerMoney = setPlayerHook(
  "giveMoney",
  function (...args) {
    {
      return ac_GivePlayerMoney(this, ...args);
    }
  },
);

export const acc_ResetPlayerMoney = setPlayerHook("resetMoney", function () {
  {
    return ac_ResetPlayerMoney(this);
  }
});

export const acc_GetPlayerMoney = setPlayerHook("getMoney", function () {
  {
    if (!orig_playerMethods.isConnected.call(this)) return 0;
    return ac_GetPlayerMoney(this);
  }
});

export const acc_SetPlayerSpecialAction = setPlayerHook(
  "setSpecialAction",
  function (...args) {
    return ac_SetPlayerSpecialAction(this, ...args);
  },
);

export const acc_PlayerSpectatePlayer = setPlayerHook(
  "spectatePlayer",
  function (...args) {
    if (this.id >= 0 && this.id < LimitsEnum.MAX_PLAYERS) {
      ac_PlayerSpecPlayerOrVehicle(this);
    }
    return orig_playerMethods.spectatePlayer.call(this, ...args);
  },
);

export const acc_PlayerSpectateVehicle = setPlayerHook(
  "spectateVehicle",
  function (...args) {
    if (this.id >= 0 && this.id < LimitsEnum.MAX_PLAYERS) {
      ac_PlayerSpecPlayerOrVehicle(this);
    }
    return orig_playerMethods.spectateVehicle.call(this, ...args);
  },
);

export const acc_SetPlayerInterior = setPlayerHook(
  "setInterior",
  function (...args) {
    return ac_SetPlayerInterior(this, ...args);
  },
);

export const acc_SetPlayerPos = setPlayerHook("setPos", function (x, y, z) {
  return ac_SetPlayerPos(this, x, y, z || 0, 1);
});

export const acc_SetPlayerPosFindZ = setPlayerHook(
  "setPosFindZ",
  function (x, y, z) {
    return ac_SetPlayerPos(this, x, y, z || 0, 2);
  },
);

export function acc_Streamer_UpdateEx(
  player: Player,
  x: number,
  y: number,
  z: number,
  worldId = -1,
  interiorId = -1,
  type = -1,
  compensatedTime = -1,
  freezePlayer = true,
) {
  if (
    player.id >= 0 &&
    player.id < LimitsEnum.MAX_PLAYERS &&
    compensatedTime >= 0
  ) {
    ac_SetPlayerPos(player, x, y, z, 4);
  }

  return orig_StreamerUpdateEx(
    player,
    x,
    y,
    z,
    worldId,
    interiorId,
    type,
    compensatedTime,
    freezePlayer,
  );
}

Streamer.updateEx = acc_Streamer_UpdateEx;

export const acc_SetPlayerVelocity = setPlayerHook(
  "setVelocity",
  function (...args) {
    return ac_SetPlayerVelocity(this, ...args);
  },
);

export const acc_PutPlayerInVehicle = setVehicleHook(
  "putPlayerIn",
  function (...args) {
    return ac_PutPlayerInVehicle(this, ...args);
  },
);

export const acc_RemovePlayerFromVehicle = setPlayerHook(
  "removeFromVehicle",
  function () {
    return ac_RemovePlayerFromVehicle(this);
  },
);

export const acc_SetVehiclePos = setVehicleHook("setPos", function (...args) {
  return ac_SetVehiclePos(this, ...args);
});

export const acc_SetVehicleVelocity = setVehicleHook(
  "setVelocity",
  function (...args) {
    return ac_SetVehicleVelocity(this, ...args, false);
  },
);

export const acc_SetVehicleAngularVelocity = setVehicleHook(
  "setAngularVelocity",
  function (...args) {
    return ac_SetVehicleVelocity(this, ...args, true);
  },
);

export const acc_LinkVehicleToInterior = setVehicleHook(
  "linkToInterior",
  function (...args) {
    if (orig_vehicleMethods.getModel.call(this) <= 0) return 1;
    return ac_LinkVehicleToInterior(this, ...args);
  },
);

export const acc_ChangeVehiclePaintjob = setVehicleHook(
  "changePaintjob",
  function (paintjobId) {
    if (orig_vehicleMethods.getModel.call(this) <= 0) return 1;
    return ac_ChangeVehiclePaintjob(this, paintjobId);
  },
);

export const acc_SetVehicleHealth = setVehicleHook(
  "setHealth",
  function (health) {
    return ac_SetVehicleHealth(this, health, false);
  },
);

export const acc_RepairVehicle = setVehicleHook("repair", function () {
  return ac_SetVehicleHealth(this, 1000.0, true);
});

export const acc_UpdateVehicleDamageStatus = setVehicleHook(
  "updateDamageStatus",
  function (...args) {
    return ac_UpdateVehicleDamageStatus(this, ...args);
  },
);

export const acc_SetVehicleParamsEx = setVehicleHook(
  "setParamsEx",
  function (...args) {
    return ac_SetVehicleParamsEx(this, ...args);
  },
);

export const acc_SetVehicleParamsForPlayer = setVehicleHook(
  "setParamsForPlayer",
  function (...args) {
    return ac_SetVehicleParamsForPlayer(this, ...args);
  },
);

export const acc_SetVehicleToRespawn = setVehicleHook(
  "setRespawn",
  function () {
    if (orig_vehicleMethods.getModel.call(this) <= 0) return 0;
    return ac_SetVehicleToRespawn(this);
  },
);
