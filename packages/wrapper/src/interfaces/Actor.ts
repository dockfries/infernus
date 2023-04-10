export interface IActorSpawn {
  skinid: number;
  fX: number;
  fY: number;
  fZ: number;
  fAngle: number;
}
export interface IActorAnimation {
  animlib: string;
  animname: string;
  fDelta: number;
  loop: number;
  lockx: number;
  locky: number;
  freeze: number;
  time: number;
}
