// GRAND LARCENY Property creation and management script
// by damospiderman 2008

import fs from "fs";
import path from "path";
import type { Player, IFilterScript } from "@infernus/core";
import {
  DynamicPickup,
  Dynamic3DTextLabel,
  PlayerEvent,
  DynamicPickupEvent,
} from "@infernus/core";
import type { E_INTERIORS, E_PROPERTIES } from "./interfaces";
import {
  MAX_INTERIORS,
  PROP_VW,
  TYPE_BANK,
  TYPE_BUSINESS,
  TYPE_COP,
  TYPE_HOUSE,
  propFile,
  propIcons,
} from "./constants";

//	[ Array of all the property interior info ]
const interiorInfo = new Map<number, E_INTERIORS>();

//	[ Pickup array with property id assigned via array slot ( pickupid ) ]
let propPickups: DynamicPickup[] = [];

//	[ Handles for 3D text displayed at property entrances ]
let propTextInfo: Dynamic3DTextLabel[] = [];

// 	[ Mass array of all the properties and info about them ]
const properties = new Map<DynamicPickup, E_PROPERTIES>();

//	[ The last pickup the player went through so they can do /enter command ]
const lastPickup = new Map<Player, DynamicPickup>();

//	[ Player Position array to store the last place the player was before /view command so they can be teleported back ]
const plPos = new Map<Player, [number, number, number]>();

//	[ Players actual interior id used for /view /return command ]
const plInt = new Map<Player, number>();

//  Keep track of what properties we've sent an /enter notification for
const gLastPropertyEnterNotification = new Map<Player, DynamicPickup>();

/********************************
 *   Interior Info Functions     *
 ********************************/
function getInteriorExit(id: number) {
  if (id > MAX_INTERIORS) return null;
  const data = interiorInfo.get(id);
  if (!data) return null;
  const x = data.inExitX;
  const y = data.inExitY;
  const z = data.inExitZ;
  const a = data.inExitA;
  return { x, y, z, a };
}

// Gets interior exit info from uniq Interior Id. Returns InteriorId or -1 if interior doesn't exist
function getInteriorExitInfo(uniqIntId: number) {
  const data = interiorInfo.get(uniqIntId);
  if (!data || uniqIntId >= MAX_INTERIORS) {
    return null;
  }
  const exitX = data.inExitX;
  const exitY = data.inExitY;
  const exitZ = data.inExitZ;
  const exitA = data.inExitA;
  const inIntID = data.inIntID;
  return { exitX, exitY, exitZ, exitA, inIntID };
}

function getInteriorIntID(id: number) {
  // Gets the interior id of a uniq Interior Id :S
  if (id > MAX_INTERIORS) return -1;
  return interiorInfo.get(id)?.inIntID;
}

function getInteriorName(id: number) {
  return interiorInfo.get(id)?.inName;
}

/********************************
 *  	 Property Functions  		*
 ********************************/

function getPropertyEntrance(id: DynamicPickup) {
  const data = properties.get(id);
  if (!data) return null;
  const x = data.eEntX;
  const y = data.eEntY;
  const z = data.eEntZ;
  const a = data.eEntA;
  return { x, y, z, a };
}

function getPropertyExit(id: DynamicPickup) {
  const data = properties.get(id);
  if (!data) return null;
  return getInteriorExit(data.eUniqIntId);
}

function getPropertyInteriorFileId(id: DynamicPickup) {
  const data = properties.get(id);
  if (!data) return 0;
  return data.eUniqIntId;
}

function getPropertyInteriorId(id: DynamicPickup) {
  const data = properties.get(id);
  if (!data) return 0;
  return getInteriorIntID(data.eUniqIntId) || 0;
}

/*********************************
 *   Property System Functions    *
 *********************************/

