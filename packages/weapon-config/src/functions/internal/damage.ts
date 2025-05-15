import {
  Player,
  useTrigger,
  withTriggerOptions,
  InvalidEnum,
  LimitsEnum,
  PlayerStateEnum,
  FightingStylesEnum,
  SpecialActionsEnum,
} from "@infernus/core";
import {
  IEditableOnPlayerDamage,
  triggerOnPlayerDamage,
} from "../../callbacks/custom";
import { internalPlayerDeath } from "../../callbacks/player/spawn";
import { innerGameModeConfig, innerWeaponConfig } from "../../config";
import {
  s_WeaponDamage,
  s_WeaponRange,
  s_DamageType,
  s_DamageArmour,
} from "../../constants";
import {
  InvalidDamageEnum,
  WC_WeaponEnum,
  RejectedReasonEnum,
  DamageTypeEnum,
} from "../../enums";
import { orig_playerMethods, orig_vehicleMethods } from "../../hooks/origin";
import {
  rejectedHitsIdx,
  rejectedHits,
  RejectedHit,
  lastExplosive,
  lastShot,
  damageRangeSteps,
  damageRangeRanges,
  damageRangeValues,
  playerHealth,
  playerArmour,
  damageDoneArmour,
  damageDoneHealth,
  lastVehicleEnterTime,
  cBugAllowed,
  delayedDeathTimer,
} from "../../struct";
import { debugMessage, debugMessageAll } from "../../utils/debug";
import { floatFraction } from "../../utils/math";
import {
  isMeleeWeapon,
  isHighRateWeapon,
  isBulletWeapon,
  wc_IsPlayerSpawned,
} from "../public/is";
import { playerDeath, wc_DelayedDeath } from "./death";
import { onRejectedHit, onPlayerDamageDone } from "./event";
import {
  isVehicleArmedWithWeapon,
  isVehicleBike,
  isPlayerBehindPlayer,
} from "./is";
import { updateHealthBar, makePlayerFacePlayer } from "./set";

export function addRejectedHit(
  player: Player | InvalidEnum.PLAYER_ID,
  damaged: Player | InvalidEnum.PLAYER_ID,
  reason: number,
  weapon: number,
  i1 = 0,
  i2 = 0,
  i3 = 0,
) {
  if (
    typeof player !== "number" &&
    player.id >= 0 &&
    player.id < LimitsEnum.MAX_PLAYERS
  ) {
    let idx = rejectedHitsIdx.get(player.id);

    if (
      rejectedHits.get(player.id)[idx] &&
      rejectedHits.get(player.id)[idx]!.time
    ) {
      idx += 1;

      if (idx >= rejectedHits.get(player.id).length) {
        idx = 0;
      }

      rejectedHitsIdx.set(player.id, idx);
    }

    const time = Date.now() / 1000;
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const second = new Date().getSeconds();

    if (!rejectedHits.get(player.id)[idx]) {
      rejectedHits.get(player.id)[idx] = new RejectedHit();
    }

    rejectedHits.get(player.id)[idx]!.reason = reason;
    rejectedHits.get(player.id)[idx]!.time = time;
    rejectedHits.get(player.id)[idx]!.weapon = weapon;
    rejectedHits.get(player.id)[idx]!.hour = hour;
    rejectedHits.get(player.id)[idx]!.minute = minute;
    rejectedHits.get(player.id)[idx]!.second = second;
    rejectedHits.get(player.id)[idx]!.info1 = i1;
    rejectedHits.get(player.id)[idx]!.info2 = i2;
    rejectedHits.get(player.id)[idx]!.info3 = i3;

    if (
      typeof damaged !== "number" &&
      damaged.id >= 0 &&
      damaged.id < LimitsEnum.MAX_PLAYERS
    ) {
      rejectedHits.get(player.id)[idx]!.name =
        orig_playerMethods.getName.call(damaged);
    } else {
      rejectedHits.get(player.id)[idx]!.name = "#\0";
    }

    onRejectedHit(
      player,
      rejectedHits.get(typeof player === "number" ? player : player.id)[idx]!,
    );
  }
}

