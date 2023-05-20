import type { Vector3, Vector4 } from "@/types";

export interface IOnFootSync {
  lrKey: number;
  udKey: number;
  keys: number;
  position: Vector3<number>;
  quaternion: Vector4<number>;
  health: number;
  armour: number;
  additionalKey: number;
  weaponId: number;
  specialAction: number;
  velocity: Vector3<number>;
  surfingOffsets: Vector3<number>;
  surfingVehicleId: number;
  animationId: number;
  animationFlags: number;
}

export interface IInCarSync {
  vehicleId: number;
  lrKey: number;
  udKey: number;
  keys: number;
  quaternion: Vector4<number>;
  position: Vector3<number>;
  velocity: Vector3<number>;
  vehicleHealth: number;
  playerHealth: number;
  armour: number;
  additionalKey: number;
  weaponId: number;
  sirenState: number;
  landingGearState: number;
  trailerId: number;
  trainSpeed: number;
}

export interface ITrailerSync {
  trailerId: number;
  position: Vector3<number>;
  quaternion: Vector4<number>;
  velocity: Vector3<number>;
  angularVelocity: Vector3<number>;
}

export interface IPassengerSync {
  vehicleId: number;
  driveBy: number;
  seatId: number;
  additionalKey: number;
  weaponId: number;
  playerHealth: number;
  playerArmour: number;
  lrKey: number;
  udKey: number;
  keys: number;
  position: Vector3<number>;
}

export interface IUnoccupiedSync {
  vehicleId: number;
  seatId: number;
  roll: Vector3<number>;
  direction: Vector3<number>;
  position: Vector3<number>;
  velocity: Vector3<number>;
  angularVelocity: Vector3<number>;
  vehicleHealth: number;
}

export interface IAimSync {
  camMode: number;
  camFrontVec: Vector3<number>;
  camPos: Vector3<number>;
  aimZ: number;
  camZoom: number;
  weaponState: number;
  aspectRatio: number;
}

export interface IBulletSync {
  hitType: number;
  hitId: number;
  origin: Vector3<number>;
  hitPos: Vector3<number>;
  offsets: Vector3<number>;
  weaponId: number;
}

export interface ISpectatingSync {
  lrKey: number;
  udKey: number;
  keys: number;
  position: Vector3<number>;
}

export interface IMarkersSync {
  numberOfPlayers: number;
  playerIsActive: boolean[];
  playerPositionX: number[];
  playerPositionY: number[];
  playerPositionZ: number[];

  playerIsParticipant: boolean[]; // Pawn.RakNet internal helping field
}

export interface IWeaponsUpdate {
  targetId: number;
  targetActorId: number;
  slotWeaponId: number[];
  slotWeaponAmmo: number[];

  slotUpdated: boolean[]; // Pawn.RakNet internal helping field
}

export interface IStatsUpdate {
  money: number;
  drunkLevel: number;
}

export interface IRconCommand {
  command: number[];
}
