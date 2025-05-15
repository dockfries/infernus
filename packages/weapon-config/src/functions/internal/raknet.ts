import { Player, SpecialActionsEnum, PlayerStateEnum } from "@infernus/core";
import { BitStream, PacketRpcValueType, OnFootSync } from "@infernus/raknet";
import { wc_PLAYER_SYNC } from "../../constants";
import { orig_playerMethods } from "../../hooks/origin";
import {
  lastSyncData,
  // fakeQuat,
  fakeHealth,
  fakeArmour,
  syncData,
  syncDataFrozen,
} from "../../struct";
import { wc_IsPlayerPaused } from "../public/is";

export function sendLastSyncPacket(
  player: Player,
  toPlayer: Player,
  animation = 0,
) {
  if (
    !orig_playerMethods.isConnected.call(player) ||
    !orig_playerMethods.isConnected.call(toPlayer)
  ) {
    return 0;
  }

  const bs = new BitStream();

  bs.writeValue(
    [PacketRpcValueType.UInt8, wc_PLAYER_SYNC],
    [PacketRpcValueType.UInt16, player.id],
  );

  // if (s_FakeQuat.get(player.id)[0] === s_FakeQuat.get(player.id)[0]) {
  // lastSyncData.get(player.id).quaternion = [...fakeQuat.get(player.id)];
  // }

  if (fakeHealth.get(player.id) !== 255) {
    lastSyncData.get(player.id).health = fakeHealth.get(player.id);
  }

  if (fakeArmour.get(player.id) !== 255) {
    lastSyncData.get(player.id).armour = fakeArmour.get(player.id);
  }

  if (wc_IsPlayerPaused(player)) {
    lastSyncData.get(player.id).velocity = [0.0, 0.0, 0.0];
  }

  if (!animation) {
    lastSyncData.get(player.id).animationId = 0;
    lastSyncData.get(player.id).animationFlags = 0;
  }

  const ofs = new OnFootSync(bs);
  ofs.writeSync(lastSyncData.get(player.id), true);
  ofs.sendPacket(toPlayer); // PR_RELIABLE_SEQUENCED
  ofs.delete();

  return 1;
}

export function saveSyncData(player: Player) {
  syncData.get(player.id).health = orig_playerMethods.getHealth.call(player);
  syncData.get(player.id).armour = orig_playerMethods.getArmour.call(player);

  const { x, y, z } = orig_playerMethods.getPos.call(player)!;
  syncData.get(player.id).posX = x;
  syncData.get(player.id).posY = y;
  syncData.get(player.id).posZ = z;
  syncData.get(player.id).posA = orig_playerMethods.getFacingAngle.call(player);

  syncData.get(player.id).skin = orig_playerMethods.getSkin.call(player);
  syncData.get(player.id).team = orig_playerMethods.getTeam.call(player);

  syncData.get(player.id).weapon = orig_playerMethods.getWeapon.call(player);

  for (let i = 0; i < 13; i++) {
    const { ammo, weapons } = orig_playerMethods.getWeaponData.call(player, i);
    syncData.get(player.id).weaponId[i] = weapons;
    syncData.get(player.id).weaponAmmo[i] = ammo;
  }
}

export function freezeSyncPacket(player: Player, toggle: boolean) {
  if (!orig_playerMethods.isConnected.call(player)) {
    return 0;
  }

  lastSyncData.get(player.id)!.keys = 0;
  lastSyncData.get(player.id)!.udKey = 0;
  lastSyncData.get(player.id)!.lrKey = 0;
  lastSyncData.get(player.id)!.specialAction = SpecialActionsEnum.NONE;
  lastSyncData.get(player.id)!.velocity = [0.0, 0.0, 0.0];

  syncDataFrozen.set(player.id, toggle);

  return 1;
}

export function updateSyncData(player: Player) {
  if (
    !orig_playerMethods.isConnected.call(player) ||
    orig_playerMethods.getState.call(player) !== PlayerStateEnum.ONFOOT
  ) {
    return;
  }

  Player.getInstances().forEach((i) => {
    if (i !== player && orig_playerMethods.isStreamedIn.call(player, i)) {
      sendLastSyncPacket(player, i);
    }
  });
}
