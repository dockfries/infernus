import { BodyPartsEnum, InvalidEnum, Player, WeaponEnum } from "@infernus/core";

export interface WCPlayerDamage {
  player: Player;
  amount: number;
  issuer: Player | InvalidEnum.PLAYER_ID;
  weapon: WeaponEnum;
  bodyPart: BodyPartsEnum;
}