function readInteriorInfo(fileName: string) {
  return new Promise<string>((resolve, reject) => {
    const fullPath = path.resolve(process.cwd(), "scriptfiles", fileName);
    fs.readFile(fullPath, "utf8", (err, data) => {
      if (err) {
        // console.log(`Could Not Read Interiors file ( ${fileName} )`);
        return reject(err);
      }
      const lines = data
        .replaceAll("\r\n", "\n")
        .replaceAll(" ;", "")
        .split("\n");
      for (let i = 0; i < lines.length; i++) {
        const lineStr = lines[i];
        if (!lineStr) continue;
        const lineArr = lineStr.split(" ");
        const [uniqId, inIntID, inExitX, inExitY, inExitZ, inExitA] = lineArr;
        const inName = lineArr.slice(6).join(" ");
        interiorInfo.set(+uniqId, {
          inIntID: +inIntID,
          inExitX: +inExitX,
          inExitY: +inExitY,
          inExitZ: +inExitZ,
          inExitA: +inExitA,
          inName,
        });
        // console.log(
        //   `ReadInteriorInfo(${uniqId}, ${inIntID}, ${inExitX}, ${inExitY}, ${inExitZ}, ${inExitA} ( ${inName} ))`,
        // );
      }
      // console.log("Interiors File read successfully");
      resolve(data);
    });
  });
}

function readPropertyFile(fileName: string) {
  return new Promise<string>((resolve, reject) => {
    console.log("Reading File: %s", fileName);
    const fullPath = path.resolve(process.cwd(), "scriptfiles", fileName);
    fs.readFile(fullPath, "utf8", (err, data) => {
      if (err) return reject(err);
      const lines = data.replaceAll("\r\n", "\n").split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const [pIcon, enX, enY, enZ, enA, uniqIntId, others] = line.split(", ");
        if (!others) console.log(line);
        const p_type = others.split(" ;")[0];
        // const comment = others.split(' ;')[1];
        createProperty(+uniqIntId, +pIcon, +enX, +enY, +enZ, +enA, +p_type);
      }
      resolve(data);
    });
  });
}

function putPlayerInProperty(player: Player, prop: DynamicPickup, propVW = 0) {
  const { x, y, z, a } = getPropertyExit(prop)!;
  player.setPos(x, y, z);
  player.setFacingAngle(a);
  const interior = getPropertyInteriorId(prop);
  player.setInterior(interior);
  player.setVirtualWorld(propVW === 0 ? prop.id + PROP_VW : propVW);
  const intFileId = getPropertyInteriorFileId(prop);

  // const dbgString = `PutPlayerInProperty(${prop.id}): FileInt=${intFileId}`;
  // player.sendClientMessage(0xFFFFFFFF,dbgString);

  // the following will make the client shop scripts run if we tell it
  // the name of the shop.
  if (intFileId === 22) {
    player.setShopName("FDPIZA");
  } else if (intFileId === 47) {
    player.setShopName("FDBURG");
  } else if (intFileId === 130) {
    player.setShopName("FDCHICK");
  } else if (intFileId === 32) {
    player.setShopName("AMMUN1");
  } else if (intFileId === 96) {
    player.setShopName("AMMUN2");
  } else if (intFileId === 122) {
    player.setShopName("AMMUN3");
  } else if (intFileId === 123) {
    player.setShopName("AMMUN5");
  }
}

// Adds new property to property file
function addProperty(
  uniqIntId: number,
  entX: number,
  entY: number,
  entZ: number,
  entA: number,
  pType: number,
  comment = "",
) {
  const { inIntID: interiorId } = getInteriorExitInfo(uniqIntId)!;

  if (interiorId) {
    const tmp = `${propIcons[pType][0]}, ${entX}, ${entY}, ${entZ}, ${entA}, ${uniqIntId}, ${pType} ; //${comment}\n`;
    console.log("PropDB - %s", tmp);
    const fullPath = path.resolve(
      process.cwd(),
      "scriptfiles",
      propFile[pType],
    );
    fs.writeFile(fullPath, tmp, { flag: "a" }, () => {});
    return createProperty(
      uniqIntId,
      propIcons[pType][0],
      entX,
      entY,
      entZ,
      entA,
      pType,
    );
  }
  return -1;
}

