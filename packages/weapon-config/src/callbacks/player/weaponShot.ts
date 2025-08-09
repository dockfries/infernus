import {
  PlayerEvent,
  Player,
  GameMode,
  Vehicle,
  InvalidEnum,
  BulletHitTypesEnum,
  LimitsEnum,
  WeaponEnum,
} from "@infernus/core";
import { innerWeaponConfig, innerGameModeConfig } from "../../config";
import {
  s_WeaponRange,
  s_MaxWeaponShootRate,
  s_WeaponDamage,
} from "../../constants";
import { RejectedReasonEnum } from "../../enums";
import { orig_playerMethods, orig_vehicleMethods } from "../../hooks/origin";
import {
  vendingUseTimer,
  lastShot,
  cBugFroze,
  beingResynced,
  lastDeathTick,
  lastShotIdx,
  lastShotTicks,
  lastShotWeapons,
  shotsFired,
  vehicleRespawnTimer,
  lastVehicleShooter,
} from "../../struct";
import { debugMessage } from "../../utils/debug";
import { wc_KillVehicle } from "../vehicle";
import { addRejectedHit } from "../../functions/internal/damage";
import { isBulletWeapon, wc_IsPlayerSpawned } from "../../functions/public/is";
import { averageShootRate } from "../../functions/public/get";

