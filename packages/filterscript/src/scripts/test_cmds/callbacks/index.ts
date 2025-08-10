// import fs from "node:fs";
// import path from "node:path";
import {
  // BulletHitTypesEnum,
  // DynamicActorEvent,
  DynamicObjectEvent,
  EditResponseTypesEnum,
  // GameMode,
  // InvalidEnum,
  // Player,
  PlayerEvent,
  TextDrawEvent,
  // VehicleEvent,
} from "@infernus/core";
export function createCallbacks() {
  const offPlayerClickGlobal = TextDrawEvent.onPlayerClickGlobal(
    ({ player, textDraw, next }) => {
      const msg = `(TextDraw) You selected: ${typeof textDraw === "number" ? textDraw : textDraw.id}"`;
      player.sendClientMessage(0xffffffff, msg);
      return next();
    },
  );

  const offPlayerClickPlayer = TextDrawEvent.onPlayerClickPlayer(
    ({ player, textDraw, next }) => {
      const msg = `(PlayerTextDraw) You selected: ${typeof textDraw === "number" ? textDraw : textDraw.id}"`;
      player.sendClientMessage(0xffffffff, msg);
      return next();
    },
  );

  // Example of handling scoreboard click.

  const onClickPlayer = PlayerEvent.onClickPlayer(
    ({ player, clickedPlayer, next }) => {
      if (!player.isAdmin()) return next(); // this is an admin only script
      const message = `You clicked on player ${clickedPlayer.id}`;
      player.sendClientMessage(0xffffffff, message);
      return next();
    },
  );

  const onClickMap = PlayerEvent.onClickMap(({ player, fX, fY, fZ, next }) => {
    const message = `You place marker at point: ${fX} ${fY} ${fZ}`;
    player.sendClientMessage(0xffffffff, message);
    player.setPos(fX, fY, fZ);
    return next();
  });

  // DynamicObjectEvent.onPlayerEditAttached(
  //   ({
  //     player,
  //     index,
  //     modelId,
  //     boneId,
  //     fOffsetX,
  //     fOffsetY,
  //     fOffsetZ,
  //     fRotX,
  //     fRotY,
  //     fRotZ,
  //     fScaleX,
  //     fScaleY,
  //     fScaleZ,
  //     next,
  //   }) => {
  //     player.sendClientMessage(
  //       0xffffffff,
  //       "You finished editing an attached object",
  //     );
  //     player.setAttachedObject(
  //       index,
  //       modelId,
  //       boneId,
  //       fOffsetX,
  //       fOffsetY,
  //       fOffsetZ,
  //       fRotX,
  //       fRotY,
  //       fRotZ,
  //       fScaleX,
  //       fScaleY,
  //       fScaleZ,
  //     );
  //     return next();
  //   },
  // );

  const onPlayerEdit = DynamicObjectEvent.onPlayerEdit(
    ({ object, player, x, y, z, rX, rY, rZ, response, next }) => {
      if (!object.isValid()) return next();
      object.move(x, y, z, 10.0, rX, rY, rZ);
      if (
        response === EditResponseTypesEnum.FINAL ||
        response === EditResponseTypesEnum.CANCEL
      ) {
        // put them back in selection mode after they click save
        player.beginObjectSelecting();
      }

      return next();
    },
  );

  const onPlayerSelect = DynamicObjectEvent.onPlayerSelect(
    ({ player, object, modelId, x, y, z, next }) => {
      if (!object.isValid()) return next();
      const _x = x.toFixed(4);
      const _y = y.toFixed(4);
      const _z = z.toFixed(4);
      const message = `(DynamicObject) You selected: ${object.id} model: ${modelId} Pos: ${_x},${_y},${_z}`;
      player.sendClientMessage(0xffffffff, message);
      object.edit(player);
      return next();
    },
  );

  // PlayerEvent.onWeaponShot(
  //   ({ player, weapon, hitType, hitId, fX, fY, fZ, next }) => {
  //     let message = "";
  //     const weaponName = GameMode.getWeaponName(weapon);

  //     const fX2 = fX.toFixed(2);
  //     const fY2 = fY.toFixed(2);
  //     const fZ2 = fZ.toFixed(2);

  //     if (hitType === BulletHitTypesEnum.PLAYER) {
  //       const animIndex = Player.getInstance(hitId)!.getAnimationIndex();
  //       message = `Shooter(${player.id}) hit Player(${hitId}) PlayerAnim: ${animIndex} Using: ${weaponName} [${fX2}, ${fY2}, ${fZ2}]\n`;
  //     } else if (hitType === BulletHitTypesEnum.VEHICLE) {
  //       message = `Shooter(${player.id}) hit Vehicle(${hitId}) Using: ${weaponName} [${fX2}, ${fY2}, ${fZ2}]\n`;
  //     } else if (hitType === BulletHitTypesEnum.NONE) {
  //       message = `Shooter(${player.id}) hit World Using: ${weaponName} [${fX2}, ${fY2}, ${fZ2}]\n`;
  //     } else {
  //       message = `Shooter(${player.id}) hit Object(${hitId}) Using: ${weaponName} [${fX2}, ${fY2}, ${fZ2}]\n`;
  //     }

  //     // const { fOriginX, fOriginY, fOriginZ, fHitPosX, fHitPosY, fHitPosZ } =
  //     //   player.getLastShotVectors();
  //     // const lastVectors = `Last Vectors: [${fOriginX.toFixed(2)}, ${fOriginY.toFixed(2)}, ${fOriginZ.toFixed(2)}] [${fHitPosX.toFixed(2)}, ${fHitPosY.toFixed(2)}, ${fHitPosZ.toFixed(2)}]`;
  //     // player.sendClientMessage(0xFFFFFFFF, lastVectors);

  //     player.sendClientMessage(0xffffffff, message);
  //     return next();
  //   },
  // );

  // let lastShotTime = 0;
  // let lastShotWeapon = 0;

  // PlayerEvent.onWeaponShot(({ player, weapon, next }) => {
  //   if (!lastShotTime) {
  //     lastShotTime = Date.now();
  //     return next();
  //   }
  //   if (weapon === lastShotWeapon) {
  //     const message = `WeaponId: ${weapon} LastShotDelta: ${Date.now() - lastShotTime}`;
  //     player.sendClientMessage(0xffffffff, message);
  //     console.log(message);
  //   }
  //   lastShotWeapon = weapon;
  //   lastShotTime = Date.now();
  //   return next();
  // });

  // Example of TakeDamage
  // PlayerEvent.onTakeDamage(
  //   ({ player, damage, amount, weapon, bodyPart, next }) => {
  //     const fullPath = path.resolve(
  //       process.cwd(),
  //       "scriptfiles",
  //       "playershots.txt",
  //     );
  //     let message = "";
  //     if (damage !== InvalidEnum.PLAYER_ID) {
  //       const weaponName = GameMode.getWeaponName(weapon);
  //       message = `PlayerTakeDamage(${player.id}) from Player(${damage.id}) (${amount}) weapon: (${weaponName}) bodyPart: ${bodyPart}\n`;
  //     } else {
  //       message = `PlayerTakeDamage(${player.id}) (${amount}) from: ${weapon}\n`;
  //     }
  //     fs.writeFile(fullPath, message, { flag: "a" }, () => {
  //       Player.sendClientMessageToAll(0xffffffff, message);
  //     });
  //     return next();
  //   },
  // );

  // Example of GiveDamage
  // PlayerEvent.onGiveDamage(
  //   ({ player, weapon, bodyPart, damage, amount, next }) => {
  //     const fullPath = path.resolve(
  //       process.cwd(),
  //       "scriptfiles",
  //       "playershots.txt",
  //     );
  //     const weaponName = GameMode.getWeaponName(weapon);
  //     const message = `PlayerGiveDamage(${player.id}) to Player(${damage.id}) (${amount}) weapon: (${weaponName}) bodyPart: ${bodyPart}\n`;
  //     fs.writeFile(fullPath, message, { flag: "a" }, () => {
  //       Player.sendClientMessageToAll(0xffffffff, message);
  //     });
  //     return next();
  //   },
  // );

  // DynamicActorEvent.onPlayerGiveDamage(
  //   ({ player, actor, amount, weapon, bodyPart, next }) => {
  //     const weaponName = GameMode.getWeaponName(weapon);
  //     const message = `PlayerGiveDamageActor(${player.id}) to Actor(${actor.id}) (${amount}) weapon: (${weaponName}) bodyPart: ${bodyPart}\n`;
  //     Player.sendClientMessageToAll(0xffffffff, message);

  //     if (actor.isValid()) {
  //       let fActorHealth = actor.getHealth().health;
  //       fActorHealth -= amount;
  //       if (fActorHealth < 0.0) fActorHealth = 0.0;
  //       actor.setHealth(fActorHealth);
  //     }
  //     return next();
  //   },
  // );

  // PlayerEvent.onDeath(({ player, killer, reason, next }) => {
  //   player.sendDeathMessage(killer, reason);
  //   return next();
  // });

  // PlayerEvent.onEnterExitModShop(({ player, enterExit, interior, next }) => {
  //   let message = "";
  //   if (enterExit) {
  //     message = `You entered modshop at interior ${interior}`;
  //   } else {
  //     message = `You exited the modshop`;
  //   }
  //   player.sendClientMessage(0xffffffff, message);
  //   return next();
  // });

  // VehicleEvent.onDamageStatusUpdate(({ vehicle, player, next }) => {
  //   if (!player.isAdmin()) return next();
  //   const { panels, doors, lights, tires } = vehicle.getDamageStatus();
  //   const updateMsg = `VehicleDamage[ID:${vehicle.id} PN:0x${panels.toString(16)} DR:0x${doors.toString(16)} LT:0x${lights.toString(16)} TR:0x${tires.toString(16)}]`;
  //   player.sendClientMessage(0xffffffff, updateMsg);
  //   return next();
  // });

  // VehicleEvent.onUnoccupiedUpdate(
  //   ({ player, vehicle, passengerSeat, newX, newY, newZ, next }) => {
  //     if (!player.isAdmin()) return next();
  //     const { x, y, z } = vehicle.getPos();

  //     const x2 = x.toFixed(2);
  //     const y2 = y.toFixed(2);
  //     const z2 = z.toFixed(2);

  //     const newX2 = newX.toFixed(2);
  //     const newY2 = newY.toFixed(2);
  //     const newZ2 = newZ.toFixed(2);

  //     const updateMsg = `NoDriverVehicleUpdate(playerid=${player.id} vehicle=${vehicle.id} passenger=${passengerSeat} cur_pos: ${x2} ${y2} ${z2} new_pos: ${newX2} ${newY2} ${newZ2}`;
  //     Player.sendClientMessageToAll(0xffffffff, updateMsg);
  //     return next();
  //   },
  // );

  return [
    offPlayerClickGlobal,
    offPlayerClickPlayer,
    onClickPlayer,
    onClickMap,
    onPlayerEdit,
    onPlayerSelect,
  ];
}
