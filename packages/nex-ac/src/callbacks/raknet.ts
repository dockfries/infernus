import {
  BulletHitTypesEnum,
  InvalidEnum,
  LimitsEnum,
  Player,
  PlayerStateEnum,
  SpecialActionsEnum,
  Vehicle,
  WeaponEnum,
} from "@infernus/core";
import {
  AimSync,
  BulletSync,
  InCarSync,
  IPacket,
  IRPC,
  OnFootSync,
  onIncomingPacket,
  onIncomingRPC,
  PacketRpcValueType,
  PassengerSync,
  TrailerSync,
  UnoccupiedSync,
} from "@infernus/raknet";
import { ACInfo, ACVehInfo } from "../struct";
import {
  ac_GetSpeed,
  ac_GetVectorDist,
  ac_IsValidFloat,
  setVehicleFakePosForPlayer,
  setVehicleFakeZAngleForPlayer,
} from "../functions";
import { innerACConfig } from "../config";
import { ac_KickWithCode } from "./trigger";

onIncomingPacket(({ playerId, next }) => {
  if (ACInfo.get(playerId).acKicked > 0 && ACInfo.get(playerId).acOnline)
    return false;
  return next();
});

onIncomingRPC(({ playerId, rpcId, next }) => {
  if (ACInfo.get(playerId).acKicked > 0 && ACInfo.get(playerId).acOnline)
    return false;
  if (rpcId === 31 || rpcId === 97) return false;
  if (ACInfo.get(playerId).acKicked > 0 && ACInfo.get(playerId).acOnline)
    return false;
  return next();
});

const AC_DRIVER_SYNC = 200;

IPacket(AC_DRIVER_SYNC, ({ playerId, bs, next }) => {
  const syncBs = new InCarSync(bs);
  const ac_cData = syncBs.readSync()!;
  if (
    !(
      ac_cData.vehicleId >= 1 && ac_cData.vehicleId < LimitsEnum.MAX_VEHICLES
    ) ||
    !Vehicle.getInstance(ac_cData.vehicleId)!.isStreamedIn(
      Player.getInstance(playerId)!,
    ) ||
    !ac_IsValidFloat(ac_cData.quaternion[0]) ||
    !ac_IsValidFloat(ac_cData.quaternion[1]) ||
    !ac_IsValidFloat(ac_cData.quaternion[2]) ||
    !ac_IsValidFloat(ac_cData.quaternion[3]) ||
    !ac_IsValidFloat(ac_cData.vehicleHealth)
  )
    return false;
  const trailer = Vehicle.getInstance(ac_cData.trailerId);
  if (
    ac_cData.trailerId !== 0 &&
    (!trailer ||
      trailer.getModel() <= 0 ||
      !trailer.isStreamedIn(Player.getInstance(playerId)!))
  ) {
    ac_cData.trailerId = 0;
    syncBs.writeSync(ac_cData);
  }
  if (!ac_IsValidFloat(ac_cData.trainSpeed)) {
    ac_cData.trainSpeed = 0.0;
    syncBs.writeSync(ac_cData);
  }
  return next();
});

const AC_AIM_SYNC = 203;

IPacket(AC_AIM_SYNC, ({ playerId, bs, next }) => {
  const syncBs = new AimSync(bs);
  const ac_aData = syncBs.readSync()!;
  if (
    [
      3, 7, 8, 14, 15, 16, 18, 22, 29, 46, 47, 51, 53, 55, 56, 57, 58, 59, 62,
      63, 64,
    ].includes(ac_aData.camMode)
  ) {
    if (ACInfo.get(playerId).acLastWeapon === WeaponEnum.BOMB) {
      ac_aData.camMode = 4;
      syncBs.writeSync(ac_aData);
    }
  } else {
    if (ac_aData.camMode !== 4) {
      ac_aData.camMode = 4;
      syncBs.writeSync(ac_aData);
    }
  }
  if (!ac_IsValidFloat(ac_aData.aimZ)) {
    ac_aData.aimZ = 0.0;
    syncBs.writeSync(ac_aData);
  }
  ACInfo.get(playerId).acCamMode = ac_aData.camMode;
  return next();
});

const AC_BULLET_SYNC = 206;