PlayerEvent.onWeaponShot(
  ({ player, weapon, hitType, hitId, fX, fY, fZ, next }) => {
    if (innerWeaponConfig.CUSTOM_VENDING_MACHINES) {
      if (vendingUseTimer.get(player.id)) {
        clearTimeout(vendingUseTimer.get(player.id)!);
        vendingUseTimer.set(player.id, null);
      }
    }

    lastShot.get(player.id).valid = false;

    let tick = Date.now();
    if (tick === 0) tick = 1;

    if (cBugFroze.get(player.id) && tick - cBugFroze.get(player.id) < 900) {
      return 0;
    }

    cBugFroze.set(player.id, 0);

    let damagedId: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID;

    if (
      hitType === BulletHitTypesEnum.PLAYER &&
      hitId !== InvalidEnum.PLAYER_ID
    ) {
      if (!orig_playerMethods.isConnected.call(Player.getInstance(hitId))) {
        addRejectedHit(
          player,
          hitId,
          RejectedReasonEnum.HIT_DISCONNECTED,
          weapon,
          hitId,
        );
        return 0;
      }

      damagedId = Player.getInstance(hitId)!;
    }

    if (
      hitType < BulletHitTypesEnum.NONE ||
      hitType > BulletHitTypesEnum.PLAYER_OBJECT
    ) {
      addRejectedHit(
        player,
        damagedId,
        RejectedReasonEnum.HIT_INVALID_HITTYPE,
        weapon,
        hitType,
      );

      return 0;
    }

    if (innerWeaponConfig.DEBUG) {
      if (hitType === BulletHitTypesEnum.PLAYER) {
        debugMessage(
          player,
          `OnPlayerWeaponShot(${player.id} shot ${hitId} with ${weapon} at ${fX}, ${fY}, ${fZ})`,
        );
      } else if (hitType) {
        debugMessage(
          player,
          `OnPlayerWeaponShot(${player.id} shot ${hitType} ${hitId} with ${weapon} at ${fX}, ${fY}, ${fZ})`,
        );
      } else {
        debugMessage(
          player,
          `OnPlayerWeaponShot(${player.id} shot with ${weapon} at ${fX}, ${fY}, ${fZ})`,
        );
      }
    }

    if (beingResynced.get(player.id)) {
      addRejectedHit(
        player,
        damagedId,
        RejectedReasonEnum.HIT_BEING_RESYNCED,
        weapon,
      );
      return 0;
    }

    if (
      !wc_IsPlayerSpawned(player) &&
      tick - lastDeathTick.get(player.id) > 80
    ) {
      addRejectedHit(
        player,
        damagedId,
        RejectedReasonEnum.HIT_NOT_SPAWNED,
        weapon,
      );
      return 0;
    }

    if (!isBulletWeapon(weapon)) {
      addRejectedHit(
        player,
        damagedId,
        RejectedReasonEnum.HIT_INVALID_WEAPON,
        weapon,
      );

      return 0;
    }

    const { x, y, z } = orig_playerMethods.getPos.call(player)!;
    const { fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ } =
      orig_playerMethods.getLastShotVectors.call(player);

    const length = GameMode.vectorSize(
      fOriginX - fHitPosX,
      fOriginY - fHitPosY,
      fOriginZ - fHitPosZ,
    );
    const origin_dist = GameMode.vectorSize(
      fOriginX - x,
      fOriginY - y,
      fOriginZ - z,
    );

    if (origin_dist > 15.0) {
      const suf_veh = orig_playerMethods.getSurfingVehicle.call(player);

      const in_veh =
        orig_playerMethods.isInAnyVehicle.call(player) ||
        (suf_veh && suf_veh.id !== InvalidEnum.VEHICLE_ID);

      const suf_obj = orig_playerMethods.getSurfingObject.call(player);

      if (
        (!in_veh && (!suf_obj || suf_obj.id === InvalidEnum.OBJECT_ID)) ||
        origin_dist > 50.0
      ) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.HIT_TOO_FAR_FROM_ORIGIN,
          weapon,
          origin_dist,
        );

        return 0;
      }
    }

    if (hitType !== BulletHitTypesEnum.NONE) {
      if (length > s_WeaponRange[weapon]) {
        if (hitType === BulletHitTypesEnum.PLAYER) {
          addRejectedHit(
            player,
            damagedId,
            RejectedReasonEnum.HIT_OUT_OF_RANGE,
            weapon,
            length,
            s_WeaponRange[weapon],
          );
        }

        return 0;
      }

      if (hitType === BulletHitTypesEnum.PLAYER) {
        if (
          orig_playerMethods.isInAnyVehicle.call(player) &&
          orig_playerMethods.getVehicle.call(player) ===
            orig_playerMethods.getVehicle.call(Player.getInstance(hitId)!)
        ) {
          addRejectedHit(
            player,
            damagedId,
            RejectedReasonEnum.HIT_SAME_VEHICLE,
            weapon,
          );
          return 0;
        }

        const dist = orig_playerMethods.getDistanceFromPoint.call(
          Player.getInstance(hitId)!,
          fHitPosX,
          fHitPosY,
          fHitPosZ,
        );
        const suf_veh = orig_playerMethods.getSurfingVehicle.call(
          Player.getInstance(hitId)!,
        );
        const in_veh =
          orig_playerMethods.isInAnyVehicle.call(Player.getInstance(hitId)!) ||
          (suf_veh && suf_veh.id !== InvalidEnum.VEHICLE_ID);

        if (dist > 20.0) {
          const suf_obj = orig_playerMethods.getSurfingObject.call(
            Player.getInstance(hitId)!,
          );
          if (
            (!in_veh && (!suf_obj || suf_obj.id === InvalidEnum.OBJECT_ID)) ||
            dist > 50.0
          ) {
            addRejectedHit(
              player,
              damagedId,
              RejectedReasonEnum.HIT_TOO_FAR_FROM_SHOT,
              weapon,
              dist,
            );

            return 0;
          }
        }
      }
    }

    let idx =
      (lastShotIdx.get(player.id) + 1) % lastShotTicks.get(player.id).length;

    if (idx < 0) {
      idx += lastShotTicks.get(player.id).length;
    }

    lastShotIdx.set(player.id, idx);
    lastShotTicks.get(player.id)[idx] = tick;
    lastShotWeapons.get(player.id)[idx] = weapon;
    shotsFired.set(player.id, shotsFired.get(player.id) + 1);

    if (innerWeaponConfig.DEBUG) {
      if (shotsFired.get(player.id) > 1) {
        let prev_tick_idx = (idx - 1) % lastShotTicks.get(player.id).length;

        if (prev_tick_idx < 0) {
          prev_tick_idx += lastShotTicks.get(player.id).length;
        }

        const prev_tick = lastShotTicks.get(player.id)[prev_tick_idx];

        debugMessage(
          player,
          `(shot) last: ${tick - prev_tick} last 3: ${averageShootRate(player, 3).ret}`,
        );
      }
    }

    lastShot.get(player.id).tick = tick;
    lastShot.get(player.id).weapon = weapon as number;
    lastShot.get(player.id).hitType = hitType;
    lastShot.get(player.id).hitId = hitId;
    lastShot.get(player.id).x = fX;
    lastShot.get(player.id).y = fY;
    lastShot.get(player.id).z = fZ;
    lastShot.get(player.id).oX = fOriginX;
    lastShot.get(player.id).oY = fOriginY;
    lastShot.get(player.id).oZ = fOriginZ;
    lastShot.get(player.id).hX = fHitPosX;
    lastShot.get(player.id).hY = fHitPosY;
    lastShot.get(player.id).hZ = fHitPosZ;
    lastShot.get(player.id).length = length;
    lastShot.get(player.id).hits = 0;

    const { multiple_weapons, ret: avg_rate } = averageShootRate(
      player,
      innerGameModeConfig.maxShootRateSamples,
    );

    if (avg_rate !== -1) {
      if (multiple_weapons) {
        if (avg_rate < 100) {
          addRejectedHit(
            player,
            damagedId,
            RejectedReasonEnum.SHOOTING_RATE_TOO_FAST_MULTIPLE,
            weapon,
            avg_rate,
            innerGameModeConfig.maxShootRateSamples,
          );
          return 0;
        }
      } else if (s_MaxWeaponShootRate[weapon] - avg_rate > 20) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.SHOOTING_RATE_TOO_FAST,
          weapon,
          avg_rate,
          innerGameModeConfig.maxShootRateSamples,
          s_MaxWeaponShootRate[weapon],
        );
        return 0;
      }
    }

    if (hitType === BulletHitTypesEnum.VEHICLE) {
      if (
        hitId < 0 ||
        hitId > LimitsEnum.MAX_VEHICLES ||
        !Vehicle.getInstance(hitId) ||
        !orig_vehicleMethods.isValid.call(Vehicle.getInstance(hitId))
      ) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.HIT_INVALID_VEHICLE,
          weapon,
          hitId,
        );
        return 0;
      }

      if (
        !orig_vehicleMethods.isStreamedIn.call(
          Vehicle.getInstance(hitId)!,
          player,
        )
      ) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.HIT_UNSTREAMED,
          weapon,
          hitId,
        );
        return 0;
      }

      const vehicle = orig_playerMethods.getVehicle.call(player);

      if (!vehicle || hitId === vehicle.id) {
        addRejectedHit(
          player,
          damagedId,
          RejectedReasonEnum.HIT_OWN_VEHICLE,
          weapon,
        );
        return 0;
      }

      if (innerGameModeConfig.vehiclePassengerDamage) {
        let has_driver = false,
          has_passenger = false,
          seat;

        Player.getInstances().forEach((other) => {
          if (other === player) {
            return;
          }

          const veh = orig_playerMethods.getVehicle.call(other);

          if (veh && veh.id !== hitId) {
            return;
          }

          seat = orig_playerMethods.getVehicleSeat.call(other);

          if (seat === 0) {
            has_driver = true;
          } else {
            has_passenger = true;
          }
        });

        if (!has_driver && has_passenger) {
          let health = orig_vehicleMethods.getHealth.call(
            Vehicle.getInstance(hitId)!,
          ).health;

          if (weapon >= WeaponEnum.SHOTGUN && weapon <= WeaponEnum.SHOTGSPA) {
            health -= 120.0;
          } else {
            health -= s_WeaponDamage[weapon] * 3.0;
          }

          if (health <= 0.0) {
            health = 0.0;
          }

          orig_vehicleMethods.setHealth.call(
            Vehicle.getInstance(hitId)!,
            health,
          );
        }
      }

      if (innerGameModeConfig.vehicleUnoccupiedDamage) {
        let has_occupant = false;

        Player.getInstances().forEach((other) => {
          if (other === player) {
            return;
          }

          const veh = orig_playerMethods.getVehicle.call(other);

          if (veh && veh.id !== hitId) {
            return;
          }

          has_occupant = true;
        });

        if (!has_occupant) {
          let health = orig_vehicleMethods.getHealth.call(
            Vehicle.getInstance(hitId),
          ).health;

          if (health >= 250.0) {
            if (weapon >= WeaponEnum.SHOTGUN && weapon <= WeaponEnum.SHOTGSPA) {
              health -= 120.0;
            } else {
              health -= s_WeaponDamage[weapon] * 3.0;
            }

            if (health < 250.0) {
              if (!vehicleRespawnTimer.get(hitId)) {
                health = 249.0;
                vehicleRespawnTimer.set(
                  hitId,
                  setTimeout(() => {
                    wc_KillVehicle(Vehicle.getInstance(hitId)!, player);
                  }, 6000),
                );
              }
            }

            orig_vehicleMethods.setHealth.call(
              Vehicle.getInstance(hitId)!,
              health,
            );
          }
        }
      }
    }

    const retVal = next();

    lastShot.get(player.id).valid = !!retVal;

    if (retVal) {
      if (hitType === BulletHitTypesEnum.VEHICLE) {
        lastVehicleShooter.set(hitId, player.id);
      }
    }
    return retVal;
  },
);
