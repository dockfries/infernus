export interface IActorSpawn {
  skinId: number;
  fX: number;
  fY: number;
  fZ: number;
  fAngle: number;
}
export interface IActorAnimation {
  animLib: string;
  animName: string;
  fDelta: number;
  loop: number;
  lockX: number;
  lockY: number;
  freeze: number;
  time: number;
}