IPacket(AC_BULLET_SYNC, ({ playerId, bs, next }) => {
  const syncBs = new BulletSync(bs);
  const ac_bData = syncBs.readSync()!;
  if (
    ac_bData.offsets[0] !== ac_bData.offsets[0] ||
    ac_bData.offsets[1] !== ac_bData.offsets[1] ||
    ac_bData.offsets[2] !== ac_bData.offsets[2]
  )
    return false;
  switch (ac_bData.hitType) {
    case BulletHitTypesEnum.PLAYER:
      {
        if (
          ac_bData.hitId === playerId ||
          Math.abs(ac_bData.offsets[0]) > 10.0 ||
          Math.abs(ac_bData.offsets[1]) > 10.0 ||
          Math.abs(ac_bData.offsets[2]) > 10.0
        )
          return false;
      }
      break;
    case BulletHitTypesEnum.VEHICLE:
      {
        if (
          Math.abs(ac_bData.offsets[0]) > 300.0 ||
          Math.abs(ac_bData.offsets[1]) > 300.0 ||
          Math.abs(ac_bData.offsets[2]) > 300.0
        )
          return false;
      }
      break;
    case BulletHitTypesEnum.OBJECT:
    case BulletHitTypesEnum.PLAYER_OBJECT:
      {
        if (
          Math.abs(ac_bData.offsets[0]) > 1000.0 ||
          Math.abs(ac_bData.offsets[1]) > 1000.0 ||
          Math.abs(ac_bData.offsets[2]) > 1000.0
        )
          return false;
      }
      break;
    default: {
      if (
        Math.abs(ac_bData.offsets[0]) > 20000.0 ||
        Math.abs(ac_bData.offsets[1]) > 20000.0 ||
        Math.abs(ac_bData.offsets[2]) > 20000.0
      )
        return false;
    }
  }
  return next();
});

const AC_ONFOOT_SYNC = 207;

IPacket(AC_ONFOOT_SYNC, ({ playerId, bs, next }) => {
  const syncBs = new OnFootSync(bs);
  const ac_fData = syncBs.readSync()!;
  if (
    !ac_IsValidFloat(ac_fData.quaternion[0]) ||
    !ac_IsValidFloat(ac_fData.quaternion[1]) ||
    !ac_IsValidFloat(ac_fData.quaternion[2]) ||
    !ac_IsValidFloat(ac_fData.quaternion[3])
  )
    return false;
  if (
    !ac_IsValidFloat(ac_fData.surfingOffsets[0]) ||
    !ac_IsValidFloat(ac_fData.surfingOffsets[1]) ||
    !ac_IsValidFloat(ac_fData.surfingOffsets[2])
  ) {
    ac_fData.surfingOffsets[0] =
      ac_fData.surfingOffsets[1] =
      ac_fData.surfingOffsets[2] =
        0.0;
    ac_fData.surfingVehicleId = 0;
    syncBs.writeSync(ac_fData);
  } else if (
    ac_fData.surfingVehicleId !== 0 &&
    ac_fData.surfingOffsets[0] === 0.0 &&
    ac_fData.surfingOffsets[1] === 0.0 &&
    ac_fData.surfingOffsets[2] === 0.0
  ) {
    ac_fData.surfingVehicleId = 0;
    syncBs.writeSync(ac_fData);
  }
  const ac_gtc = Date.now();
  if (
    (ac_fData.specialAction === SpecialActionsEnum.ENTER_VEHICLE &&
      ac_gtc - ACInfo.get(playerId).acEnterVehTick > 3850) ||
    (ac_fData.specialAction === SpecialActionsEnum.EXIT_VEHICLE &&
      ACInfo.get(playerId).acVeh === 0 &&
      ac_gtc - ACInfo.get(playerId).acGtc[15] > 1350)
  ) {
    ac_fData.specialAction = 0;
    syncBs.writeSync(ac_fData);
  }
  if (
    ac_fData.weaponId === WeaponEnum.BOMB &&
    ACInfo.get(playerId).acCamMode !== 4
  ) {
    ac_fData.weaponId = 0;
    syncBs.writeSync(ac_fData);
  }
  return next();
});

const AC_UNOCCUPIED_SYNC = 209;