export interface IProcessDamageArgs {
  player: Player;
  issuer: Player | InvalidEnum.PLAYER_ID;
  amount: number;
  weaponId: number;
  bodyPart: number;
  bullets: number;
}

export function processDamage(editable: IProcessDamageArgs) {
  if (editable.amount < 0.0) {
    return InvalidDamageEnum.INVALID_DAMAGE;
  }

  switch (editable.amount) {
    case 3.63000011444091796875:
    case 5.940000057220458984375:
    case 5.610000133514404296875: {
      editable.amount = 2.6400001049041748046875;
      break;
    }

    case 3.30000019073486328125: {
      if (
        editable.weaponId !== WC_WeaponEnum.SHOTGUN &&
        editable.weaponId !== WC_WeaponEnum.SAWEDOFF
      ) {
        editable.amount = 2.6400001049041748046875;
      }
      break;
    }

    case 4.950000286102294921875: {
      if (isMeleeWeapon(editable.weaponId)) {
        editable.amount = 2.6400001049041748046875;
      }
      break;
    }

    case 6.270000457763671875:
    case 6.93000030517578125:
    case 7.2600002288818359375:
    case 7.9200000762939453125:
    case 8.5799999237060546875:
    case 9.24000072479248046875:
    case 11.88000011444091796875:
    case 11.22000026702880859375: {
      editable.amount = 2.6400001049041748046875;
      break;
    }

    case 9.90000057220458984375: {
      switch (editable.weaponId) {
        case (WC_WeaponEnum.REASON_VEHICLE,
        WC_WeaponEnum.VEHICLE_M4,
        WC_WeaponEnum.AK47,
        WC_WeaponEnum.M4,
        WC_WeaponEnum.SHOTGUN,
        WC_WeaponEnum.SAWEDOFF,
        WC_WeaponEnum.SHOTGSPA): {
          break;
        }

        default: {
          editable.amount = 6.6000003814697265625;
        }
      }
    }
  }

  if (
    editable.weaponId === WC_WeaponEnum.HELIBLADES &&
    editable.amount !== 330.0
  ) {
    editable.weaponId = WC_WeaponEnum.CARPARK;
  }

  if (isHighRateWeapon(editable.weaponId)) {
    if (editable.weaponId === WC_WeaponEnum.REASON_DROWN) {
      if (editable.amount > 10.0) editable.amount = 10.0;
    } else if (editable.amount > 1.0) {
      editable.amount = 1.0;
    }

    if (s_WeaponDamage[editable.weaponId] !== 1.0) {
      editable.amount *= s_WeaponDamage[editable.weaponId];
    }

    if (
      editable.weaponId === WC_WeaponEnum.SPRAYCAN ||
      editable.weaponId === WC_WeaponEnum.FIREEXTINGUISHER ||
      (editable.weaponId === WC_WeaponEnum.CARPARK &&
        editable.issuer !== InvalidEnum.PLAYER_ID)
    ) {
      if (editable.issuer === InvalidEnum.PLAYER_ID) {
        return InvalidDamageEnum.NO_ISSUER;
      }

      const { x, y, z } = orig_playerMethods.getPos.call(editable.issuer)!;
      const dist = orig_playerMethods.getDistanceFromPoint.call(
        editable.player,
        x,
        y,
        z,
      );

      if (editable.weaponId === WC_WeaponEnum.CARPARK) {
        if (dist > 15.0) {
          addRejectedHit(
            editable.issuer,
            editable.player,
            RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN,
            editable.weaponId,
            dist,
          );
          return InvalidDamageEnum.INVALID_DISTANCE;
        }
      } else {
        if (dist > s_WeaponRange[editable.weaponId] + 2.0) {
          addRejectedHit(
            editable.issuer,
            editable.player,
            RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN,
            editable.weaponId,
            dist,
            s_WeaponRange[editable.weaponId],
          );
          return InvalidDamageEnum.INVALID_DISTANCE;
        }
      }
    }

    return InvalidDamageEnum.NO_ERROR;
  }

  if (
    editable.issuer === InvalidEnum.PLAYER_ID &&
    (isBulletWeapon(editable.weaponId) || isMeleeWeapon(editable.weaponId))
  ) {
    return InvalidDamageEnum.NO_ISSUER;
  }

  if (editable.weaponId === WC_WeaponEnum.PARACHUTE) {
    editable.weaponId = WC_WeaponEnum.UNARMED;
  } else if (editable.weaponId === WC_WeaponEnum.REASON_COLLISION) {
    if (editable.amount > 165.0) {
      editable.amount = 1.0;
    } else {
      editable.amount /= 165.0;
    }
  } else if (editable.weaponId === WC_WeaponEnum.EXPLOSION) {
    editable.amount /= 82.5;

    if (editable.issuer !== InvalidEnum.PLAYER_ID) {
      if (
        orig_playerMethods.getState.call(editable.issuer) ===
        PlayerStateEnum.DRIVER
      ) {
        const vehicle = orig_playerMethods.getVehicle.call(editable.issuer);

        if (
          vehicle &&
          isVehicleArmedWithWeapon(vehicle, WC_WeaponEnum.ROCKETLAUNCHER)
        ) {
          editable.weaponId = WC_WeaponEnum.VEHICLE_ROCKETLAUNCHER;
        }
      } else if (lastExplosive.get(editable.issuer.id)) {
        editable.weaponId = lastExplosive.get(editable.issuer.id);
      }
    } else if (
      orig_playerMethods.getState.call(editable.player) ===
      PlayerStateEnum.DRIVER
    ) {
      const vehicle = orig_playerMethods.getVehicle.call(editable.player);

      if (
        vehicle &&
        isVehicleArmedWithWeapon(vehicle, WC_WeaponEnum.ROCKETLAUNCHER)
      ) {
        editable.weaponId = WC_WeaponEnum.VEHICLE_ROCKETLAUNCHER;
      }
    }
  }

  if (
    (editable.weaponId >= WC_WeaponEnum.COLT45 &&
      editable.weaponId <= WC_WeaponEnum.SNIPER) ||
    [
      WC_WeaponEnum.MINIGUN,
      WC_WeaponEnum.SPRAYCAN,
      WC_WeaponEnum.FIREEXTINGUISHER,
    ].includes(editable.weaponId)
  ) {
    if (editable.amount === 2.6400001049041748046875) {
      editable.bodyPart = editable.weaponId;
      editable.weaponId = WC_WeaponEnum.PISTOLWHIP;
    }
  }

  let melee = isMeleeWeapon(editable.weaponId);

  if (melee && orig_playerMethods.isInAnyVehicle.call(editable.issuer)) {
    return InvalidDamageEnum.INVALID_DAMAGE;
  }

  if (editable.weaponId !== WC_WeaponEnum.PISTOLWHIP) {
    switch (editable.amount) {
      // eslint-disable-next-line no-loss-of-precision
      case 4.62000036239624023437:
      case 1.32000005245208740234375:
      case 1.650000095367431640625:
      case 1.980000019073486328125:
      case 2.3100001811981201171875:
      case 2.6400001049041748046875:
      case 2.9700000286102294921875:
      case 3.96000003814697265625:
      case 4.28999996185302734375:
      case 5.280000209808349609375: {
        if (!melee) {
          debugMessage(
            editable.issuer,
            `weapon changed from ${editable.weaponId} to melee (punch & swap)`,
          );
          editable.weaponId = WC_WeaponEnum.UNARMED;
          melee = true;
        }
        break;
      }

      case 6.6000003814697265625: {
        if (!melee) {
          switch (editable.weaponId) {
            case (WC_WeaponEnum.UZI,
            WC_WeaponEnum.TEC9,
            WC_WeaponEnum.SHOTGUN,
            WC_WeaponEnum.SAWEDOFF): {
              break;
            }

            default: {
              debugMessage(
                editable.issuer,
                `weapon changed from ${editable.weaponId} to melee (punch & swap)`,
              );
              editable.weaponId = WC_WeaponEnum.UNARMED;
              melee = true;
            }
          }
        }
        break;
      }

      case 54.12000274658203125: {
        if (!melee) {
          debugMessage(
            editable.issuer,
            `weapon changed from ${editable.weaponId} to melee (punch & swap)`,
          );
          melee = true;
          editable.weaponId = WC_WeaponEnum.UNARMED;
          editable.amount = 1.32000005245208740234375;
        }

        if (
          editable.issuer !== InvalidEnum.PLAYER_ID &&
          orig_playerMethods.getFightingStyle.call(editable.issuer) !==
            FightingStylesEnum.KNEEHEAD
        ) {
          return InvalidDamageEnum.INVALID_DAMAGE;
        }
        break;
      }

      default: {
        if (melee && editable.weaponId !== WC_WeaponEnum.CHAINSAW) {
          return InvalidDamageEnum.INVALID_DAMAGE;
        }
      }
    }
  }

  if (melee) {
    const { x, y, z } = orig_playerMethods.getPos.call(editable.issuer)!;
    const dist = orig_playerMethods.getDistanceFromPoint.call(
      editable.player,
      x,
      y,
      z,
    );

    if (
      editable.weaponId >= WC_WeaponEnum.UNARMED &&
      editable.weaponId < s_WeaponRange.length &&
      dist > s_WeaponRange[editable.weaponId] + 2.0
    ) {
      addRejectedHit(
        editable.issuer,
        editable.player,
        RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN,
        editable.weaponId,
        dist,
        s_WeaponRange[editable.weaponId],
      );
      return InvalidDamageEnum.INVALID_DISTANCE;
    }
  }

  switch (editable.weaponId) {
    case WC_WeaponEnum.SHOTGSPA: {
      editable.bullets = editable.amount / 4.950000286102294921875;

      if (8.0 - editable.bullets < -0.05) {
        return InvalidDamageEnum.INVALID_DAMAGE;
      }

      break;
    }

    case (WC_WeaponEnum.SHOTGUN, WC_WeaponEnum.SAWEDOFF): {
      editable.bullets = editable.amount / 3.30000019073486328125;

      if (15.0 - editable.bullets < -0.05) {
        return InvalidDamageEnum.INVALID_DAMAGE;
      }

      break;
    }
  }

  if (editable.bullets) {
    const f = floatFraction(editable.bullets);

    if (f > 0.01 && f < 0.99) {
      return InvalidDamageEnum.INVALID_DAMAGE;
    }

    editable.amount /= editable.bullets;
  }

  if (editable.weaponId === WC_WeaponEnum.CHAINSAW) {
    switch (editable.amount) {
      case 6.6000003814697265625:
      case 13.5300006866455078125:
      case 16.1700000762939453125:
      case 26.40000152587890625:
      case 27.060001373291015625: {
        break;
      }

      default: {
        return InvalidDamageEnum.INVALID_DAMAGE;
      }
    }
  } else if (editable.weaponId === WC_WeaponEnum.DEAGLE) {
    switch (editable.amount) {
      case 46.200000762939453125:
      case 23.1000003814697265625: {
        break;
      }

      default: {
        return InvalidDamageEnum.INVALID_DAMAGE;
      }
    }
  }

  let def_amount = 0.0;

  switch (editable.weaponId) {
    case WC_WeaponEnum.COLT45:
    case WC_WeaponEnum.MP5: {
      def_amount = 8.25;
      break;
    }
    case WC_WeaponEnum.SILENCED: {
      def_amount = 13.200000762939453125;
      break;
    }
    case WC_WeaponEnum.UZI:
    case WC_WeaponEnum.TEC9: {
      def_amount = 6.6000003814697265625;
      break;
    }
    case WC_WeaponEnum.AK47:
    case WC_WeaponEnum.M4:
    case WC_WeaponEnum.VEHICLE_M4: {
      def_amount = 9.90000057220458984375;
      break;
    }
    case WC_WeaponEnum.RIFLE: {
      def_amount = 24.7500019073486328125;
      break;
    }
    case WC_WeaponEnum.SNIPER: {
      def_amount = 41.25;
      break;
    }
    case WC_WeaponEnum.MINIGUN:
    case WC_WeaponEnum.VEHICLE_MINIGUN: {
      def_amount = 46.200000762939453125;
      break;
    }
    case WC_WeaponEnum.REASON_VEHICLE: {
      def_amount = 9.90000057220458984375;
      break;
    }
  }

  if (def_amount && def_amount !== editable.amount) {
    return InvalidDamageEnum.INVALID_DAMAGE;
  }

  switch (s_DamageType[editable.weaponId]) {
    case DamageTypeEnum.MULTIPLIER: {
      if (s_WeaponDamage[editable.weaponId] !== 1.0) {
        editable.amount *= s_WeaponDamage[editable.weaponId];
      }
      break;
    }

    case DamageTypeEnum.STATIC: {
      if (editable.bullets) {
        editable.amount = s_WeaponDamage[editable.weaponId] * editable.bullets;
      } else {
        editable.amount = s_WeaponDamage[editable.weaponId];
      }
      break;
    }

    case DamageTypeEnum.RANGE:
    case DamageTypeEnum.RANGE_MULTIPLIER:
      {
        let length = 0.0;

        if (editable.issuer !== InvalidEnum.PLAYER_ID) {
          if (innerGameModeConfig.lagCompMode) {
            length = lastShot.get(editable.issuer.id).length;
          } else {
            const { x, y, z } = orig_playerMethods.getPos.call(
              editable.issuer,
            )!;
            length = orig_playerMethods.getDistanceFromPoint.call(
              editable.player,
              x,
              y,
              z,
            );
          }
        }

        for (let i = damageRangeSteps[editable.weaponId] - 1; i >= 0; i--) {
          if (
            i === 0 ||
            length >= (damageRangeRanges.get(editable.weaponId)[i] || 0)
          ) {
            if (
              s_DamageType[editable.weaponId] ===
              DamageTypeEnum.RANGE_MULTIPLIER
            ) {
              if ((damageRangeValues.get(editable.weaponId)[i] || 0) !== 1.0) {
                editable.amount *=
                  damageRangeValues.get(editable.weaponId)[i] || 0;
              }
            } else {
              if (editable.bullets) {
                editable.amount =
                  (damageRangeValues.get(editable.weaponId)[i] || 0) *
                  editable.bullets;
              } else {
                editable.amount =
                  damageRangeValues.get(editable.weaponId)[i] || 0;
              }
            }

            break;
          }
        }
      }
      break;
  }

  return InvalidDamageEnum.NO_ERROR;
}

