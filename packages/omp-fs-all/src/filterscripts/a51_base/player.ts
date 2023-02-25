import { BasePlayer, BasePlayerEvent } from "omp-node-lib";

export class A51Player extends BasePlayer {}

export class A51PlayerEvent extends BasePlayerEvent<A51Player> {}

export const playerEvent = new A51PlayerEvent((id) => new A51Player(id));