IPacket(AC_UNOCCUPIED_SYNC, ({ playerId, bs, next }) => {
  const syncBs = new UnoccupiedSync(bs);
  const ac_uData = syncBs.readSync()!;
  if (
    (ac_uData.seatId > 0 &&
      (ac_uData.vehicleId !== ACInfo.get(playerId).acVeh ||
        ac_uData.seatId !== ACInfo.get(playerId).acSeat)) ||
    !ac_IsValidFloat(ac_uData.roll[0]) ||
    !ac_IsValidFloat(ac_uData.roll[1]) ||
    !ac_IsValidFloat(ac_uData.roll[2]) ||
    !ac_IsValidFloat(ac_uData.direction[0]) ||
    !ac_IsValidFloat(ac_uData.direction[1]) ||
    !ac_IsValidFloat(ac_uData.direction[2]) ||
    ac_uData.angularVelocity[0] !== ac_uData.angularVelocity[0] ||
    ac_uData.angularVelocity[1] !== ac_uData.angularVelocity[1] ||
    ac_uData.angularVelocity[2] !== ac_uData.angularVelocity[2] ||
    !ac_IsValidFloat(ac_uData.vehicleHealth) ||
    Math.abs(ac_uData.angularVelocity[0]) >= 1.0 ||
    Math.abs(ac_uData.angularVelocity[1]) >= 1.0 ||
    Math.abs(ac_uData.angularVelocity[2]) >= 1.0
  )
    return false;
  if (
    Math.abs(
      ac_uData.roll[0] * ac_uData.direction[0] +
        ac_uData.roll[1] * ac_uData.direction[1] +
        ac_uData.roll[2] * ac_uData.direction[2],
    ) >= 0.000001 ||
    Math.abs(
      1.0 -
        ac_GetVectorDist(
          ac_uData.direction[0],
          ac_uData.direction[1],
          ac_uData.direction[2],
        ),
    ) >= 0.000001 ||
    Math.abs(
      1.0 -
        ac_GetVectorDist(ac_uData.roll[0], ac_uData.roll[1], ac_uData.roll[2]),
    ) >= 0.000001
  )
    return false;
  return next();
});

const AC_TRAILER_SYNC = 210;

IPacket(AC_TRAILER_SYNC, ({ playerId, bs, next }) => {
  const syncBs = new TrailerSync(bs);
  const ac_tData = syncBs.readSync()!;
  const trailerId = ac_tData.trailerId;
  if (
    !(trailerId >= 1 && trailerId < LimitsEnum.MAX_VEHICLES) ||
    ACVehInfo.get(trailerId)!.acDriver !== InvalidEnum.PLAYER_ID ||
    !ac_IsValidFloat(ac_tData.quaternion[0]) ||
    !ac_IsValidFloat(ac_tData.quaternion[1]) ||
    !ac_IsValidFloat(ac_tData.quaternion[2]) ||
    !ac_IsValidFloat(ac_tData.quaternion[3]) ||
    ac_tData.angularVelocity[0] !== ac_tData.angularVelocity[0] ||
    ac_tData.angularVelocity[1] !== ac_tData.angularVelocity[1] ||
    ac_tData.angularVelocity[2] !== ac_tData.angularVelocity[2] ||
    Math.abs(ac_tData.angularVelocity[0]) >= 1.0 ||
    Math.abs(ac_tData.angularVelocity[1]) >= 1.0 ||
    Math.abs(ac_tData.angularVelocity[2]) >= 1.0
  )
    return false;
  if (
    ACInfo.get(playerId).acACAllow[31] &&
    ((Math.abs(ac_tData.velocity[0] - ACVehInfo.get(trailerId)!.acVelX) >=
      2.6 &&
      Math.abs(ac_tData.velocity[0]) >=
        Math.abs(ACVehInfo.get(trailerId)!.acVelX)) ||
      (Math.abs(ac_tData.velocity[1] - ACVehInfo.get(trailerId)!.acVelY) >=
        2.6 &&
        Math.abs(ac_tData.velocity[1]) >=
          Math.abs(ACVehInfo.get(trailerId)!.acVelY)) ||
      (Math.abs(ac_tData.velocity[2] - ACVehInfo.get(trailerId)!.acVelZ) >=
        2.6 &&
        Math.abs(ac_tData.velocity[2]) >=
          Math.abs(ACVehInfo.get(trailerId)!.acVelZ)))
  ) {
    if (innerACConfig.DEBUG) {
      console.log(
        `[Nex-AC DEBUG] Pos x, y, z: ${ac_tData.position[0]}, ${ac_tData.position[1]}, ${ac_tData.position[2]}, vel x, y, z: ${ac_tData.velocity[0]}, ${ac_tData.velocity[1]}, ${ac_tData.velocity[2]}`,
      );
    }
    return ac_KickWithCode(Player.getInstance(playerId)!, "", 0, 31, 3);
  }
  const ac_dist = Vehicle.getInstance(trailerId)!.getDistanceFromPoint(
    ac_tData.position[0],
    ac_tData.position[1],
    ac_tData.position[2],
  );
  let ac_tmp = Vehicle.getInstance(
    ACInfo.get(playerId).acVeh,
  )!.getDistanceFromPoint(
    ac_tData.position[0],
    ac_tData.position[1],
    ac_tData.position[2],
  );
  if (
    ACInfo.get(playerId).acACAllow[5] &&
    (ac_dist >= 80.0 || ac_tmp >= 40.0)
  ) {
    const {
      x: ac_x,
      y: ac_y,
      z: ac_z,
    } = Vehicle.getInstance(trailerId)!.getPos();
    if (innerACConfig.DEBUG) {
      console.log(
        `[Nex-AC DEBUG] Dist: ${ac_dist}, truck dist: ${ac_tmp}, old pos z: ${ac_z}, veh: ${trailerId}, playerId: ${playerId}`,
      );
    }
    ac_KickWithCode(Player.getInstance(playerId)!, "", 0, 5, 2);
    ACVehInfo.get(trailerId)!.acZAngle =
      Vehicle.getInstance(trailerId)!.getZAngle();
    if (
      Vehicle.getInstance(trailerId)!.isStreamedIn(
        Player.getInstance(playerId)!,
      )
    ) {
      setVehicleFakeZAngleForPlayer(
        Player.getInstance(playerId)!,
        Vehicle.getInstance(trailerId)!,
        ACVehInfo.get(trailerId)!.acZAngle,
      );
      setVehicleFakePosForPlayer(
        Player.getInstance(playerId)!,
        Vehicle.getInstance(trailerId)!,
        ac_x,
        ac_y,
        ac_z,
      );
    }
    return false;
  }
  ac_tmp = Math.sqrt(
    Math.pow(ac_tData.quaternion[0], 2.0) +
      Math.pow(ac_tData.quaternion[1], 2.0) +
      Math.pow(ac_tData.quaternion[2], 2.0) +
      Math.pow(ac_tData.quaternion[3], 2.0),
  );
  if (Math.abs(1.0 - ac_tmp) >= 0.000001) {
    if (ac_tmp < 0.1) {
      ac_tData.quaternion[0] =
        ac_tData.quaternion[1] =
        ac_tData.quaternion[2] =
        ac_tData.quaternion[3] =
          0.5;
    } else {
      ac_tData.quaternion[0] /= ac_tmp;
      ac_tData.quaternion[1] /= ac_tmp;
      ac_tData.quaternion[2] /= ac_tmp;
      ac_tData.quaternion[3] /= ac_tmp;
    }
    syncBs.writeSync(ac_tData);
  }
  const ac_vsp = ac_GetSpeed(
    ac_tData.velocity[0],
    ac_tData.velocity[1],
    ac_tData.velocity[2],
  );
  ACVehInfo.get(trailerId)!.acTrPosDiff = ac_dist;
  ACVehInfo.get(trailerId)!.acTrSpeedDiff =
    ac_vsp - ACVehInfo.get(trailerId)!.acSpeed;
  ACVehInfo.get(trailerId)!.acTrPosX = ac_tData.position[0];
  ACVehInfo.get(trailerId)!.acTrPosY = ac_tData.position[1];
  ACVehInfo.get(trailerId)!.acTrPosZ = ac_tData.position[2];
  ACVehInfo.get(trailerId)!.acTrVelX = ac_tData.velocity[0];
  ACVehInfo.get(trailerId)!.acTrVelY = ac_tData.velocity[1];
  ACVehInfo.get(trailerId)!.acTrVelZ = ac_tData.velocity[2];
  ACVehInfo.get(trailerId)!.acTrSpeed = ac_vsp;
  return next();
});

