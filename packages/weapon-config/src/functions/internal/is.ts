import { Player, Vehicle, LimitsEnum, InvalidEnum } from "@infernus/core";
import { WC_WeaponEnum } from "../../enums";
import { orig_vehicleMethods, orig_playerMethods } from "../../hooks/origin";
import { playerTeam, lastVehicleTick } from "../../struct";
import { angleBetweenPoints } from "../../utils/math";

export function hasSameTeam(player: Player, otherId: number) {
  if (
    otherId < 0 ||
    otherId >= LimitsEnum.MAX_PLAYERS ||
    player.id < 0 ||
    player.id >= LimitsEnum.MAX_PLAYERS
  ) {
    return 0;
  }

  if (
    playerTeam.get(player.id) === InvalidEnum.NO_TEAM ||
    playerTeam.get(otherId) === InvalidEnum.NO_TEAM
  ) {
    return 0;
  }

  return playerTeam.get(player.id) === playerTeam.get(otherId);
}

export function isVehicleBike(vehicle: Vehicle) {
  return [
    448, 461, 462, 463, 468, 471, 481, 509, 510, 521, 522, 523, 581, 586,
  ].includes(orig_vehicleMethods.getModel.call(vehicle));
}

export function isVehicleArmedWithWeapon(
  vehicle: Vehicle,
  weaponId: WC_WeaponEnum,
) {
  switch (orig_vehicleMethods.getModel.call(vehicle)) {
    case 425: {
      return (
        weaponId === WC_WeaponEnum.MINIGUN ||
        weaponId === WC_WeaponEnum.ROCKETLAUNCHER
      );
    }

    case 447:
    case 464:
    case 476: {
      return weaponId === WC_WeaponEnum.M4;
    }

    case 432:
    case 520: {
      return weaponId === WC_WeaponEnum.ROCKETLAUNCHER;
    }
  }

  return false;
}

export function wasPlayerInVehicle(player: Player, time: number) {
  if (!lastVehicleTick.get(player.id)) {
    return false;
  }

  if (Date.now() - time < lastVehicleTick.get(player.id)) {
    return true;
  }

  return false;
}

export function isPlayerBehindPlayer(
  player: Player | InvalidEnum.PLAYER_ID,
  target: Player,
  diff = 90.0,
) {
  if (player === InvalidEnum.PLAYER_ID) return false;

  const { x: x1, y: y1 } = orig_playerMethods.getPos.call(player)!;
  const { x: x2, y: y2 } = orig_playerMethods.getPos.call(target)!;

  let ang = orig_playerMethods.getFacingAngle.call(target).angle;

  let angDiff = angleBetweenPoints(x1, y1, x2, y2);

  if (angDiff < 0.0) angDiff += 360.0;
  if (angDiff > 360.0) angDiff -= 360.0;

  ang = ang - angDiff;

  if (ang > 180.0) ang -= 360.0;
  if (ang < -180.0) ang += 360.0;

  return Math.abs(ang) > diff;
}
