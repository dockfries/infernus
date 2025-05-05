import { Player, PlayerStateEnum } from "@infernus/core";
import { ACInfo } from "../struct";
import { innerACConfig } from "../config";

export function ac_KickTimer(player: Player) {
  if (
    !(
      1 >= ACInfo.get(player.id).acKicked && ACInfo.get(player.id).acKicked <= 2
    )
  )
    return false;
  return player.kick();
}

function ac_AntiCheatKickWithDesync(player: Player, code: number) {
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
  return 1;
}

export function antiCheatKickWithDesync(player: Player, code: number) {
  if (!player.isConnected()) return false;
  return ac_AntiCheatKickWithDesync(player, code);
}