const AC_PASSENGER_SYNC = 211;

IPacket(AC_PASSENGER_SYNC, ({ bs, next }) => {
  const syncBs = new PassengerSync(bs);
  const ac_pData = syncBs.readSync()!;
  if (
    ac_pData.seatId < 1 ||
    ac_pData.seatId === 63 ||
    !(ac_pData.vehicleId >= 1 && ac_pData.vehicleId < LimitsEnum.MAX_VEHICLES)
  )
    return false;
  return next();
});

const AC_RPC_RequestClass = 128;

IRPC(AC_RPC_RequestClass, ({ playerId, next }) => {
  if (!ACInfo.get(playerId).acForceClass) {
    const ac_i = Player.getInstance(playerId)!.getState();
    if (
      (ac_i >= PlayerStateEnum.ONFOOT && ac_i < PlayerStateEnum.WASTED) ||
      ac_i === PlayerStateEnum.SPAWNED
    )
      return false;
  }
  return next();
});

const AC_RPC_DamageVehicle = 106;

IRPC(AC_RPC_DamageVehicle, ({ playerId, bs, next }) => {
  const vehicleId = bs.readValue(PacketRpcValueType.UInt16) as number;
  const veh = Vehicle.getInstance(vehicleId);
  if (
    !veh ||
    veh.getModel() <= 0 ||
    ACVehInfo.get(vehicleId)!.acDriver !== playerId
  )
    return false;
  return next();
});
