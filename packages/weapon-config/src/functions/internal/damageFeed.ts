import { Player, TextDraw, I18n, InvalidEnum } from "@infernus/core";
import { innerWeaponConfig, innerGameModeConfig } from "../../config";
import { wc_GetWeaponName } from "../../hooks/weapon";
import {
  orig_playerMethods,
  orig_PlayerTextDrawLetterSize,
  orig_PlayerTextDrawColor,
  orig_PlayerTextDrawAlignment,
  orig_PlayerTextDrawSetOutline,
  orig_PlayerTextDrawBackgroundColor,
  orig_PlayerTextDrawSetString,
  orig_PlayerTextDrawShow,
  orig_PlayerTextDrawHide,
} from "../../hooks/origin";
import {
  damageFeedTimer,
  damageFeedGiven,
  internalPlayerTextDraw,
  damageFeedTaken,
  damageFeedHitsGiven,
  DamageFeedHit,
  damageFeedHitsTaken,
  damageFeedUpdateTick,
  playerHealth,
  spectating,
} from "../../struct";
import { isDamageFeedActive } from "../public/is";

export function wc_DamageFeedUpdate(player: Player) {
  damageFeedTimer.set(player.id, null);

  if (
    orig_playerMethods.isConnected.call(player) &&
    isDamageFeedActive(player)
  ) {
    damageFeedUpdate(player, true);
  }
}

export function damageFeedUpdate(player: Player, modified = false) {
  if (!isDamageFeedActive(player)) {
    if (
      damageFeedGiven.get(player.id) &&
      damageFeedGiven.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[
        damageFeedGiven.get(player.id)!.id
      ] = false;
      damageFeedGiven.get(player.id)!.destroy();
      damageFeedGiven.set(player.id, null);
    }

    if (
      damageFeedTaken.get(player.id) &&
      damageFeedTaken.get(player.id)!.id !== InvalidEnum.TEXT_DRAW
    ) {
      internalPlayerTextDraw.get(player.id)[
        damageFeedTaken.get(player.id)!.id
      ] = false;
      damageFeedTaken.get(player.id)!.destroy();
      damageFeedTaken.set(player.id, null);
    }

    return;
  }

  if (
    !damageFeedGiven.get(player.id) ||
    damageFeedGiven.get(player.id)!.id === InvalidEnum.TEXT_DRAW
  ) {
    const td = new TextDraw({ player, x: 200.0, y: 365.0, text: "_" }).create();

    if (td.id === InvalidEnum.TEXT_DRAW) {
      console.log("(wc) WARN: Cannot create damage feed textDraw");
    } else {
      internalPlayerTextDraw.get(player.id)[td.id] = true;
      orig_PlayerTextDrawLetterSize(player.id, td.id, 0.2, 0.9);
      orig_PlayerTextDrawColor(
        player.id,
        td.id,
        innerWeaponConfig.FEED_GIVEN_COLOR,
      );
      orig_PlayerTextDrawAlignment(player.id, td.id, 2);
      orig_PlayerTextDrawSetOutline(player.id, td.id, 1);
      orig_PlayerTextDrawBackgroundColor(player.id, td.id, 0x0000001a);
      damageFeedGiven.set(player.id, td);
    }
  }

  if (
    !damageFeedTaken.get(player.id) ||
    damageFeedTaken.get(player.id)!.id === InvalidEnum.TEXT_DRAW
  ) {
    const td = new TextDraw({ player, x: 440.0, y: 365.0, text: "_" }).create();

    if (td.id === InvalidEnum.TEXT_DRAW) {
      console.log("(wc) WARN: Cannot create damage feed textDraw");
    } else {
      internalPlayerTextDraw.get(player.id)[td.id] = true;

      orig_PlayerTextDrawLetterSize(player.id, td.id, 0.2, 0.9);
      orig_PlayerTextDrawColor(
        player.id,
        td.id,
        innerWeaponConfig.FEED_TAKEN_COLOR,
      );
      orig_PlayerTextDrawAlignment(player.id, td.id, 2);
      orig_PlayerTextDrawSetOutline(player.id, td.id, 1);
      orig_PlayerTextDrawBackgroundColor(player.id, td.id, 0x0000001a);

      damageFeedTaken.set(player.id, td);
    }
  }

  let tick = Date.now();
  if (tick === 0) tick = 1;
  let lowest_tick = tick + 1;

  for (
    let i = 0, j = 0;
    i < damageFeedHitsGiven.get(player.id).length - 1;
    i++
  ) {
    if (!damageFeedHitsGiven.get(player.id)[i]?.tick) {
      break;
    }

    if (
      tick - damageFeedHitsGiven.get(player.id)[i]!.tick >=
      innerGameModeConfig.damageFeedHideDelay
    ) {
      modified = true;

      for (j = i; j < damageFeedHitsGiven.get(player.id).length - 1; j++) {
        if (!damageFeedHitsGiven.get(player.id)[j]) {
          damageFeedHitsGiven.get(player.id)[j] = new DamageFeedHit();
        }
        damageFeedHitsGiven.get(player.id)[j]!.tick = 0;
      }

      break;
    }

    if (damageFeedHitsGiven.get(player.id)[i]!.tick < lowest_tick) {
      lowest_tick = damageFeedHitsGiven.get(player.id)[i]!.tick;
    }
  }

  for (
    let i = 0, j = 0;
    i < damageFeedHitsTaken.get(player.id).length - 1;
    i++
  ) {
    if (!damageFeedHitsTaken.get(player.id)[i]?.tick) {
      break;
    }

    if (
      tick - damageFeedHitsTaken.get(player.id)[i]!.tick >=
      innerGameModeConfig.damageFeedHideDelay
    ) {
      modified = true;

      for (j = i; j < damageFeedHitsTaken.get(player.id).length - 1; j++) {
        if (!damageFeedHitsTaken.get(player.id)[j]) {
          damageFeedHitsTaken.get(player.id)[j] = new DamageFeedHit();
        }
        damageFeedHitsTaken.get(player.id)[j]!.tick = 0;
      }

      break;
    }

    if (damageFeedHitsTaken.get(player.id)[i]!.tick < lowest_tick) {
      lowest_tick = damageFeedHitsTaken.get(player.id)[i]!.tick;
    }
  }

  if (damageFeedTimer.get(player.id)) {
    clearTimeout(damageFeedTimer.get(player.id)!);
  }

  if (
    tick - damageFeedUpdateTick.get(player.id) <
      innerGameModeConfig.damageFeedMaxUpdateRate &&
    modified
  ) {
    damageFeedTimer.set(
      player.id,
      setTimeout(
        () => {
          wc_DamageFeedUpdate(player);
        },
        innerGameModeConfig.damageFeedMaxUpdateRate -
          (tick - damageFeedUpdateTick.get(player.id)),
      ),
    );
  } else {
    if (lowest_tick === tick + 1) {
      damageFeedTimer.set(player.id, null);
      modified = true;
    } else {
      damageFeedTimer.set(
        player.id,
        setTimeout(
          () => {
            wc_DamageFeedUpdate(player);
          },
          innerGameModeConfig.damageFeedHideDelay - (tick - lowest_tick) + 10,
        ),
      );
    }

    if (modified) {
      damageFeedUpdateText(player);

      damageFeedUpdateTick.set(player.id, tick);
    }
  }
}

