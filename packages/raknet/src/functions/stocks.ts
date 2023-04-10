import { PR_MAX_WEAPON_SLOTS } from "@/defines";
import { PR_PacketPriority, PR_PacketReliability, PR_ValueType } from "@/enums";
import {
  IAimSync,
  IBulletSync,
  IInCarSync,
  IMarkersSync,
  IOnFootSync,
  IPassengerSync,
  IRconCommand,
  ISpectatingSync,
  IStatsUpdate,
  ITrailerSync,
  IUnoccupiedSync,
  IWeaponsUpdate,
} from "@/interfaces";
import { BitStream, Vector3 } from "@/types";
import { InvalidEnum, LimitsEnum, Player, Vehicle } from "@infernus/core";
import {
  BS_ReadCompressedBool,
  BS_ReadInt32,
  BS_ReadUint16,
  BS_WriteInt32,
} from "./macros";
import {
  BS_GetNumberOfBytesUsed,
  BS_ReadValue,
  BS_WriteValue,
  PR_SendPacket,
  PR_SendRPC,
} from "./natives";

export function BS_PackAspectRatio(value: number) {
  return Math.round((value - 1.0) * 255.0);
}

export function BS_UnpackAspectRatio(value: number): number {
  return value / 255.0 + 1.0;
}

export function BS_PackCameraZoom(value: number) {
  return Math.round(((value - 35.0) / 35.0) * 63.0);
}

export function BS_UnpackCameraZoom(value: number) {
  return (value / 63.0) * 35.0 + 35.0;
}

export function BS_PackHealthArmour(health: number, armour: number) {
  let healthArmour;
  if (health > 0 && health < 100) {
    healthArmour = (health / 7) << 4;
  } else if (health >= 100) {
    healthArmour = 0xf0; // 0xF << 4
  } else {
    healthArmour = 0;
  }

  if (armour > 0 && armour < 100) {
    healthArmour |= armour / 7;
  } else if (armour >= 100) {
    healthArmour |= 0xf;
  }
  return healthArmour;
}

export function BS_UnpackHealthArmour(healthArmour: number) {
  let health, armour;

  health = healthArmour >> 4;
  if (health == 0xf) {
    health = 100;
  } else {
    health *= 7;
  }

  armour = healthArmour & 0xf;
  if (armour == 0xf) {
    armour = 100;
  } else {
    armour *= 7;
  }
  return { health, armour };
}

export function BS_ReadOnFootSync(bs: BitStream, outgoing = false) {
  const data: Partial<IOnFootSync> = {
    lrKey: 0,
    udKey: 0,
    surfingVehicleId: 0,
    animationId: 0,
    animationFlags: 0,
  };

  if (outgoing) {
    const hasLeftRight = BS_ReadValue(bs, PR_ValueType.BOOL);

    if (hasLeftRight) {
      data.lrKey = BS_ReadValue(bs, PR_ValueType.UINT16) as number;
    }

    const hasUpDown = BS_ReadValue(bs, PR_ValueType.BOOL);

    if (hasUpDown) {
      data.udKey = BS_ReadValue(bs, PR_ValueType.UINT16) as number;
    }

    let healthArmour: number, hasSurfInfo: number;

    [
      data.keys,
      data.position,
      data.quaternion,
      healthArmour,
      data.weaponId,
      data.specialAction,
      data.velocity,
      hasSurfInfo,
    ] = BS_ReadValue(
      bs,
      PR_ValueType.UINT16,
      PR_ValueType.FLOAT3,
      PR_ValueType.NORM_QUAT,
      PR_ValueType.UINT8,
      PR_ValueType.UINT8,
      PR_ValueType.UINT8,
      PR_ValueType.VECTOR,
      PR_ValueType.BOOL
    ) as any;

    const { health, armour } = BS_UnpackHealthArmour(healthArmour as number);
    data.health = health;
    data.armour = armour;

    if (hasSurfInfo) {
      [data.surfingVehicleId, data.surfingOffsets] = BS_ReadValue(
        bs,
        PR_ValueType.UINT16,
        PR_ValueType.FLOAT3
      ) as any;
    }

    const hasAnimation = BS_ReadValue(bs, PR_ValueType.BOOL);

    if (hasAnimation) {
      [data.animationId, data.animationFlags] = BS_ReadValue(
        bs,
        PR_ValueType.INT16,
        PR_ValueType.INT16
      ) as any;
    }
  } else {
    [
      data.lrKey,
      data.udKey,
      data.keys,
      data.position,
      data.quaternion,
      data.health,
      data.armour,
      data.additionalKey,
      data.weaponId,
      data.specialAction,
      data.velocity,
      data.surfingOffsets,
      data.surfingVehicleId,
      data.animationId,
      data.animationFlags,
    ] = BS_ReadValue(
      bs,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT4,
      PR_ValueType.UINT8,
      PR_ValueType.UINT8,
      [PR_ValueType.BITS, 2],
      [PR_ValueType.BITS, 6],
      PR_ValueType.UINT8,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.UINT16,
      PR_ValueType.INT16,
      PR_ValueType.INT16
    ) as any;
  }
  return data as IOnFootSync;
}

