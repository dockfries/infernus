import { WeaponEnum, KeysEnum } from "@infernus/core";
import {
  AimSync,
  InCarSync,
  IPacket,
  OnFootSync,
  ORPC,
  PassengerSync,
} from "@infernus/raknet";
import {
  WC_AIM_SYNC,
  WC_PASSENGER_SYNC,
  WC_PLAYER_SYNC,
  WC_RPC_SET_POS_FIND_Z,
  WC_VEHICLE_SYNC,
} from "../constants";
import {
  blockAdminTeleport,
  fakeArmour,
  fakeHealth,
  // fakeQuat,
  gogglesTick,
  gogglesUsed,
  lastSyncData,
  syncDataFrozen,
  tempDataWritten,
  tempSyncData,
} from "../struct";
import { innerGameModeConfig } from "../config";
import { isBulletWeapon } from "../functions/public/is";

IPacket(WC_PLAYER_SYNC, ({ playerId, bs, next }) => {
  const onFootSync = new OnFootSync(bs);
  let onFootData = onFootSync.readSync()!;

  if (onFootData.weaponId === WeaponEnum.BOMB) {
    onFootData.keys &= ~KeysEnum.HANDBRAKE;
  }

  if (innerGameModeConfig.disableSyncBugs) {
    if (isBulletWeapon(onFootData.weaponId)) {
      if (
        (1222 >= onFootData.animationId && onFootData.animationId <= 1236) ||
        onFootData.animationId === 1249 ||
        (1275 >= onFootData.animationId && onFootData.animationId <= 1287) ||
        onFootData.animationId === 459 ||
        (908 >= onFootData.animationId && onFootData.animationId <= 909) ||
        onFootData.animationId === 1274 ||
        onFootData.animationId === 1266 ||
        (1241 >= onFootData.animationId && onFootData.animationId <= 1242) ||
        (17 >= onFootData.animationId && onFootData.animationId <= 27) ||
        (745 >= onFootData.animationId && onFootData.animationId <= 760) ||
        (1545 >= onFootData.animationId && onFootData.animationId <= 1554) ||
        (471 >= onFootData.animationId && onFootData.animationId <= 507) ||
        (1135 >= onFootData.animationId && onFootData.animationId <= 1151)
      ) {
        if (onFootData.keys & KeysEnum.HANDBRAKE) {
          onFootData.keys &= ~KeysEnum.ACTION;
        }
        onFootData.keys &= ~KeysEnum.FIRE;
        onFootData.keys &= ~KeysEnum.HANDBRAKE;
      }
    } else if (
      onFootData.weaponId === WeaponEnum.SPRAYCAN ||
      onFootData.weaponId === WeaponEnum.FIREEXTINGUISHER ||
      onFootData.weaponId === WeaponEnum.FLAMETHROWER
    ) {
      if (!(1160 >= onFootData.animationId && onFootData.animationId <= 1167)) {
        if (onFootData.keys & KeysEnum.HANDBRAKE) {
          onFootData.keys &= ~KeysEnum.ACTION;
        }

        onFootData.keys &= ~KeysEnum.FIRE;

        onFootData.keys &= ~KeysEnum.HANDBRAKE;
      }
    } else if (onFootData.weaponId === WeaponEnum.GRENADE) {
      if (!(644 >= onFootData.animationId && onFootData.animationId <= 646)) {
        onFootData.keys &= ~KeysEnum.ACTION;
      }
    }
  }

  if (syncDataFrozen.get(playerId)) {
    onFootData = lastSyncData.get(playerId);
  } else {
    tempSyncData.set(playerId, onFootData);
    tempDataWritten.set(playerId, true);
  }

  if (fakeHealth.get(playerId) !== 255) {
    onFootData.health = fakeHealth.get(playerId);
  }

  if (fakeArmour.get(playerId) !== 255) {
    onFootData.armour = fakeArmour.get(playerId);
  }

  // if (fakeQuat.get(playerId)[0] === fakeQuat.get(playerId)[0]) {
  //   onFootData.quaternion = fakeQuat.get(playerId);
  // }

  if (
    onFootData.weaponId === WeaponEnum.KNIFE &&
    !innerGameModeConfig.knifeSync
  ) {
    onFootData.keys &= ~KeysEnum.HANDBRAKE;
  } else if (44 >= onFootData.weaponId && onFootData.weaponId <= 45) {
    onFootData.keys &= ~KeysEnum.FIRE;

    gogglesTick.set(playerId, Date.now());
    gogglesUsed.set(playerId, 1);
  } else if (gogglesUsed.get(playerId)) {
    if (
      gogglesUsed.get(playerId) === 2 &&
      Date.now() - gogglesTick.get(playerId) > 40
    ) {
      gogglesUsed.set(playerId, 0);
    } else {
      onFootData.keys &= ~KeysEnum.FIRE;

      gogglesTick.set(playerId, Date.now());
      gogglesUsed.set(playerId, 2);
    }
  }

  onFootSync.writeSync(onFootData);

  return next();
});

IPacket(WC_VEHICLE_SYNC, ({ playerId, bs, next }) => {
  const inCarSync = new InCarSync(bs);
  const inCarData = inCarSync.readSync()!;

  if (fakeHealth.get(playerId) !== 255) {
    inCarData.playerHealth = fakeHealth.get(playerId);
  }

  if (fakeArmour.get(playerId) !== 255) {
    inCarData.armour = fakeArmour.get(playerId);
  }

  inCarSync.writeSync(inCarData);

  return next();
});

IPacket(WC_PASSENGER_SYNC, ({ playerId, bs, next }) => {
  const passengerSync = new PassengerSync(bs);
  const passengerData = passengerSync.readSync()!;

  if (fakeHealth.get(playerId) !== 255) {
    passengerData.playerHealth = fakeHealth.get(playerId);
  }

  if (fakeArmour.get(playerId) !== 255) {
    passengerData.playerArmour = fakeArmour.get(playerId);
  }

  passengerSync.writeSync(passengerData);

  return next();
});

IPacket(WC_AIM_SYNC, ({ playerId, bs, next }) => {
  const aimSync = new AimSync(bs);
  const aimData = aimSync.readSync()!;
  if (
    (lastSyncData.get(playerId).weaponId >= WeaponEnum.SNIPER &&
      lastSyncData.get(playerId).weaponId <= WeaponEnum.HEATSEEKER) ||
    lastSyncData.get(playerId).weaponId === WeaponEnum.CAMERA
  ) {
    aimData.aimZ = -aimData.camFrontVec[2];

    if (aimData.aimZ > 1.0) {
      aimData.aimZ = 1.0;
    } else if (aimData.aimZ < -1.0) {
      aimData.aimZ = -1.0;
    }
  }

  aimSync.writeSync(aimData);

  return next();
});

ORPC(WC_RPC_SET_POS_FIND_Z, ({ playerId, next }) => {
  if (blockAdminTeleport.get(playerId)) {
    blockAdminTeleport.set(playerId, false);
    return 0;
  }

  return next();
});
