import {
  CheckPointEvent,
  RaceCpEvent,
  DynamicCheckPointEvent,
  DynamicRaceCPEvent,
} from "@infernus/core";
import { ACInfo } from "../struct";
import { innerACConfig } from "../config";
import { ac_Mtfc } from "../constants";
import { ac_FloodDetect } from "./trigger";

DynamicCheckPointEvent.onPlayerEnter(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[17] < ac_Mtfc[17][0])
        ac_FloodDetect(player, 17);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[17] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[17] =
      ac_gtc;
    return next();
  }
});

DynamicCheckPointEvent.onPlayerLeave(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[18] < ac_Mtfc[18][0])
        ac_FloodDetect(player, 18);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[18] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[18] =
      ac_gtc;
  }
  return next();
});

DynamicRaceCPEvent.onPlayerEnter(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[21] < ac_Mtfc[21][0])
        ac_FloodDetect(player, 21);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[21] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[21] =
      ac_gtc;
  }
  return next();
});

DynamicRaceCPEvent.onPlayerLeave(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[22] < ac_Mtfc[22][0])
        ac_FloodDetect(player, 22);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[22] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[22] =
      ac_gtc;
  }
  return next();
});

CheckPointEvent.onPlayerEnter(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[17] < ac_Mtfc[17][0])
        ac_FloodDetect(player, 17);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[17] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[17] =
      ac_gtc;
  }
  return next();
});

CheckPointEvent.onPlayerLeave(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[18] < ac_Mtfc[18][0])
        ac_FloodDetect(player, 18);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[18] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[18] =
      ac_gtc;
  }
  return next();
});

RaceCpEvent.onPlayerEnter(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[21] < ac_Mtfc[21][0])
        ac_FloodDetect(player, 21);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[21] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[21] =
      ac_gtc;
  }
  return next();
});

RaceCpEvent.onPlayerLeave(({ player, next }) => {
  if (ACInfo.get(player.id).acKicked > 0) return false;
  if (
    !innerACConfig.AC_USE_NPC ||
    (innerACConfig.AC_USE_NPC && !player.isNpc())
  ) {
    const ac_gtc = Date.now();
    if (ACInfo.get(player.id).acACAllow[49]) {
      if (ac_gtc - ACInfo.get(player.id).acCall[22] < ac_Mtfc[22][0])
        ac_FloodDetect(player, 22);
      else if (ac_gtc - ACInfo.get(player.id).acCall[27] < ac_Mtfc[27][0])
        ac_FloodDetect(player, 27);
      else
        ACInfo.get(player.id).acFloodCount[22] = ACInfo.get(
          player.id,
        ).acFloodCount[27] = 0;
    }
    ACInfo.get(player.id).acCall[27] = ACInfo.get(player.id).acCall[22] =
      ac_gtc;
  }
  return next();
});