function createProperty(
  uniqIntId: number,
  iconId: number,
  entX: number,
  entY: number,
  entZ: number,
  entA: number,
  pType: number,
  name = "",
  owner = -1,
  price = 0,
) {
  const pickup = new DynamicPickup({
    modelId: iconId,
    type: 23,
    x: entX,
    y: entY,
    z: entZ,
    worldId: 0,
  });
  // console.log(`CreateProperty(${uniqIntId}, ${iconId}, ${entX}, ${entY}, ${entZ}, ${entA}, ${p_type})`);
  pickup.create();
  propPickups.push(pickup);
  properties.set(pickup, {
    eEntX: entX,
    eEntY: entY,
    eEntZ: entZ,
    eEntA: entA,
    eUniqIntId: uniqIntId,
    eOwner: owner,
    ePrice: price,
    eType: pType,
    ePname: name,
  });
  if (pType === TYPE_HOUSE) {
    const text_info = "{FFFFFF}[{88EE88}House{FFFFFF}]";
    const text_label = new Dynamic3DTextLabel({
      text: text_info,
      color: 0x88ee88ff,
      x: entX,
      y: entY,
      z: entZ + 0.75,
      drawDistance: 20.0,
      worldId: 0,
      testLos: true,
    });
    text_label.create();
    propTextInfo.push(text_label);
  } else if (pType === TYPE_BUSINESS) {
    const text_info = "{FFFFFF}[{AAAAFF}Business{FFFFFF}]";
    const text_label = new Dynamic3DTextLabel({
      text: text_info,
      color: 0xaaaaffff,
      x: entX,
      y: entY,
      z: entZ + 0.75,
      drawDistance: 20.0,
      worldId: 0,
      testLos: true,
    });
    text_label.create();
    propTextInfo.push(text_label);
  } else if (pType === TYPE_BANK) {
    const text_info = "{FFFFFF}[{EEEE88}Bank{FFFFFF}]";
    const text_label = new Dynamic3DTextLabel({
      text: text_info,
      color: 0xeeee88ff,
      x: entX,
      y: entY,
      z: entZ + 0.75,
      drawDistance: 20.0,
      worldId: 0,
      testLos: true,
    });
    text_label.create();
    propTextInfo.push(text_label);
  } else if (pType === TYPE_COP) {
    const text_info = "{FFFFFF}[{EEEE88}Police Station{FFFFFF}]";
    const text_label = new Dynamic3DTextLabel({
      text: text_info,
      color: 0xeeee88ff,
      x: entX,
      y: entY,
      z: entZ + 0.75,
      drawDistance: 20.0,
      worldId: 0,
      testLos: true,
    });
    text_label.create();
    propTextInfo.push(text_label);
  }
  return pickup.id;
}

function propertyCommand(
  player: Player,
  cmd: string,
  subcommand: string[],
  pType: number,
) {
  if (player.getInterior() !== 0 || player.getVirtualWorld() !== 0) {
    player.sendClientMessage(
      0x550000ff,
      "You can only create properties in Interior 0 and VW 0",
    );
    return 1;
  }

  const { x, y, z } = player.getPos()!;
  const a = player.getFacingAngle();

  if (!subcommand[0]) {
    const string = `Usage: ${cmd} [uniqInteriorId] [optional-comment]`;
    player.sendClientMessage(0xff00cc, string);
    return 1;
  }
  if (Number.isNaN(+subcommand[0])) {
    player.sendClientMessage(0x550000, "Uniq Interior Id must be a number");
    return 1;
  }

  const uniqId = +subcommand[0];

  if (uniqId > MAX_INTERIORS || uniqId < 0) {
    player.sendClientMessage(0xffffcc, "Invalid Uniq Interior Id");
    return 1;
  }

  const comment = subcommand[1];
  let id: number;
  if (comment) {
    id = addProperty(uniqId, x, y, z, a, pType, comment);
  } else {
    id = addProperty(uniqId, x, y, z, a, pType);
  }

  if (id !== -1) {
    const interior = interiorInfo.get(uniqId)!;
    const tmp = `Property Type ( ${pType} ) Added Successfully: UniqId: ${id} Interior: ${interior.inIntID} IntName: ${interior.inName}`;
    player.sendClientMessage(0xcc7700, tmp);
  } else {
    player.sendClientMessage(
      0x00ff55,
      "Error: Something went wrong/Property Limit Reached",
    );
  }
  return 1;
}