export function inflictDamage(
  player: Player,
  amount: number,
  issuerId: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
  weaponId: WC_WeaponEnum = WC_WeaponEnum.UNKNOWN,
  bodyPart: number = 0,
  ignore_armour = false,
) {
  if (!wc_IsPlayerSpawned(player) || amount < 0.0) {
    return;
  }

  const editable: IEditableOnPlayerDamage = {
    player,
    amount,
    issuerId,
    weaponId,
    bodyPart,
  };

  if (!triggerOnPlayerDamage(editable)) {
    updateHealthBar(editable.player, true);

    if (
      editable.weaponId < WC_WeaponEnum.UNARMED ||
      editable.weaponId > WC_WeaponEnum.UNKNOWN
    ) {
      editable.weaponId = WC_WeaponEnum.UNKNOWN;
    }

    if (innerWeaponConfig.DEBUG) {
      let length = 0.0;

      if (editable.issuerId !== InvalidEnum.PLAYER_ID) {
        if (
          innerGameModeConfig.lagCompMode &&
          isBulletWeapon(editable.weaponId)
        ) {
          length = lastShot.get(editable.issuerId.id).length;
        } else {
          const { x, y, z } = orig_playerMethods.getPos.call(
            editable.issuerId,
          )!;
          length = orig_playerMethods.getDistanceFromPoint.call(
            editable.player,
            x,
            y,
            z,
          );
        }
      }

      if (!isHighRateWeapon(editable.weaponId)) {
        debugMessageAll(
          `!InflictDamage(${editable.player.id}, ${editable.amount.toFixed(4)}, ${editable.issuerId}, ${editable.weaponId}, ${editable.bodyPart}) length = ${length}`,
        );
      }
    }

    return;
  }

  if (
    editable.weaponId < WC_WeaponEnum.UNARMED ||
    editable.weaponId > WC_WeaponEnum.UNKNOWN
  ) {
    editable.weaponId = WC_WeaponEnum.UNKNOWN;
  }

  if (innerWeaponConfig.DEBUG) {
    let length = 0.0;

    if (editable.issuerId !== InvalidEnum.PLAYER_ID) {
      if (
        innerGameModeConfig.lagCompMode &&
        isBulletWeapon(editable.weaponId)
      ) {
        length = lastShot.get(editable.issuerId.id).length;
      } else {
        const { x, y, z } = orig_playerMethods.getPos.call(editable.issuerId)!;
        length = orig_playerMethods.getDistanceFromPoint.call(
          editable.player,
          x,
          y,
          z,
        );
      }
    }

    if (!isHighRateWeapon(editable.weaponId)) {
      debugMessageAll(
        `!InflictDamage(${editable.player.id}, ${editable.amount.toFixed(4)}, ${editable.issuerId}, ${editable.weaponId}, ${editable.bodyPart}) length = ${length}`,
      );
    }
  }

  const s_DamageArmourToggle = innerGameModeConfig.damageArmourToggle;

  if (
    !ignore_armour &&
    editable.weaponId !== WC_WeaponEnum.REASON_COLLISION &&
    editable.weaponId !== WC_WeaponEnum.REASON_DROWN &&
    editable.weaponId !== WC_WeaponEnum.CARPARK &&
    editable.weaponId !== WC_WeaponEnum.UNKNOWN &&
    (!s_DamageArmourToggle[0] ||
      (s_DamageArmour[editable.weaponId][0] &&
        (!s_DamageArmourToggle[1] ||
          (s_DamageArmour[editable.weaponId][1] && editable.bodyPart === 3) ||
          !s_DamageArmour[editable.weaponId][1])))
  ) {
    if (editable.amount <= 0.0) {
      editable.amount =
        playerHealth.get(editable.player.id) +
        playerArmour.get(editable.player.id);
    }

    playerArmour.set(
      editable.player.id,
      playerArmour.get(editable.player.id) - editable.amount,
    );
  } else {
    if (editable.amount <= 0.0) {
      editable.amount = playerHealth.get(editable.player.id);
    }

    playerHealth.set(
      editable.player.id,
      playerHealth.get(editable.player.id) - editable.amount,
    );
  }

  if (playerArmour.get(editable.player.id) < 0.0) {
    damageDoneArmour.set(
      editable.player.id,
      editable.amount + playerArmour.get(editable.player.id),
    );
    damageDoneHealth.set(
      editable.player.id,
      -playerArmour.get(editable.player.id),
    );
    playerHealth.set(
      editable.player.id,
      playerHealth.get(editable.player.id) +
        playerArmour.get(editable.player.id),
    );
    playerArmour.set(editable.player.id, 0);
  } else {
    damageDoneArmour.set(editable.player.id, editable.amount);
    damageDoneHealth.set(editable.player.id, 0.0);
  }

  if (playerHealth.get(editable.player.id) <= 0.0) {
    editable.amount += playerHealth.get(editable.player.id);
    damageDoneHealth.set(
      editable.player.id,
      damageDoneHealth.get(editable.player.id) +
        playerHealth.get(editable.player.id),
    );
    playerHealth.set(editable.player.id, 0.0);
  }

  onPlayerDamageDone(
    editable.player,
    editable.amount,
    editable.issuerId,
    editable.weaponId,
    editable.bodyPart,
  );
  let animLib = "PED",
    animName = "";

  if (playerHealth.get(editable.player.id) <= 0.0005) {
    const vehicle = orig_playerMethods.getVehicle.call(editable.player);

    if (vehicle) {
      orig_playerMethods.toggleControllable.call(editable.player, false);

      if (isVehicleBike(vehicle)) {
        const {
          x: vx,
          y: vy,
          z: vz,
        } = orig_vehicleMethods.getVelocity.call(vehicle);

        if (vx * vx + vy * vy + vz * vz >= 0.4) {
          animName = "BIKE_fallR";
          playerDeath(editable.player, animLib, animName, false);
        } else {
          animName = "BIKE_fall_off";
          playerDeath(editable.player, animLib, animName, false);
        }
      } else {
        if (orig_playerMethods.getVehicleSeat.call(editable.player) & 1) {
          animName = "CAR_dead_LHS";
          playerDeath(editable.player, animLib, animName);
        } else {
          animName = "CAR_dead_RHS";
          playerDeath(editable.player, animLib, animName);
        }
      }
    } else if (
      orig_playerMethods.getSpecialAction.call(editable.player) ===
      SpecialActionsEnum.USEJETPACK
    ) {
      animName = "KO_skid_back";
      playerDeath(editable.player, animLib, animName, false);
    } else {
      if (
        Date.now() / 1000 - lastVehicleEnterTime.get(editable.player.id) <
        10
      ) {
        orig_playerMethods.toggleControllable.call(editable.player, false);
      }

      const anim = orig_playerMethods.getAnimationIndex.call(editable.player);

      if (
        anim === 1250 ||
        (anim >= 1538 && anim <= 1544) ||
        editable.weaponId === WC_WeaponEnum.REASON_DROWN
      ) {
        animName = "Drown";
        playerDeath(editable.player, animLib, animName);
      } else if (anim >= 1195 && anim <= 1198) {
        animName = "KO_skid_back";
        playerDeath(editable.player, animLib, animName);
      } else if (
        editable.weaponId >= WC_WeaponEnum.SHOTGUN &&
        editable.weaponId <= WC_WeaponEnum.SHOTGSPA
      ) {
        if (isPlayerBehindPlayer(editable.issuerId, editable.player)) {
          animName = "KO_shot_front";
          makePlayerFacePlayer(editable.player, editable.issuerId, true);
          playerDeath(editable.player, animLib, animName);
        } else {
          animName = "BIKE_fall_off";
          makePlayerFacePlayer(editable.player, editable.issuerId);
          playerDeath(editable.player, animLib, animName);
        }
      } else if (
        editable.weaponId >= WC_WeaponEnum.RIFLE &&
        editable.weaponId <= WC_WeaponEnum.SNIPER
      ) {
        if (editable.bodyPart === 9) {
          animName = "KO_shot_face";
          playerDeath(editable.player, animLib, animName);
        } else if (isPlayerBehindPlayer(editable.issuerId, editable.player)) {
          animName = "KO_shot_front";
          playerDeath(editable.player, animLib, animName);
        } else {
          animName = "KO_shot_stom";
          playerDeath(editable.player, animLib, animName);
        }
      } else if (isBulletWeapon(editable.weaponId)) {
        if (editable.bodyPart === 9) {
          animName = "KO_shot_face";
          playerDeath(editable.player, animLib, animName);
        } else {
          animName = "KO_shot_front";
          playerDeath(editable.player, animLib, animName);
        }
      } else if (editable.weaponId === WC_WeaponEnum.PISTOLWHIP) {
        animName = "KO_spin_R";
        playerDeath(editable.player, animLib, animName);
      } else if (
        editable.weaponId === WC_WeaponEnum.CARPARK ||
        (isMeleeWeapon(editable.weaponId) &&
          editable.weaponId !== WC_WeaponEnum.CHAINSAW)
      ) {
        animName = "KO_skid_front";
        playerDeath(editable.player, animLib, animName);
      } else if (
        editable.weaponId === WC_WeaponEnum.SPRAYCAN ||
        editable.weaponId === WC_WeaponEnum.FIREEXTINGUISHER
      ) {
        animLib = "KNIFE";
        animName = "KILL_Knife_Ped_Die";
        playerDeath(editable.player, animLib, animName);
      } else {
        animName = "KO_skid_back";
        playerDeath(editable.player, animLib, animName);
      }
    }

    if (cBugAllowed.get(editable.player.id)) {
      useTrigger("OnPlayerDeath")!(
        withTriggerOptions({
          skipToNext: internalPlayerDeath,
          args: [
            editable.player.id,
            typeof editable.issuerId === "number"
              ? editable.issuerId
              : editable.issuerId.id,
            editable.weaponId,
          ],
        }),
      );
    } else {
      if (delayedDeathTimer.get(editable.player.id)) {
        clearTimeout(delayedDeathTimer.get(editable.player.id)!);
      }

      delayedDeathTimer.set(
        editable.player.id,
        setTimeout(() => {
          wc_DelayedDeath(
            editable.player,
            editable.issuerId,
            editable.weaponId,
          );
        }, 1200),
      );
    }
  }

  updateHealthBar(editable.player, true);
}
