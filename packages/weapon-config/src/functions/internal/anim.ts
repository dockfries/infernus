import { Player } from "@infernus/core";
import { BitStream, PacketRpcValueType } from "@infernus/raknet";
import { wc_RPC_CLEAR_ANIMATIONS } from "../../constants";
import { orig_playerMethods } from "../../hooks/origin";

export function clearAnimationsForPlayer(player: Player, forPlayer: Player) {
  if (
    !orig_playerMethods.isConnected.call(player) ||
    !orig_playerMethods.isConnected.call(forPlayer)
  ) {
    return 0;
  }

  const bs = new BitStream();

  bs.writeValue([PacketRpcValueType.UInt16, player.id]);
  bs.sendRPC(forPlayer, wc_RPC_CLEAR_ANIMATIONS);
  bs.delete();

  return 1;
}

export function wc_SecondKnifeAnim(player: Player) {
  const animLib = "KNIFE",
    animName = "KILL_Knife_Ped_Die";
  orig_playerMethods.applyAnimation.call(
    player,
    animLib,
    animName,
    4.1,
    false,
    true,
    true,
    true,
    3000,
    1,
  );
}