export function BS_ReadInCarSync(bs: BitStream, outgoing = false) {
  const data: Partial<IInCarSync> = {
    trainSpeed: 0.0,
    trailerId: 0,
  };

  if (outgoing) {
    let healthArmour;

    [
      data.vehicleId,
      data.lrKey,
      data.udKey,
      data.keys,
      data.quaternion,
      data.position,
      data.velocity,
      data.vehicleHealth,
      healthArmour,
      data.weaponId,
      data.sirenState,
      data.landingGearState,
    ] = BS_ReadValue(
      bs,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.NORM_QUAT,
      PR_ValueType.FLOAT3,
      PR_ValueType.VECTOR,
      PR_ValueType.UINT16,
      PR_ValueType.UINT8,
      PR_ValueType.UINT8,
      PR_ValueType.BOOL,
      PR_ValueType.BOOL
    ) as any;

    data.vehicleHealth = data.vehicleHealth ? +data.vehicleHealth : 0;

    const { health, armour } = BS_UnpackHealthArmour(healthArmour);

    data.playerHealth = health;
    data.armour = armour;

    const hasTrainSpeed = BS_ReadValue(bs, PR_ValueType.BOOL);

    if (hasTrainSpeed) {
      data.trainSpeed = BS_ReadValue(bs, PR_ValueType.FLOAT) as number;
    }

    const hasTrailer = BS_ReadValue(bs, PR_ValueType.BOOL);

    if (hasTrailer) {
      data.trailerId = BS_ReadValue(bs, PR_ValueType.UINT16) as number;
    }
  } else {
    [
      data.vehicleId,
      data.lrKey,
      data.udKey,
      data.keys,
      data.quaternion,
      data.position,
      data.velocity,
      data.vehicleHealth,
      data.playerHealth,
      data.armour,
      data.additionalKey,
      data.weaponId,
      data.sirenState,
      data.landingGearState,
      data.trailerId,
      data.trainSpeed,
    ] = BS_ReadValue(
      bs,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.UINT16,
      PR_ValueType.FLOAT4,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT3,
      PR_ValueType.FLOAT,
      PR_ValueType.UINT8,
      PR_ValueType.UINT8,
      [PR_ValueType.BITS, 2],
      [PR_ValueType.BITS, 6],
      PR_ValueType.UINT8,
      PR_ValueType.UINT8,
      PR_ValueType.UINT16,
      PR_ValueType.FLOAT
    ) as any;
  }
}

export function BS_ReadTrailerSync(bs: BitStream) {
  const data: Partial<ITrailerSync> = {};
  [
    data.trailerId,
    data.position,
    data.quaternion,
    data.velocity,
    data.angularVelocity,
  ] = BS_ReadValue(
    bs,
    PR_ValueType.UINT16,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT4,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT3
  ) as any;
  return data as ITrailerSync;
}

export function BS_ReadPassengerSync(bs: BitStream) {
  const data: Partial<IPassengerSync> = {};
  [
    data.vehicleId,
    data.driveBy,
    data.seatId,
    data.additionalKey,
    data.weaponId,
    data.playerHealth,
    data.playerArmour,
    data.lrKey,
    data.udKey,
    data.keys,
    data.position,
  ] = BS_ReadValue(
    bs,
    PR_ValueType.UINT16,
    [PR_ValueType.BITS, 2],
    [PR_ValueType.BITS, 6],
    [PR_ValueType.BITS, 2],
    [PR_ValueType.BITS, 6],
    PR_ValueType.UINT8,
    PR_ValueType.UINT8,
    PR_ValueType.UINT16,
    PR_ValueType.UINT16,
    PR_ValueType.UINT16,
    PR_ValueType.FLOAT3
  ) as any;
  return data as IPassengerSync;
}

