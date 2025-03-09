import {
  BodyPartsEnum,
  GameMode,
  defineHooks,
  InvalidEnum,
  Player,
  WeaponEnum,
} from "@infernus/core";

// BodyPartsEnum not defined unknown, so ...
const BODY_PART_UNKNOWN = -1;

// variables
const s_PlayerArmour = new Map<Player, number>();
const s_PlayerHealth = new Map<Player, number>();
const s_PlayerMaxArmour = new Map<Player, number>();
const s_PlayerMaxHealth = new Map<Player, number>();

const [pMethods, setPlayerHook] = defineHooks(Player);

function inflictDamage(
  player: Player,
  amount: number,
  issuerId: InvalidEnum.PLAYER_ID | Player = InvalidEnum.PLAYER_ID,
  weapon: WeaponEnum = WeaponEnum.UNKNOWN,
  bodyPart: BodyPartsEnum | -1 = BODY_PART_UNKNOWN,
  ignoreArmour = false,
) {
  console.log(player, amount, issuerId, weapon, bodyPart, ignoreArmour);
  // todo
}

function updateHealthBar(player: Player, force = false) {
  // todo
  // You can't use player.setHealth directly in hook stack, it's an endless loop, so you need to `usePlayerMethods` instead
  console.log(player, force);
  //
  return pMethods.setHealth.call(player, 100);
}

function wc_SetPlayerHealth(player: Player, health: number, armour = -1.0) {
  if (!player.isConnected()) {
    return false;
  }

  if (health <= 0.0) {
    s_PlayerArmour.set(player, 0.0);
    s_PlayerHealth.set(player, 0.0);

    inflictDamage(player, 0.0);
  } else {
    if (armour !== -1.0) {
      if (armour > s_PlayerMaxArmour.get(player)!) {
        armour = s_PlayerMaxArmour.get(player)!;
      }
      s_PlayerArmour.set(player, armour);
    }

    if (health > s_PlayerMaxHealth.get(player)!) {
      health = s_PlayerMaxHealth.get(player)!;
    }
    s_PlayerHealth.set(player, health);
    updateHealthBar(player, true);
  }

  return true;
}

setPlayerHook("setHealth", function (health) {
  // const player = this;
  return wc_SetPlayerHealth(this, health);
});

function scriptExit() {
  // todo
  s_PlayerArmour.clear();
  s_PlayerHealth.clear();
  s_PlayerMaxArmour.clear();
  s_PlayerMaxHealth.clear();
}

GameMode.onExit(({ next }) => {
  scriptExit();
  return next();
});