export function damageFeedUpdateText(player: Player) {
  let buf = "";

  for (
    let i = 0, weapon = "";
    i < damageFeedHitsGiven.get(player.id).length - 1;
    i++
  ) {
    if (!damageFeedHitsGiven.get(player.id)[i]?.tick) {
      break;
    }

    if (damageFeedHitsGiven.get(player.id)[i]!.weapon === -1) {
      weapon = "Multiple";
    } else {
      weapon = wc_GetWeaponName(
        damageFeedHitsGiven.get(player.id)[i]!.weapon,
      ).name;
    }

    if (
      damageFeedHitsGiven.get(player.id)[i]!.issuer === InvalidEnum.PLAYER_ID
    ) {
      buf = `${buf}${weapon} +${(damageFeedHitsGiven.get(player.id)[i]!.amount + 0.009).toFixed(2)}~n~`;
    } else {
      buf = `${buf}${damageFeedHitsGiven.get(player.id)[i]!.name} - ${weapon} +${(damageFeedHitsGiven.get(player.id)[i]!.amount + 0.009).toFixed(2)} (${playerHealth.get(damageFeedHitsGiven.get(player.id)[i]!.issuer).toFixed(2)})~n~`;
    }
  }

  if (
    !damageFeedGiven.get(player.id) ||
    damageFeedGiven.get(player.id)!.id === InvalidEnum.TEXT_DRAW
  ) {
    console.log("(wc) WARN: Doesn't have feed textDraw when needed");
  } else if (
    internalPlayerTextDraw.get(player.id)[damageFeedGiven.get(player.id)!.id]
  ) {
    if (buf) {
      orig_PlayerTextDrawSetString(
        player.id,
        damageFeedGiven.get(player.id)!.id,
        I18n.encodeToBuf(buf, player.charset),
      );
      orig_PlayerTextDrawShow(player.id, damageFeedGiven.get(player.id)!.id);
    } else {
      orig_PlayerTextDrawHide(player.id, damageFeedGiven.get(player.id)!.id);
    }
  }

  buf = "";

  for (
    let i = 0, weapon = "";
    i < damageFeedHitsTaken.get(player.id).length - 1;
    i++
  ) {
    if (!damageFeedHitsTaken.get(player.id)[i]?.tick) {
      break;
    }

    if (damageFeedHitsTaken.get(player.id)[i]!.weapon === -1) {
      weapon = "Multiple";
    } else {
      weapon = wc_GetWeaponName(
        damageFeedHitsTaken.get(player.id)[i]!.weapon,
      ).name;
    }

    if (
      damageFeedHitsTaken.get(player.id)[i]!.issuer === InvalidEnum.PLAYER_ID
    ) {
      buf = `${buf}${weapon} -${(damageFeedHitsTaken.get(player.id)[i]!.amount + 0.009).toFixed(2)} (${playerHealth.get(player.id).toFixed(2)})~n~`;
    } else {
      buf = `${buf}${damageFeedHitsTaken.get(player.id)[i]!.name} - ${weapon} -${(damageFeedHitsTaken.get(player.id)[i]!.amount + 0.009).toFixed(2)} (${playerHealth.get(damageFeedHitsGiven.get(player.id)[i]!.issuer).toFixed(2)})~n~`;
    }
  }

  if (
    !damageFeedTaken.get(player.id) ||
    damageFeedTaken.get(player.id)!.id === InvalidEnum.TEXT_DRAW
  ) {
    console.log("(wc) WARN: Doesn't have feed textDraw when needed");
  } else if (
    internalPlayerTextDraw.get(player.id)[damageFeedTaken.get(player.id)!.id]
  ) {
    if (buf) {
      orig_PlayerTextDrawSetString(
        player.id,
        damageFeedTaken.get(player.id)!.id,
        I18n.encodeToBuf(buf, player.charset),
      );
      orig_PlayerTextDrawShow(player.id, damageFeedTaken.get(player.id)!.id);
    } else {
      orig_PlayerTextDrawHide(player.id, damageFeedTaken.get(player.id)!.id);
    }
  }
}