export function BS_ReadUnoccupiedSync(bs: BitStream) {
  const data: Partial<IUnoccupiedSync> = {};
  [
    data.vehicleId,
    data.seatId,
    data.roll,
    data.direction,
    data.position,
    data.velocity,
    data.angularVelocity,
    data.vehicleHealth,
  ] = BS_ReadValue(
    bs,
    PR_ValueType.UINT16,
    PR_ValueType.UINT8,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT
  ) as any;
  return data as IUnoccupiedSync;
}

export function BS_ReadAimSync(bs: BitStream) {
  const data: Partial<IAimSync> = {};
  [
    data.camMode,
    data.camFrontVec,
    data.camPos,
    data.aimZ,
    data.weaponState,
    data.camZoom,
    data.aspectRatio,
  ] = BS_ReadValue(
    bs,
    PR_ValueType.UINT8,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT,
    [PR_ValueType.BITS, 2],
    [PR_ValueType.BITS, 6],
    PR_ValueType.UINT8
  ) as any;
  return data as IAimSync;
}

export function BS_ReadBulletSync(bs: BitStream) {
  const data: Partial<IBulletSync> = {};
  [
    data.hitType,
    data.hitId,
    data.origin,
    data.hitPos,
    data.offsets,
    data.weaponId,
  ] = BS_ReadValue(
    bs,
    PR_ValueType.UINT8,
    PR_ValueType.UINT16,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT3,
    PR_ValueType.FLOAT3,
    PR_ValueType.UINT8
  ) as any;
  return data as IBulletSync;
}

export function BS_ReadSpectatingSync(bs: BitStream) {
  const data: Partial<ISpectatingSync> = {};
  [data.lrKey, data.udKey, data.keys, data.position] = BS_ReadValue(
    bs,
    PR_ValueType.UINT16,
    PR_ValueType.UINT16,
    PR_ValueType.UINT16,
    PR_ValueType.FLOAT3
  ) as any;

  return data as ISpectatingSync;
}

export function BS_ReadMarkersSync(bs: BitStream) {
  const data: Partial<IMarkersSync> = {};

  data.playerPositionX = [];
  data.playerPositionY = [];
  data.playerPositionZ = [];
  data.playerIsParticipant = [];
  data.playerIsActive = [];

  const numberOfPlayers = BS_ReadInt32(bs) as number;

  if (numberOfPlayers < 0 || numberOfPlayers > LimitsEnum.MAX_PLAYERS) {
    return;
  }

  data.numberOfPlayers = numberOfPlayers;

  for (let i = 0; i < numberOfPlayers; i++) {
    const playerId = BS_ReadUint16(bs) as number;

    if (playerId >= LimitsEnum.MAX_PLAYERS) {
      return;
    }

    data.playerIsParticipant[playerId] = true;

    const isActive = BS_ReadCompressedBool(bs);

    if (isActive) {
      data.playerIsActive[playerId] = true;

      const [x, y, z] = BS_ReadValue(
        bs,
        PR_ValueType.INT16,
        PR_ValueType.INT16,
        PR_ValueType.INT16
      ) as Vector3;

      data.playerPositionX[playerId] = x;
      data.playerPositionY[playerId] = y;
      data.playerPositionZ[playerId] = z;
    }
  }
  return data as IMarkersSync;
}

export function BS_ReadWeaponsUpdate(bs: BitStream) {
  const data: Partial<IWeaponsUpdate> = {};

  data.slotWeaponId = [];
  data.slotWeaponAmmo = [];
  data.slotUpdated = [];

  let numberOfSlots = 0;

  const numberOfBytes = BS_GetNumberOfBytesUsed(bs);

  if (numberOfBytes > 5) {
    numberOfSlots = (numberOfBytes - 5) / 4;
  }

  [data.targetId, data.targetActorId] = BS_ReadValue(
    bs,
    PR_ValueType.UINT16,
    PR_ValueType.UINT16
  ) as number[];

  while (numberOfSlots--) {
    const [slotId, weaponId, ammo] = BS_ReadValue(
      bs,
      PR_ValueType.UINT8,
      PR_ValueType.UINT8,
      PR_ValueType.UINT16
    ) as number[];

    if (slotId < PR_MAX_WEAPON_SLOTS) {
      data.slotWeaponId[slotId] = weaponId;
      data.slotWeaponAmmo[slotId] = ammo;
      data.slotUpdated[slotId] = true;
    }
  }
  return data as IWeaponsUpdate;
}