function loadProperties() {
  unloadProperties();
  readInteriorInfo("properties/interiors.txt");
  for (let i = 0; i < propFile.length; i++) {
    readPropertyFile(propFile[i]);
  }
  return 1;
}

function unloadProperties() {
  propPickups.forEach((pickup) => {
    if (pickup.isValid()) {
      pickup.destroy();
      properties.delete(pickup);
    }
  });
  propPickups = [];
  properties.clear();

  interiorInfo.clear();

  propTextInfo.forEach((text_label) => {
    if (text_label.isValid()) {
      text_label.destroy();
    }
  });

  propTextInfo = [];

  lastPickup.clear();

  plPos.clear();
  plInt.clear();

  gLastPropertyEnterNotification.clear();
}

export const GlProperty: IFilterScript = {
  name: "gl_property",
  load() {
    loadProperties();

    const onInteriorChange = PlayerEvent.onInteriorChange(
      ({ player, newInteriorId, next }) => {
        if (newInteriorId === 0) {
          player.setVirtualWorld(0);
        }
        return next();
      },
    );

    const onSpawn = PlayerEvent.onSpawn(({ player, next }) => {
      gLastPropertyEnterNotification.delete(player);
      return next();
    });

    const onPlayerPickUp = DynamicPickupEvent.onPlayerPickUp(
      ({ player, pickup, next }) => {
        // console.log(`DEBUG: Player ${player.id} pickedup Pickup %d Prop Id ${pickup.id}`);
        lastPickup.set(player, pickup);
        const prop = properties.get(pickup);
        if (!prop) return next();
        if (prop.eType > 0) {
          if (gLastPropertyEnterNotification.get(player) !== pickup) {
            gLastPropertyEnterNotification.set(player, pickup);
            switch (prop.eType) {
              case TYPE_HOUSE: {
                const pmsg = "* House: type /enter to enter";
                player.sendClientMessage(0xff55bbff, pmsg);
                return next();
              }

              case TYPE_BUSINESS: {
                const pmsg = "* Business: type /enter to enter";
                player.sendClientMessage(0xff55bbff, pmsg);
                return next();
              }

              case TYPE_BANK: {
                const pmsg = "* Bank: type /enter to enter";
                player.sendClientMessage(0xff55bbff, pmsg);
                return next();
              }

              case TYPE_COP: {
                const pmsg = "* Police Station: type /enter to enter";
                player.sendClientMessage(0xff55bbff, pmsg);
                return next();
              }
            }
          }
        } else
          player.sendClientMessage(
            0xff9900ff,
            "This property doesn't exist :S",
          );

        return next();
      },
    );

    // function commands.
    const enter = PlayerEvent.onCommandText("enter", ({ player, next }) => {
      // enter property
      const pickup = lastPickup.get(player);
      if (!pickup) return next();
      const props = properties.get(pickup);
      if (pickup && props && props.eType > 0) {
        const { x, y, z } = getPropertyEntrance(pickup)!;
        if (player.isInRangeOfPoint(3.0, x, y, z)) {
          putPlayerInProperty(player, pickup);
          player.sendClientMessage(
            0x55aaddff,
            "* You have entered a property.. type /exit to leave",
          );
          return next();
        }
      }
      return next();
    });

    const exit = PlayerEvent.onCommandText("exit", ({ player, next }) => {
      // exit property
      const pickup = lastPickup.get(player);
      if (pickup === undefined) return next();
      if (player.getInterior() === getPropertyInteriorId(pickup)) {
        // make sure they're near the exit before allowing them to exit.
        const { x: inExitX, y: inExitY, z: inExitZ } = getPropertyExit(pickup)!;
        if (!player.isInRangeOfPoint(4.5, inExitX, inExitY, inExitZ)) {
          player.sendClientMessage(
            0xddaa55ff,
            "* You must be near the property exit to /exit",
          );
          return next();
        }

        const { x, y, z, a } = getPropertyEntrance(pickup)!;
        player.setPos(x, y, z);
        player.setFacingAngle(a);
        player.setInterior(0);
        player.setVirtualWorld(0);
      }
      return next();
    });

    // The rest of the commands here are for
    // property creation which is admin only.

    const chouse = PlayerEvent.onCommandText(
      "chouse",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return false;
        // creates a house type property
        propertyCommand(player, "chouse", subcommand, TYPE_HOUSE);
        return next();
      },
    );

    const cbus = PlayerEvent.onCommandText(
      "cbus",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return false;
        // creates a business type property
        propertyCommand(player, "cbus", subcommand, TYPE_BUSINESS);
        return next();
      },
    );

    const ccop = PlayerEvent.onCommandText(
      "ccop",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return false;
        // creates a police station property
        propertyCommand(player, "ccop", subcommand, TYPE_COP);
        return next();
      },
    );

    const cbank = PlayerEvent.onCommandText(
      "cbank",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return false;
        // creates a bank type property
        propertyCommand(player, "cbank", subcommand, TYPE_BANK);
        return next();
      },
    );

    const view = PlayerEvent.onCommandText(
      "view",
      ({ player, subcommand, next }) => {
        if (!player.isAdmin()) return false;
        //Basically lets you view an interior from the interiors.txt file by id
        if (!subcommand[0]) {
          player.sendClientMessage(0xff00cc, `Usage: view [uniqInteriorId]`);
          return next();
        }
        if (Number.isNaN(+subcommand[0])) {
          player.sendClientMessage(
            0x550000,
            "Uniq Interior Id must be a number",
          );
          return next();
        }

        const uniqId = +subcommand[0];

        if (uniqId > MAX_INTERIORS || uniqId < 0) {
          player.sendClientMessage(0xffffcc, "Invalid Uniq Interior Id");
          return next();
        }
        if (player.getInterior() === 0) {
          const pos = player.getPos()!;
          plPos.set(player, [pos.x, pos.y, pos.z]);
          plInt.set(player, 0);
        }
        const { x, y, z, a } = getInteriorExit(uniqId)!;
        player.setInterior(getInteriorIntID(uniqId)!);
        player.setPos(x, y, z);
        player.setFacingAngle(a);
        const string =
          `UniqId: ${uniqId} InteriorId: ${getInteriorIntID(uniqId)}` +
          ` Name: ${getInteriorName(uniqId)} | Use /return to go to last position`;
        player.sendClientMessage(0x556600ff, string);
        return next();
      },
    );

    const retCmd = PlayerEvent.onCommandText("return", ({ player, next }) => {
      if (!player.isAdmin()) return false;
      // return from /view command to last position
      const pos = plPos.get(player);
      if (!pos) return;
      const interior = plInt.get(player);
      if (interior === undefined) return;
      player.setPos(pos[0], pos[1], pos[2]);
      player.setInterior(interior);
      return next();
    });

    console.log("\n-----------------------------------");
    console.log("Grand Larceny Property FilterScript		");
    console.log("-----------------------------------\n");

    return [
      onInteriorChange,
      onSpawn,
      onPlayerPickUp,
      enter,
      exit,
      chouse,
      cbus,
      ccop,
      cbank,
      view,
      retCmd,
    ];
  },
  unload() {
    unloadProperties();
  },
};