export function damageFeedAddHitGiven(
  player: Player,
  issuerId: Player | InvalidEnum.PLAYER_ID,
  amount: number,
  weapon: number,
) {
  Player.getInstances().forEach((i) => {
    if (spectating.get(i.id) === player.id && i !== player) {
      damageFeedAddHit(
        damageFeedHitsGiven.get(i.id),
        i,
        issuerId,
        amount,
        weapon,
      );
    }
  });

  damageFeedAddHit(
    damageFeedHitsGiven.get(player.id),
    player,
    issuerId,
    amount,
    weapon,
  );
}

export function damageFeedAddHitTaken(
  player: Player,
  issuerId: Player | InvalidEnum.PLAYER_ID,
  amount: number,
  weapon: number,
) {
  Player.getInstances().forEach((i) => {
    if (spectating.get(i.id) === player.id && i !== player) {
      damageFeedAddHit(
        damageFeedHitsTaken.get(i.id),
        i,
        issuerId,
        amount,
        weapon,
      );
    }
  });

  damageFeedAddHit(
    damageFeedHitsTaken.get(player.id),
    player,
    issuerId,
    amount,
    weapon,
  );
}

export function damageFeedAddHit(
  arr: (DamageFeedHit | null)[],
  player: Player,
  issuerId: Player | InvalidEnum.PLAYER_ID,
  amount: number,
  weapon: number,
) {
  if (!isDamageFeedActive(player)) {
    return;
  }

  let tick = Date.now();
  if (tick === 0) tick = 1;
  let idx = -1;

  for (let i = 0; i < arr.length - 1; i++) {
    if (!arr[i] || !arr[i]!.tick) {
      break;
    }

    if (tick - arr[i]!.tick >= innerGameModeConfig.damageFeedHideDelay) {
      damageFeedRemoveHit(arr, i);
      break;
    }

    if (arr[i]!.issuer === issuerId) {
      // // Multiple weapons
      // if (arr[i]!.weapon !== weapon) {
      //   //weapon = -1;
      // }

      amount += arr[i]!.amount;
      idx = i;
      break;
    }
  }

  if (idx === -1) {
    idx = 0;

    for (let i = arr.length - 1; i >= 1; i--) {
      if (arr[i - 1]) {
        arr[i] = { ...arr[i - 1]! };
      } else {
        arr[i] = null;
      }
    }
  }

  if (!arr[idx]) {
    arr[idx] = new DamageFeedHit();
  }

  arr[idx]!.tick = tick;
  arr[idx]!.amount = amount;
  arr[idx]!.issuer = typeof issuerId === "number" ? issuerId : issuerId.id;
  arr[idx]!.weapon = weapon;

  if (typeof issuerId !== "number") {
    arr[idx]!.name = orig_playerMethods.getName.call(issuerId).name;
  }

  damageFeedUpdate(player, true);
}

export function damageFeedRemoveHit(
  arr: (DamageFeedHit | null)[],
  idx: number,
) {
  for (let i = 0; i < arr.length; i++) {
    if (i >= idx) {
      if (!arr[i]) {
        arr[i] = new DamageFeedHit();
      }
      arr[i]!.tick = 0;
    }
  }
}
