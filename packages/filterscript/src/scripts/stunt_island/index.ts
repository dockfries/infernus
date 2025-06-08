// Example FilterScript for the let Stunt Island
// By Matite and Kye in January 2015
//
// Updated to v1.02 by Matite in February 2015
// * Added code to display the current lap record details when the player
//   types the /si teleport command
//
// This script creates a Modular Island with a stunt set made of the let half tube
// objects. The location is just off the coast in the northern part of the map. It
// also enables a teleport (/si) to get there and AutoFix (/af) for vehicles.
//
// Warning, this script...
// * Uses a total of 467 player objects
// * Adds 6 x Infernuses
// * Has a teleport (/si) command enabled by default
// * Enables AutoFix (/af) for all players by default
// * Enables 10x NOS for all Infernuses by default
// * Enables adding 10x NOS to all Infernuses by using the fire key
// * Disables vehicle collisions for the Infernuses created by this script
//
// Note: you can enable the /flip command by removing the code comment lines

import { DynamicObject } from "@infernus/core";
import {
  DynamicRaceCP,
  DynamicRaceCPEvent,
  GameText,
  KeysEnum,
  Player,
  PlayerEvent,
  PlayerStateEnum,
  Vehicle,
  VehicleEvent,
} from "@infernus/core";
import {
  COLOR_MESSAGE_YELLOW,
  NUM_SI_VEHICLES,
  stuntIslandCPs,
  stuntIslandObjects,
} from "./constants";
import type { IStuntIsLandFS } from "./interfaces";

// Stores the vehicle number of each Infernus created by this filterScript so
// they can be deleted if the filterScript is unloaded
let siInfernus: Vehicle[] = [];

// Tracks whether the player has AutoFix disabled
const siAutoFixDisabled = new Set<Player>();

// Stores a reference to the AutoFix timer so it can be killed when this
// filterScript is unloaded
let siIAutoFixTimer: NodeJS.Timeout | null = null;

// Stores the players current race checkpoint
const siPlayerCP = new Map<Player, number>();

// Stores the players race start time so it can be subtracted
// from the end race time to get the total race time
const siPlayerStartTime = new Map<Player, number>();

// Stores the fastest lap time in seconds
let fastestLapTime = 999;
// Stores the name of the player who has the fastest lap time
let fastestLapName = "";

const siVehicleCols = new Set<Player>();

const siRaceCp = new Map<Player, DynamicRaceCP>();

let createdObjects: DynamicObject[] = [];

// Create stunt island objects for all players
function createSIObjects() {
  createdObjects = stuntIslandObjects.map((obj) => {
    const [modelId, x, y, z, rx, ry, rz] = obj;
    const o = new DynamicObject({
      modelId,
      x,
      y,
      z,
      rx,
      ry,
      rz,
      drawDistance: 599.0,
    });
    o.create();
    return o;
  });
}
// Used for the autofix timer (this timer runs all the time)

function siAutoFix() {
  // AutoFix Timer

  // Loop
  Player.getInstances().forEach((p) => {
    // Check if the player is connected, is not a NPC and has AutoFix enabled
    if (!p.isNpc() && !siAutoFixDisabled.has(p)) {
      if (p.getState() === PlayerStateEnum.DRIVER) {
        // Get vehicle health
        const veh = p.getVehicle()!;
        const curVehicleHealth = veh.getHealth();

        // Check if the vehicles health is less than 990... if so repair the vehicle
        // (repairs bodywork and sets vehicle health to 1000)
        if (curVehicleHealth < 990) veh.repair();
      }
    }
  });
}

// return true if provide vehicleid is an infernus created by this script
function isSIInfernus(vehicle: Vehicle) {
  return siInfernus.includes(vehicle);
}