export function BS_ReadStatsUpdate(bs: BitStream) {
  const data: Partial<IStatsUpdate> = {};
  [data.money, data.drunkLevel] = BS_ReadValue(
    bs,
    PR_ValueType.INT32,
    PR_ValueType.INT32
  ) as number[];
  return data as IStatsUpdate;
}

export function BS_ReadRconCommand(bs: BitStream) {
  const data: Partial<IRconCommand> = {};
  [data.command] = BS_ReadValue(bs, PR_ValueType.STRING32) as any;
  return data as IRconCommand;
}

export function BS_WriteOnFootSync(
  bs: BitStream,
  data: IOnFootSync,
  outgoing = false
) {
  if (outgoing) {
    if (data.lrKey) {
      BS_WriteValue(
        bs,
        [PR_ValueType.BOOL, true],
        [PR_ValueType.UINT16, data.lrKey]
      );
    } else {
      BS_WriteValue(bs, [PR_ValueType.BOOL, false]);
    }

    if (data.udKey) {
      BS_WriteValue(
        bs,
        [PR_ValueType.BOOL, true],
        [PR_ValueType.UINT16, data.udKey]
      );
    } else {
      BS_WriteValue(bs, [PR_ValueType.BOOL, false]);
    }

    const healthArmour = BS_PackHealthArmour(data.health, data.armour);

    BS_WriteValue(
      bs,
      [PR_ValueType.UINT16, data.keys],
      [PR_ValueType.FLOAT3, data.position],
      [PR_ValueType.NORM_QUAT, data.quaternion],
      [PR_ValueType.UINT8, healthArmour],
      [PR_ValueType.UINT8, data.weaponId],
      [PR_ValueType.UINT8, data.specialAction],
      [PR_ValueType.VECTOR, data.velocity]
    );

    if (data.surfingVehicleId) {
      BS_WriteValue(
        bs,
        [PR_ValueType.BOOL, true],
        [PR_ValueType.UINT16, data.surfingVehicleId],
        [PR_ValueType.FLOAT3, data.surfingOffsets]
      );
    } else {
      BS_WriteValue(bs, [PR_ValueType.BOOL, false]);
    }

    if (data.animationId || data.animationFlags) {
      BS_WriteValue(
        bs,
        [PR_ValueType.BOOL, true],
        [PR_ValueType.INT16, data.animationId],
        [PR_ValueType.INT16, data.animationFlags]
      );
    } else {
      BS_WriteValue(bs, [PR_ValueType.BOOL, false]);
    }
  } else {
    BS_WriteValue(
      bs,
      [PR_ValueType.UINT16, data.lrKey],
      [PR_ValueType.UINT16, data.udKey],
      [PR_ValueType.UINT16, data.keys],
      [PR_ValueType.FLOAT3, data.position],
      [PR_ValueType.FLOAT4, data.quaternion],
      [PR_ValueType.UINT8, data.health],
      [PR_ValueType.UINT8, data.armour],
      [PR_ValueType.BITS, data.additionalKey, 2],
      [PR_ValueType.BITS, data.weaponId, 6],
      [PR_ValueType.UINT8, data.specialAction],
      [PR_ValueType.FLOAT3, data.velocity],
      [PR_ValueType.FLOAT3, data.surfingOffsets],
      [PR_ValueType.UINT16, data.surfingVehicleId],
      [PR_ValueType.INT16, data.animationId],
      [PR_ValueType.INT16, data.animationFlags]
    );
  }
}

