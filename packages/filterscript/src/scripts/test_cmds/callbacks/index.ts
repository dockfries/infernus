import {
  DynamicObjectEvent,
  EditResponseTypesEnum,
  PlayerEvent,
  TextDrawEvent,
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

  //-------------------------------------------
  // Example of handling dialog responses.

  // public OnDialogResponse(playerid, dialogid, response, listitem, inputtext[])
  // {
  //   if (!IsPlayerAdmin(playerid)) return 0; // this is an admin only script

  //   if (dialogid == 0) { // Our example msgbox
  //     if (response) {
  //       SendClientMessage(playerid, 0xFFFFFFFF, "You selected OK");
  //     } else {
  //       SendClientMessage(playerid, 0xFFFFFFFF, "You selected Cancel");
  //     }
  //     return 1; // we processed this. no need for other filterscripts to process it.
  //   }

  //   if (dialogid == 1) { // Our example inputbox
  //     if (response) {
  //       new message[256 + 1];
  //       format(message, 256, "You replied: %s", inputtext);
  //       SendClientMessage(playerid, 0xFFFFFFFF, message);
  //     } else {
  //       SendClientMessage(playerid, 0xFFFFFFFF, "You selected Cancel");
  //     }
  //     return 1; // we processed it.
  //   }

  //   if (dialogid == 2) { // Our example listbox
  //     if (response) {
  //       new message[256 + 1];
  //       format(message, 256, "You selected item %d:", listitem);
  //       SendClientMessage(playerid, 0xFFFFFFFF, message);
  //       SendClientMessage(playerid, 0xFFFFFFFF, inputtext);
  //     } else {
  //       SendClientMessage(playerid, 0xFFFFFFFF, "You selected Cancel");
  //     }
  //     return 1; // we processed it.
  //   }

  //   return 0; // we didn't handle anything.
  // }

  //-------------------------------------------

  //-------------------------------------------
  /*
  public OnPlayerEditAttachedObject( playerid, response, index, modelid, boneid,
                    Float:fOffsetX, Float:fOffsetY, Float:fOffsetZ,
                    Float:fRotX, Float:fRotY, Float:fRotZ,
                      Float:fScaleX, Float:fScaleY, Float:fScaleZ )
  {
    SendClientMessage(playerid, 0xFFFFFFFF, "You finished editing an attached object");
    SetPlayerAttachedObject(playerid,index,modelid,boneid,fOffsetX,fOffsetY,fOffsetZ,fRotX,fRotY,fRotZ,fScaleX,fScaleY,fScaleZ);
    return 1;
  }*/

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

  //-------------------------------------------
  /*
  public OnPlayerWeaponShot(playerid, weaponid, hittype, hitid, Float:fX, Float:fY, Float:fZ)
  {
      new message[256+1];
      new weaponname[64+1];
    new File:file = fopen("playershots.txt",io_append);

    GetWeaponName(weaponid, weaponname, 64);

    if(hittype == BULLET_HIT_TYPE_PLAYER) {
      format(message,256,"Shooter(%d) hit Player(%d) PlayerAnim: %d Using: %s [%.2f, %.2f, %.2f]\r\n", playerid, hitid,
          GetPlayerAnimationIndex(hitid), weaponname, fX, fY, fZ);
    }
    else if(hittype == BULLET_HIT_TYPE_VEHICLE) {
        format(message,256,"Shooter(%d) hit Vehicle(%d) Using: %s [%.2f, %.2f, %.2f]\r\n",playerid, hitid, weaponname, fX, fY, fZ);
    }
    else if(hittype == BULLET_HIT_TYPE_NONE) {
        format(message,256,"Shooter(%d) hit World Using: %s [%.2f, %.2f, %.2f]\r\n",playerid,weaponname,fX,fY,fZ);
    }
    else {
        format(message,256,"Shooter(%d) hit Object(%d) Using: %s [%.2f, %.2f, %.2f]\r\n",playerid, hitid, weaponname, fX, fY, fZ);
    }

    fwrite(file, message);
    fclose(file);

    //new LastVectors[128+1];
    //new Float:OriginX, Float:OriginY, Float:OriginZ;
    //new Float:HitX, Float:HitY, Float:HitZ;
    //GetPlayerLastShotVectors(playerid, OriginX, OriginY, OriginZ, HitX, HitY, HitZ);
    //format(LastVectors, 128, "Last Vectors: [%.2f, %.2f, %.2f] [%.2f, %.2f, %.2f]", OriginX, OriginY, OriginZ, HitX, HitY, HitZ);
    //SendClientMessage(playerid, 0xFFFFFFFF, LastVectors);

    SendClientMessage(playerid, 0xFFFFFFFF, message);
      return 1;
  }*/

  //-------------------------------------------
  /*
  new LastShotTime = 0;
  new LastShotWeapon = 0;

  public OnPlayerWeaponShot(playerid, weaponid, hittype, hitid, Float:fX, Float:fY, Float:fZ)
  {
    new message[128+1];

    if(!LastShotTime) {
        LastShotTime = GetTickCount();
        return 1;
    }

    if(weaponid == LastShotWeapon) {
      format(message, 128, "WeaponId: %d LastShotDelta: %d", weaponid, GetTickCount() - LastShotTime);
      SendClientMessage(playerid, 0xFFFFFFFF, message);
        printf("%s", message);
    }

    LastShotWeapon = weaponid;
    LastShotTime = GetTickCount();

      return 1;
  }*/

  //-------------------------------------------
  // Example of TakeDamage
  /*
  public OnPlayerTakeDamage(playerid, issuerid, Float:amount, weaponid, bodypart)
  {
    new File:file = fopen("playershots.txt",io_append);
      new message[256+1];
      new weapname[64+1];

    if(issuerid != INVALID_PLAYER_ID) {
        GetWeaponName(weaponid, weapname, 64);
      format(message, 256, "PlayerTakeDamage(%d) from Player(%d) (%f) weapon: (%s) bodypart: %d\r\n", playerid, issuerid, amount, weapname, bodypart);
      SendClientMessageToAll(0xFFFFFFFF, message);
    }
    else {
      format(message, 256, "PlayerTakeDamage(%d) (%f) from: %d\r\n", playerid, amount, weaponid);
      SendClientMessageToAll(0xFFFFFFFF, message);
    }

    fwrite(file, message);
    fclose(file);
  }*/

  //-------------------------------------------
  // Example of GiveDamage
  /*
  public OnPlayerGiveDamage(playerid, damagedid, Float:amount, weaponid, bodypart)
  {
    new File:file = fopen("playershots.txt",io_append);
      new message[256+1];
      new weapname[64+1];

      GetWeaponName(weaponid, weapname, 64);
    format(message, 256, "PlayerGiveDamage(%d) to Player(%d) (%f) weapon: (%s) bodypart: %d\r\n", playerid, damagedid, amount, weapname, bodypart);

    fwrite(file, message);
    fclose(file);
    SendClientMessageToAll(0xFFFFFFFF, message);
  }*/

  //-------------------------------------------
  /*
  public OnPlayerGiveDamageActor(playerid, damaged_actorid, Float:amount, weaponid, bodypart)
  {
      new message[256+1];
      new weapname[64+1];

      GetWeaponName(weaponid, weapname, 64);
      format(message, 256, "PlayerGiveDamageActor(%d) to Actor(%d) (%f) weapon: (%s) bodypart: %d\r\n", playerid, damaged_actorid, amount, weapname, bodypart);
      SendClientMessageToAll(0xFFFFFFFF, message);

    if(IsValidActor(damaged_actorid)) {
        new Float:fActorHealth;
        GetActorHealth(damaged_actorid, fActorHealth);
        fActorHealth -= amount;
      if(fActorHealth < 0.0) fActorHealth = 0.0;
      SetActorHealth(damaged_actorid, fActorHealth);
    }
  }
  */ /*
  public OnPlayerDeath(playerid, killerid, reason)
  {
      SendDeathMessage(killerid, playerid, reason);
      return 1;
  }*/

  //-------------------------------------------
  /*
  public OnEnterExitModShop(playerid, enterexit, interiorid)
  {
      new message[256+1];
      if(enterexit) {
      format(message, 256, "You entered modshop at interior %d", interiorid);
      SendClientMessage(playerid, 0xFFFFFFFF, message);
    } else {
          format(message, 256, "You exited the modshop");
      SendClientMessage(playerid, 0xFFFFFFFF, message);
    }
    return 1;
  }
  */ /*
  public OnVehicleDamageStatusUpdate(vehicleid, playerid)
  {
    new panel, doors, lights, tires;
    new update_msg[128+1];
    
    if(!IsPlayerAdmin(playerid)) return 0;
    
    GetVehicleDamageStatus(vehicleid,panel,doors,lights,tires);
    format(update_msg,128,"VehicleDamage[ID:%d PN:0x%x DR:0x%x LT:0x%x TR:0x%x]",vehicleid,panel,doors,lights,tires);
    SendClientMessage(playerid,0xFFFFFFFF,update_msg);
    
    return 1;
  }*/
  /*
  public OnUnoccupiedVehicleUpdate(vehicleid, playerid, passenger_seat, Float:new_x, Float:new_y, Float:new_z)
  {
      new update_msg[128+1];
      new Float:X, Float:Y, Float:Z;
      
      //if(!IsPlayerAdmin(playerid)) return 0;
      
      GetVehiclePos(vehicleid, X, Y, Z);

      format(update_msg,128,"NoDriverVehicleUpdate(playerid=%d vehicle=%d passenger=%d cur_pos: %.2f %.2f %.2f new_pos: %.2f %.2f %.2f)",
      playerid, vehicleid, passenger_seat, X, Y, Z, new_x, new_y, new_z);
        
    SendClientMessageToAll(0xFFFFFFFF,update_msg);
    
    return 1;
  }*/

  return [
    offPlayerClickGlobal,
    offPlayerClickPlayer,
    onClickPlayer,
    onClickMap,
    onPlayerEdit,
    onPlayerSelect,
  ];
}
