import { Vector3, Vector4 } from "@/types";

export interface IOnFootSync {
  lrKey: number;
  udKey: number;
  keys: number;
  position: Vector3;
  quaternion: Vector4;
  health: number;
  armour: number;
  additionalKey: number;
  weaponId: number;
  specialAction: number;
  velocity: Vector3;
  surfingOffsets: Vector3;
  surfingVehicleId: number;
  animationId: number;
  animationFlags: number;
}

export interface IInCarSync {
  vehicleId: number;
  lrKey: number;
  udKey: number;
  keys: number;
  quaternion: Vector4;
  position: Vector3;
  velocity: Vector3;
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
  position: Vector3;
  quaternion: Vector4;
  velocity: Vector3;
  angularVelocity: Vector3;
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
  position: Vector3;
}

export interface IUnoccupiedSync {
  vehicleId: number;
  seatId: number;
  roll: Vector3;
  direction: Vector3;
  position: Vector3;
  velocity: Vector3;
  angularVelocity: Vector3;
  vehicleHealth: number;
}

export interface IAimSync {
  camMode: number;
  camFrontVec: Vector3;
  camPos: Vector3;
  aimZ: number;
  camZoom: number;
  weaponState: number;
  aspectRatio: number;
}

export interface IBulletSync {
  hitType: number;
  hitId: number;
  origin: Vector3;
  hitPos: Vector3;
  offsets: Vector3;
  weaponId: number;
}

export interface ISpectatingSync {
  lrKey: number;
  udKey: number;
  keys: number;
  position: Vector3;
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