export function BS_WriteInCarSync(
  bs: BitStream,
  data: IInCarSync,
  outgoing = false
) {
  if (outgoing) {
    const healthArmour = BS_PackHealthArmour(data.playerHealth, data.armour);

    BS_WriteValue(
      bs,
      [PR_ValueType.UINT16, data.vehicleId],
      [PR_ValueType.UINT16, data.lrKey],
      [PR_ValueType.UINT16, data.udKey],
      [PR_ValueType.UINT16, data.keys],
      [PR_ValueType.NORM_QUAT, data.quaternion],
      [PR_ValueType.FLOAT3, data.position],
      [PR_ValueType.VECTOR, data.velocity],
      [PR_ValueType.UINT16, Math.round(data.vehicleHealth)],
      [PR_ValueType.UINT8, healthArmour],
      [PR_ValueType.UINT8, data.weaponId],
      [PR_ValueType.BOOL, data.sirenState],
      [PR_ValueType.BOOL, data.landingGearState]
    );

    if (data.trainSpeed) {
      BS_WriteValue(
        bs,
        [PR_ValueType.BOOL, true],
        [PR_ValueType.FLOAT, data.trainSpeed]
      );
    } else {
      BS_WriteValue(bs, [PR_ValueType.BOOL, false]);
    }

    if (data.trailerId) {
      BS_WriteValue(
        bs,
        [PR_ValueType.BOOL, true],
        [PR_ValueType.UINT16, data.trailerId]
      );
    } else {
      BS_WriteValue(bs, [PR_ValueType.BOOL, false]);
    }
  } else {
    BS_WriteValue(
      bs,
      [PR_ValueType.UINT16, data.vehicleId],
      [PR_ValueType.UINT16, data.lrKey],
      [PR_ValueType.UINT16, data.udKey],
      [PR_ValueType.UINT16, data.keys],
      [PR_ValueType.FLOAT4, data.quaternion],
      [PR_ValueType.FLOAT3, data.position],
      [PR_ValueType.FLOAT3, data.velocity],
      [PR_ValueType.FLOAT, data.vehicleHealth],
      [PR_ValueType.UINT8, data.playerHealth],
      [PR_ValueType.UINT8, data.armour],
      [PR_ValueType.BITS, data.additionalKey, 2],
      [PR_ValueType.BITS, data.weaponId, 6],
      [PR_ValueType.UINT8, data.sirenState],
      [PR_ValueType.UINT8, data.landingGearState],
      [PR_ValueType.UINT16, data.trailerId],
      [PR_ValueType.FLOAT, data.trainSpeed]
    );
  }
}

export function BS_WriteTrailerSync(bs: BitStream, data: ITrailerSync) {
  BS_WriteValue(
    bs,
    [PR_ValueType.UINT16, data.trailerId],
    [PR_ValueType.FLOAT3, data.position],
    [PR_ValueType.FLOAT4, data.quaternion],
    [PR_ValueType.FLOAT3, data.velocity],
    [PR_ValueType.FLOAT3, data.angularVelocity]
  );
}

export function BS_WritePassengerSync(bs: BitStream, data: IPassengerSync) {
  BS_WriteValue(
    bs,
    [PR_ValueType.UINT16, data.vehicleId],
    [PR_ValueType.BITS, data.driveBy, 2],
    [PR_ValueType.BITS, data.seatId, 6],
    [PR_ValueType.BITS, data.additionalKey, 2],
    [PR_ValueType.BITS, data.weaponId, 6],
    [PR_ValueType.UINT8, data.playerHealth],
    [PR_ValueType.UINT8, data.playerArmour],
    [PR_ValueType.UINT16, data.lrKey],
    [PR_ValueType.UINT16, data.udKey],
    [PR_ValueType.UINT16, data.keys],
    [PR_ValueType.FLOAT3, data.position]
  );
}

export function BS_WriteUnoccupiedSync(bs: BitStream, data: IUnoccupiedSync) {
  BS_WriteValue(
    bs,
    [PR_ValueType.UINT16, data.vehicleId],
    [PR_ValueType.UINT8, data.seatId],
    [PR_ValueType.FLOAT3, data.roll],
    [PR_ValueType.FLOAT3, data.direction],
    [PR_ValueType.FLOAT3, data.position],
    [PR_ValueType.FLOAT3, data.velocity],
    [PR_ValueType.FLOAT3, data.angularVelocity],
    [PR_ValueType.FLOAT, data.vehicleHealth]
  );
}

export function BS_WriteAimSync(bs: BitStream, data: IAimSync) {
  BS_WriteValue(
    bs,
    [PR_ValueType.UINT8, data.camMode],
    [PR_ValueType.FLOAT3, data.camFrontVec],
    [PR_ValueType.FLOAT3, data.camPos],
    [PR_ValueType.FLOAT, data.aimZ],
    [PR_ValueType.BITS, data.weaponState, 2],
    [PR_ValueType.BITS, data.camZoom, 6],
    [PR_ValueType.UINT8, data.aspectRatio]
  );
}

export function BS_WriteBulletSync(bs: BitStream, data: IBulletSync) {
  BS_WriteValue(
    bs,
    [PR_ValueType.UINT8, data.hitType],
    [PR_ValueType.UINT16, data.hitId],
    [PR_ValueType.FLOAT3, data.origin],
    [PR_ValueType.FLOAT3, data.hitPos],
    [PR_ValueType.FLOAT3, data.offsets],
    [PR_ValueType.UINT8, data.weaponId]
  );
}