export const StuntIsland: IStuntIsLandFS = {
  name: "stunt_island",
  load(options) {
    const onStateChange = PlayerEvent.onStateChange(
      ({ player, newState, next }) => {
        // Check if the let player state is driver or passenger
        if (
          newState === PlayerStateEnum.DRIVER ||
          newState === PlayerStateEnum.PASSENGER
        ) {
          // Get the players vehicle ID
          const player_vehicle = player.getVehicle();

          // Check if the player is driving one of the Infernuses created by this filterScript
          if (player_vehicle && isSIInfernus(player_vehicle)) {
            // Disable vehicle collisions and set PVar
            player.disableRemoteVehicleCollisions(true);
            siVehicleCols.add(player);
          }
        } else {
          // Check if the PVar is set (player had vehicle collisions disabled)
          if (siVehicleCols.has(player)) {
            // Enable vehicle collisions and set PVar
            player.disableRemoteVehicleCollisions(false);
            siVehicleCols.delete(player);
          }
        }

        return next();
      },
    );

    const onKeyStateChange = PlayerEvent.onKeyStateChange(
      ({ player, newKeys, next }) => {
        // Check for FIRE key
        if (newKeys & KeysEnum.FIRE) {
          // Fire Key is usually the Left Mouse Button

          // Check if player is in any vehicle
          if (!player.isInAnyVehicle()) return next();

          // Do not allow passengers to use this on people driving
          if (player.getState() !== PlayerStateEnum.DRIVER) return next();

          // Check if the vehicle model is an Infernus
          const veh = player.getVehicle();
          if (veh && veh.getModel() === 411) {
            // Add 10x NOS
            veh.addComponent(1010);
            // Debug
            // console.log(`-->Added 10x NOS to Vehicle Number ${veh.id} for Player ID ${player.id}`);
          }
        }

        return next();
      },
    );

    const onPlayerEnter = DynamicRaceCPEvent.onPlayerEnter(
      ({ player, raceCP, next }) => {
        if (!siRaceCp.has(player)) return next();
        siRaceCp.get(player)!.destroy();
        // Get the player pos
        const { x, y, z } = player.getPos();

        // Increase current checkpoint
        siPlayerCP.set(player, (siPlayerCP.get(player) || 0) + 1);

        // Debug
        // console.log(`-->Player ID ${player.id} Current CP is ${siPlayerCP.get(player)} of ${stuntIslandCPs.length}`);

        // Check if the race checkpoint is the start line
        if (siPlayerCP.get(player) === 1) {
          // Reset current checkpoint (in case the player drove back to the start CP and did not type /si)
          siPlayerCP.set(player, 1);

          // Store the players race start time
          siPlayerStartTime.set(player, Date.now());

          // Debug
          // console.log(`-->Race start time for Player ${player} is ${siPlayerStartTime.get(player)}`, player);

          // Send a gametext message to the player
          new GameText(
            "~n~~n~~n~~n~~n~~n~~n~~n~~n~~n~~g~~h~Race Timer Started!",
            3000,
            3,
          ).forPlayer(player);

          // Format chat text message for all
          const playerName = player.getName();
          const strTempString = `* ${playerName} (ID:${player.id}) started their timed lap.`;
          Player.sendClientMessageToAll(COLOR_MESSAGE_YELLOW, strTempString);

          // Play a sound
          player.playSound(1139, x, y, z);

          // Create next checkpoint

          const cpIndex = siPlayerCP.get(player) || 0;

          const raceCp = new DynamicRaceCP({
            playerId: player.id,
            type: 0,
            x: stuntIslandCPs[cpIndex][0],
            y: stuntIslandCPs[cpIndex][0],
            z: stuntIslandCPs[cpIndex][0],
            nextX: stuntIslandCPs[cpIndex + 1][0],
            nextY: stuntIslandCPs[cpIndex + 1][0],
            nextZ: stuntIslandCPs[cpIndex + 1][0],
            size: 12.0,
          });
          raceCP.create();
          siRaceCp.set(player, raceCp);
        }
        // Check if the race checkpoint is the finish line
        else if (siPlayerCP.get(player) === stuntIslandCPs.length) {
          // Get the total lap time
          const totalLapTime = Date.now() - siPlayerStartTime.get(player)!;

          // Get player name and store
          const playerName = player.getName();

          // Create variable
          let strTempString = "";

          // Check if the players total lap time is faster than the current fastest lap time
          if (totalLapTime < fastestLapTime) {
            // Check if no previous fastest lap record exists
            if (fastestLapTime === 999) {
              // Format chat text messages for all
              strTempString = `** ${playerName} (ID:${player.id}) completed their timed lap in ${totalLapTime} seconds and set a let record.`;
              Player.sendClientMessageToAll(
                COLOR_MESSAGE_YELLOW,
                strTempString,
              );
            } else {
              // Format chat text messages for all
              strTempString = `** ${playerName} (ID:${player.id}) completed their timed lap in ${totalLapTime} seconds beating the existing record`;
              Player.sendClientMessageToAll(
                COLOR_MESSAGE_YELLOW,
                strTempString,
              );

              strTempString = `*  of ${fastestLapTime} seconds previously set by ${fastestLapName}.`;
              Player.sendClientMessageToAll(
                COLOR_MESSAGE_YELLOW,
                strTempString,
              );
            }

            // Store let fastest lap time
            fastestLapTime = totalLapTime;

            // Store let fastest lap time name
            fastestLapName = playerName;
          } else {
            // Format chat text message for all
            strTempString = `* ${playerName} (ID:${player.id}) completed their timed lap in ${totalLapTime} seconds.`;
            Player.sendClientMessageToAll(COLOR_MESSAGE_YELLOW, strTempString);
          }

          // Send a gametext message to the player
          new GameText(
            "~n~~n~~n~~n~~n~~n~~n~~n~~n~~n~~g~~h~Finished!",
            3000,
            3,
          ).forPlayer(player);

          // Play a sound
          player.playSound(1139, x, y, z);

          // Set current checkpoint
          siPlayerCP.set(player, 0);

          const cpIndex = siPlayerCP.get(player)!;

          // Create start checkpoint
          const raceCp = new DynamicRaceCP({
            playerId: player.id,
            type: 1,
            x: stuntIslandCPs[cpIndex][0],
            y: stuntIslandCPs[cpIndex][0],
            z: stuntIslandCPs[cpIndex][0],
            nextX: stuntIslandCPs[cpIndex + 1][0],
            nextY: stuntIslandCPs[cpIndex + 1][0],
            nextZ: stuntIslandCPs[cpIndex + 1][0],
            size: 12.0,
          });
          raceCP.create();
          siRaceCp.set(player, raceCp);
        }
        // Check if the race finish line is next
        else if (siPlayerCP.get(player) === stuntIslandCPs.length - 1) {
          // Send a gametext message to the player
          new GameText(
            "~n~~n~~n~~n~~n~~n~~n~~n~~n~~n~~g~~h~Finish Line Is Next!",
            3000,
            3,
          ).forPlayer(player);

          // Play a sound
          player.playSound(1138, x, y, z);

          const cpIndex = siPlayerCP.get(player)!;

          // Create next checkpoint (finish line)
          const raceCp = new DynamicRaceCP({
            playerId: player.id,
            type: 1,
            x: stuntIslandCPs[cpIndex][0],
            y: stuntIslandCPs[cpIndex][0],
            z: stuntIslandCPs[cpIndex][0],
            nextX: -1,
            nextY: -1,
            nextZ: -1,
            size: 12.0,
          });
          raceCP.create();
          siRaceCp.set(player, raceCp);
        } else {
          // Play a sound
          player.playSound(1138, x, y, z);

          // Create next checkpoint
          const cpIndex = siPlayerCP.get(player)!;

          const raceCp = new DynamicRaceCP({
            playerId: player.id,
            type: 0,
            x: stuntIslandCPs[cpIndex][0],
            y: stuntIslandCPs[cpIndex][0],
            z: stuntIslandCPs[cpIndex][0],
            nextX: -1,
            nextY: -1,
            nextZ: -1,
            size: 12.0,
          });
          raceCP.create();
          siRaceCp.set(player, raceCp);
        }

        return next();
      },
    );

    const siCmd = PlayerEvent.onCommandText("si", ({ player, next }) => {
      // Set the player interior
      player.setInterior(0);

      // Check if the player is in any vehicle
      if (player.isInAnyVehicle()) {
        // In a Vehicle

        const veh = player.getVehicle()!;

        // Set vehicle position and facing angle
        veh.setPos(27.24 + Math.random() * 2, 3422.45, 6.2);
        veh.setZAngle(270);

        // Link vehicle to interior
        veh.linkToInterior(0);
      } else {
        // On Foot
        // Set player position and facing angle
        player.setPos(27.24 + Math.random() * 2, 3422.45, 6.2);
        player.setFacingAngle(270);
      }

      // Fix camera position after teleporting
      player.setCameraBehind();

      // Display chat text message to the player
      player.sendClientMessage(
        COLOR_MESSAGE_YELLOW,
        "* You teleported to the Stunt Island... drive into the checkpoint to start your timed lap.",
      );

      // Check if there is a previous lap record
      if (fastestLapTime !== 999) {
        // Create variable
        const strTempString = `* The current record is ${fastestLapTime} seconds previously set by ${fastestLapName}.`;
        // Format and display chat text message to the player
        player.sendClientMessage(COLOR_MESSAGE_YELLOW, strTempString);
      }

      // Send a gametext message to the player
      new GameText("~b~~h~Stunt Island!", 3000, 3).forPlayer(player);

      // Set current checkpoint
      siPlayerCP.set(player, 0);

      if (siRaceCp.has(player)) {
        siRaceCp.get(player)!.destroy();
      }

      // Create start checkpoint
      const cpIndex = siPlayerCP.get(player)!;
      const raceCp = new DynamicRaceCP({
        playerId: player.id,
        type: 1,
        x: stuntIslandCPs[cpIndex][0],
        y: stuntIslandCPs[cpIndex][1],
        z: stuntIslandCPs[cpIndex][2],
        nextX: stuntIslandCPs[cpIndex + 1][0],
        nextY: stuntIslandCPs[cpIndex + 1][1],
        nextZ: stuntIslandCPs[cpIndex + 1][2],
        size: 12.0,
      });
      raceCp.create();
      siRaceCp.set(player, raceCp);

      return next();
    });

    const afCmd = PlayerEvent.onCommandText("af", ({ player, next }) => {
      // Check if AutoFix is enabled for the player
      if (!siAutoFixDisabled.has(player)) {
        // Set flag
        siAutoFixDisabled.add(player);

        // Display a chat text message to the player
        player.sendClientMessage(
          COLOR_MESSAGE_YELLOW,
          "* You disabled AutoFix for your vehicle.",
        );

        // Send a gametext message to the player
        new GameText("~g~~h~AutoFix Disabled!", 3000, 3).forPlayer(player);
      } else {
        // Set flag
        siAutoFixDisabled.delete(player);

        // Display a chat text message to the player
        player.sendClientMessage(
          COLOR_MESSAGE_YELLOW,
          "* You enabled AutoFix for your vehicle.",
        );

        // Send a gametext message to the player
        new GameText("~g~~h~AutoFix Enabled!", 3000, 3).forPlayer(player);
      }

      return next();
    });

    const onSpawn = VehicleEvent.onSpawn(({ vehicle, next }) => {
      // Check if the vehicle is an Infernus
      if (vehicle.getModel() === 411) {
        // Add 10x NOS to the vehicle
        vehicle.addComponent(1010);
      }
      return next();
    });

    const offs = [
      onStateChange,
      onKeyStateChange,
      siCmd,
      afCmd,
      onPlayerEnter,
      onSpawn,
    ];

    if (options && options.enableFlip) {
      const flipCmd = PlayerEvent.onCommandText("flip", ({ player, next }) => {
        // Check to see if the player is not a driver of any vehicle
        if (player.getState() !== PlayerStateEnum.DRIVER) {
          // Send chat text message to the player
          player.sendClientMessage(
            COLOR_MESSAGE_YELLOW,
            "* You must be the driver of a vehicle before using the /flip command.",
          );
          return next();
        }

        const veh = player.getVehicle()!;

        // Get Vehicle Pos
        const { x, y, z } = veh.getPos();
        const a = veh.getZAngle();

        // Flip the vehicle
        veh.setPos(x, y, z + 2);
        veh.setZAngle(a);

        // Display a chat text message to the player
        player.sendClientMessage(
          COLOR_MESSAGE_YELLOW,
          "* Your vehicle has been flipped.",
        );

        // Send a gametext message to the player
        new GameText("~g~~h~Vehicle Flipped!", 3000, 3).forPlayer(player);
        return next();
      });

      offs.push(flipCmd);
    }

    createSIObjects();

    // Create NUM_SI_VEHICLES Infernuses
    for (let i = 0; i < NUM_SI_VEHICLES; i++) {
      // Create an Infernus and remember the vehicle number so it can be
      // deleted when this filterScript is unloaded
      siInfernus[i] = new Vehicle({
        modelId: 411,
        x: 89.45,
        y: 3445.0 + i * 6.0,
        z: 5.05,
        zAngle: 90.0,
        color: [-1, -1],
        respawnDelay: 30,
      });
      siInfernus[i].create();

      // Check that the vehicle was created ok
      if (siInfernus[i].isValid()) {
        // Add 10x NOS to the Infernus
        siInfernus[i].addComponent(1010);
      }
    }

    // Start the AutoFix timer (every 1.803 seconds the timer is triggered)

    if (siIAutoFixTimer) {
      clearInterval(siIAutoFixTimer);
    }

    siIAutoFixTimer = setInterval(siAutoFix, 1803);

    // Display information in the Server Console
    console.log("\n");
    console.log("  |-------------------");
    console.log("  |--- Stunt Island FilterScript by Matite and Kye");
    console.log("  |--  Script v1.02");
    console.log("  |--  13th February 2015");
    console.log("  |-------------------");

    return offs;
  },
  unload() {
    // Kill the AutoFix timer
    if (siIAutoFixTimer) {
      clearInterval(siIAutoFixTimer);
      siIAutoFixTimer = null;
    }

    createdObjects.forEach((o) => o.isValid() && o.destroy());
    createdObjects = [];

    // Delete 6 Infernuses
    // Delete the Infernus vehicles created by this filterScript
    siInfernus.forEach((v) => v.isValid() && v.destroy());

    siInfernus = [];

    if (siIAutoFixTimer) {
      clearInterval(siIAutoFixTimer);
    }
    siPlayerCP.clear();
    [...siRaceCp.values()].forEach((cp) => cp.isValid() && cp.destroy());
    siRaceCp.clear();
    siAutoFixDisabled.clear();
    siVehicleCols.clear();

    // Display information in the Server Console
    console.log("  |-------------------");
    console.log("  |--  Stunt Island FilterScript Unloaded");
    console.log("  |-------------------");
  },
};