export function BS_WriteSpectatingSync(bs: BitStream, data: ISpectatingSync) {
  BS_WriteValue(
    bs,
    [PR_ValueType.UINT16, data.lrKey],
    [PR_ValueType.UINT16, data.udKey],
    [PR_ValueType.UINT16, data.keys],
    [PR_ValueType.FLOAT3, data.position]
  );
}

export function BS_WriteMarkersSync(bs: BitStream, data: IMarkersSync) {
  BS_WriteInt32(bs, data.numberOfPlayers);

  for (let i = 0; i < LimitsEnum.MAX_PLAYERS; i++) {
    if (!data.playerIsParticipant[i]) {
      continue;
    }

    BS_WriteValue(
      bs,
      [PR_ValueType.UINT16, i],
      [PR_ValueType.CBOOL, data.playerIsActive[i]]
    );

    if (data.playerIsActive[i]) {
      BS_WriteValue(
        bs,
        [PR_ValueType.INT16, data.playerPositionX[i]],
        [PR_ValueType.INT16, data.playerPositionY[i]],
        [PR_ValueType.INT16, data.playerPositionZ[i]]
      );
    }
  }
}

export function BS_WriteWeaponsUpdate(bs: BitStream, data: IWeaponsUpdate) {
  BS_WriteValue(
    bs,
    [PR_ValueType.UINT16, data.targetId],
    [PR_ValueType.UINT16, data.targetActorId]
  );

  for (let slotId = 0; slotId < PR_MAX_WEAPON_SLOTS; slotId++) {
    if (!data.slotUpdated[slotId]) {
      continue;
    }

    BS_WriteValue(
      bs,
      [PR_ValueType.UINT8, slotId],
      [PR_ValueType.UINT8, data.slotWeaponId[slotId]],
      [PR_ValueType.UINT16, data.slotWeaponAmmo[slotId]]
    );
  }
}

export function BS_WriteStatsUpdate(bs: BitStream, data: IStatsUpdate) {
  BS_WriteValue(
    bs,
    [PR_ValueType.INT32, data.money],
    [PR_ValueType.INT32, data.drunkLevel]
  );
}

export function BS_WriteRconCommand(bs: BitStream, data: IRconCommand) {
  BS_WriteValue(bs, [PR_ValueType.STRING32, data.command]);
}

export function PR_SendPacketToPlayerStream(
  bs: BitStream,
  players: Player[],
  player: Player,
  priority = PR_PacketPriority.HIGH,
  reliability = PR_PacketReliability.RELIABLE_ORDERED,
  orderingChannel = 0
) {
  players.forEach((p) => {
    if (!p.isStreamedIn(player)) return;
    PR_SendPacket(bs, p.id, priority, reliability, orderingChannel);
  });
}

export function PR_SendRPCToPlayerStream(
  bs: BitStream,
  players: Player[],
  player: Player,
  rpcId: number,
  priority = PR_PacketPriority.HIGH,
  reliability = PR_PacketReliability.RELIABLE_ORDERED,
  orderingChannel = 0
) {
  players.forEach((p) => {
    if (!p.isStreamedIn(player)) {
      return;
    }
    PR_SendRPC(bs, p.id, rpcId, priority, reliability, orderingChannel);
  });
}

export function PR_SendPacketToVehicleStream(
  bs: BitStream,
  players: Player[],
  vehicle: Vehicle,
  excludedPlayer: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
  priority = PR_PacketPriority.HIGH,
  reliability = PR_PacketReliability.RELIABLE_ORDERED,
  orderingChannel = 0
) {
  players.forEach((p) => {
    if (
      excludedPlayer !== InvalidEnum.PLAYER_ID &&
      (p === excludedPlayer || vehicle.isStreamedIn(p))
    )
      return;
    PR_SendPacket(bs, p.id, priority, reliability, orderingChannel);
  });
}

export function PR_SendRPCToVehicleStream(
  bs: BitStream,
  players: Player[],
  vehicle: Vehicle,
  rpcId: number,
  excludedPlayer: Player | InvalidEnum.PLAYER_ID = InvalidEnum.PLAYER_ID,
  priority = PR_PacketPriority.HIGH,
  reliability = PR_PacketReliability.RELIABLE_ORDERED,
  orderingChannel = 0
) {
  players.forEach((p) => {
    if (
      excludedPlayer !== InvalidEnum.PLAYER_ID &&
      (p === excludedPlayer || vehicle.isStreamedIn(p))
    )
      return;
    PR_SendRPC(bs, p.id, rpcId, priority, reliability, orderingChannel);
  });
}
