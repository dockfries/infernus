import { Player, rgba, Vehicle } from "@infernus/core";
import { OMPPException } from "../exceptions";
import {
  BuildPart,
  Capability,
  CaptureFlag,
  CapturePriority,
  Feature,
  KeyEvent,
  TargetFlag,
  TargetRow,
  UIFlag,
} from "../enums";
import { OMPPConstants } from "../constants";

export class OMPP {
  private constructor() {
    throw new OMPPException("Use static methods only");
  }

  static setCheckPointEx(
    player: Player,
    x: number,
    y: number,
    z: number,
    size: number,
    colour: number | string = 0xff000020,
    period = 1024,
    pulse = 0.1,
    rotationRate = 0,
    checkZ = true,
  ) {
    return samp.callNative(
      "SetPlayerCheckpointEx",
      "ifffiiifii",
      player.id,
      x,
      y,
      z,
      size,
      rgba(colour),
      period,
      pulse,
      rotationRate,
      checkZ,
    ) as number;
  }
  static setCheckPointColour(player: Player, colour: number | string) {
    return samp.callNative("SetPlayerCheckpointColour", "ii", player.id, rgba(colour)) as number;
  }

  static setRaceCheckpointEx(
    player: Player,
    type: number,
    x: number,
    y: number,
    z: number,
    pointX: number,
    pointY: number,
    pointZ: number,
    size: number,
    colour: number | string = 0xff000020,
    period = 1024,
    pulse = 0.1,
    rotationRate = 0,
  ) {
    return samp.callNative(
      "SetPlayerRaceCheckpointEx",
      "iiffffffiiifi",
      player.id,
      type,
      x,
      y,
      z,
      pointX,
      pointY,
      pointZ,
      size,
      rgba(colour),
      period,
      pulse,
      rotationRate,
    ) as number;
  }

  static setRaceCheckpointColour(player: Player, colour: number | string) {
    return samp.callNative(
      "SetPlayerRaceCheckpointColour",
      "ii",
      player.id,
      rgba(colour),
    ) as number;
  }

  static toggleHUDComponent(player: Player, componentId: number, toggle: boolean) {
    return samp.callNative(
      "ToggleHUDComponentForPlayer",
      "iii",
      player.id,
      componentId,
      toggle,
    ) as number;
  }

  static setRadioStation(player: Player, stationId: number) {
    return samp.callNative("SetRadioStationForPlayer", "ii", player.id, stationId) as number;
  }

  static setWaveHeight(height: number, player?: Player) {
    if (player) {
      return samp.callNative("SetWaveHeightForPlayer", "if", player.id, height) as number;
    } else {
      return samp.callNative("SetWaveHeightForAll", "f", height) as number;
    }
  }

  static togglePauseMenuAbility(player: Player, toggle: boolean) {
    return samp.callNative("TogglePauseMenuAbility", "ii", player.id, toggle) as number;
  }

  static isInPauseMenu(player: Player) {
    return samp.callNative("IsPlayerInPauseMenu", "i", player.id) as boolean;
  }

  static setHUDComponentColour(player: Player, componentId: number, colour: number | string) {
    return samp.callNative(
      "SetPlayerHUDComponentColour",
      "iii",
      player.id,
      componentId,
      rgba(colour),
    ) as number;
  }

  static toggleAction(player: Player, actionId: number, toggle: boolean) {
    return samp.callNative("TogglePlayerAction", "iii", player.id, actionId, toggle) as number;
  }

  static setBlurIntensity(player: Player, intensity: number) {
    return samp.callNative("SetPlayerBlurIntensity", "ii", player.id, intensity) as number;
  }

  static setGameSpeed(player: Player, speed: number) {
    return samp.callNative("SetPlayerGameSpeed", "if", player.id, speed) as number;
  }

  static toggleDriveOnWater(player: Player, toggle: boolean) {
    return samp.callNative("TogglePlayerDriveOnWater", "ii", player.id, toggle) as number;
  }

  static toggleFrozen(player: Player, toggle: boolean) {
    return samp.callNative("TogglePlayerFrozen", "ii", player.id, toggle) as number;
  }

  static setPedAnims(player: Player, toggle: boolean) {
    return samp.callNative("SetPlayerPedAnims", "ii", player.id, toggle) as number;
  }

  static toggleSwitchReload(player: Player, toggle: boolean) {
    return samp.callNative("TogglePlayerSwitchReload", "ii", player.id, toggle) as number;
  }

  static isUsing(player: Player) {
    return !!samp.callNative("IsUsingOMPPlus", "i", player.id);
  }

  static hasFeature(player: Player, feature: number) {
    return !!samp.callNative("SAMPP_HasFeature", "ii", player.id, feature);
  }

  static getClientFeatureFlags(player: Player) {
    return samp.callNative("SAMPP_GetClientFeatureFlags", "i", player.id) as number;
  }

  static getClientCapabilities(player: Player) {
    return samp.callNative("SAMPP_GetClientCapabilities", "i", player.id) as number;
  }

  static getClientVersion(player: Player) {
    const [major, minor, patch, ret]: [number, number, number, number] = samp.callNative(
      "SAMPP_GetClientVersion",
      "iIII",
      player.id,
    );
    return {
      major,
      minor,
      patch,
      ret,
    };
  }

  static getClientHash(player: Player) {
    const [hash, ret]: [string, number] = samp.callNative(
      "SAMPP_GetClientHash",
      "iSi",
      player.id,
      65,
    );
    return {
      hash,
      ret,
    };
  }

  static isLauncherVerified(player: Player) {
    return !!samp.callNative("SAMPP_IsLauncherVerified", "i", player.id);
  }

  static getResolution(player: Player) {
    const [x, y, ret]: [number, number, number] = samp.callNative(
      "GetPlayerResolution",
      "iII",
      player.id,
    );
    return {
      x,
      y,
      ret,
    };
  }

  static setNoReload(player: Player, toggle: boolean) {
    return samp.callNative("SetPlayerNoReload", "ii", player.id, toggle) as number;
  }

  static toggleInfiniteRun(player: Player, toggle: boolean) {
    return samp.callNative("TogglePlayerInfiniteRun", "ii", player.id, toggle) as number;
  }

  static setAircraftHeight(player: Player, height: number) {
    return samp.callNative("SetPlayerAircraftHeight", "if", player.id, height) as number;
  }

  static getAircraftHeight(player: Player) {
    return samp.callNativeFloat("GetPlayerAircraftHeight", "i", player.id) as number;
  }

  static setJetpackHeight(player: Player, height: number) {
    return samp.callNative("SetPlayerJetpackHeight", "if", player.id, height) as number;
  }

  static getJetpackHeight(player: Player) {
    return samp.callNativeFloat("GetPlayerJetpackHeight", "i", player.id) as number;
  }

  static toggleVehicleBlips(player: Player, toggle: boolean) {
    return samp.callNative("TogglePlayerVehicleBlips", "ii", player.id, toggle) as number;
  }

  static getVehicleBlips(player: Player) {
    return !!samp.callNative("GetPlayerVehicleBlips", "i", player.id);
  }

  static getRadioStation(player: Player) {
    return samp.callNative("GetPlayerRadioStation", "i", player.id) as number;
  }

  static toggleInfiniteOxygen(player: Player, toggle: boolean) {
    return samp.callNative("TogglePlayerInfiniteOxygen", "ii", player.id, toggle) as number;
  }

  static toggleWaterBuoyancy(player: Player, toggle: boolean) {
    return samp.callNative("ToggleWaterBuoyancy", "ii", player.id, toggle) as number;
  }

  static toggleUnderwaterEffect(player: Player, toggle: boolean) {
    return samp.callNative("ToggleUnderwaterEffect", "ii", player.id, toggle) as number;
  }

  static toggleNightVision(player: Player, toggle: boolean) {
    return samp.callNative("ToggleNightVision", "ii", player.id, toggle) as number;
  }

  static toggleThermalVision(player: Player, toggle: boolean) {
    return samp.callNative("ToggleThermalVision", "ii", player.id, toggle) as number;
  }

  static bindKey(
    player: Player,
    key: number,
    eventMask: number = KeyEvent.Down,
    action: string = "",
  ) {
    return samp.callNative("SAMPP_BindKey", "iiis", player.id, key, eventMask, action) as number;
  }

  static unbindKey(player: Player, key: number) {
    return samp.callNative("SAMPP_UnbindKey", "ii", player.id, key) as number;
  }

  static clearKeyBinds(player: Player) {
    return samp.callNative("SAMPP_ClearKeyBinds", "i", player.id) as number;
  }

  static beginKeyCapture(
    player: Player,
    key: number,
    eventMask: number = KeyEvent.Down,
    priority: CapturePriority = CapturePriority.Low,
    ttlMs = OMPPConstants.CaptureLeaseDefaultMs,
    flags = CaptureFlag.Default,
    action = "",
  ) {
    return samp.callNative(
      "SAMPP_BeginKeyCapture",
      "iiiiiis",
      player.id,
      key,
      eventMask,
      priority,
      ttlMs,
      flags,
      action,
    );
  }

  static endKeyCapture(player: Player, key: number, action = "") {
    return samp.callNative("SAMPP_EndKeyCapture", "iis", player.id, key, action) as number;
  }

  static clearKeyCaptures(player: Player) {
    return samp.callNative("SAMPP_ClearKeyCaptures", "i", player.id) as number;
  }

  static targetBegin(player: Player, targetId: number, title: string, ttlMs = 500, flags = 0) {
    return samp.callNative(
      "SAMPP_TargetBegin",
      "iisii",
      player.id,
      targetId,
      title,
      ttlMs,
      flags,
    ) as number;
  }

  static targetBeginEx(
    player: Player,
    targetId: number,
    targetType: number,
    title: string,
    ttlMs = 500,
    flags = 0,
  ) {
    return samp.callNative(
      "SAMPP_TargetBeginEx",
      "iiisii",
      player.id,
      targetId,
      targetType,
      title,
      ttlMs,
      flags,
    ) as number;
  }

  static targetSetLayout(player: Player, targetId: number, layout: number) {
    return samp.callNative("SAMPP_TargetSetLayout", "iii", player.id, targetId, layout) as number;
  }

  static targetSetDescription(player: Player, targetId: number, description: string) {
    return samp.callNative(
      "SAMPP_TargetSetDescription",
      "iis",
      player.id,
      targetId,
      description,
    ) as number;
  }

  static targetAddOption(
    player: Player,
    targetId: number,
    optionId: number,
    label: string,
    icon = "",
    enabled = true,
  ) {
    return samp.callNative(
      "SAMPP_TargetAddOption",
      "iiissi",
      player.id,
      targetId,
      optionId,
      label,
      icon,
      enabled,
    ) as number;
  }

  static targetAddRow(
    player: Player,
    targetId: number,
    optionId: number,
    rowType: number,
    label: string,
    icon = "",
    enabled = true,
  ) {
    return samp.callNative(
      "SAMPP_TargetAddRow",
      "iiiissi",
      player.id,
      targetId,
      optionId,
      rowType,
      label,
      icon,
      enabled,
    ) as number;
  }

  static targetCommit(player: Player, targetId: number) {
    return samp.callNative("SAMPP_TargetCommit", "ii", player.id, targetId) as number;
  }

  static targetClear(player: Player) {
    return samp.callNative("SAMPP_TargetClear", "i", player.id) as number;
  }

  static buildOpen(player: Player, sessionId: number, title: string, maxDistance = 8.0) {
    return samp.callNative(
      "SAMPP_BuildOpen",
      "iisf",
      player.id,
      sessionId,
      title,
      maxDistance,
    ) as number;
  }

  static buildClose(player: Player) {
    return samp.callNative("SAMPP_BuildClose", "i", player.id) as number;
  }

  static buildClearParts(player: Player) {
    return samp.callNative("SAMPP_BuildClearParts", "i", player.id) as number;
  }

  static buildAddPart(
    player: Player,
    partId: number,
    modelId: number,
    name: string,
    category = "",
    cost = "",
  ) {
    return samp.callNative(
      "SAMPP_BuildAddPart",
      "iiisss",
      player.id,
      partId,
      modelId,
      name,
      category,
      cost,
    ) as number;
  }

  static buildSendResult(player: Player, result: number, message: string) {
    return samp.callNative("SAMPP_BuildSendResult", "iis", player.id, result, message) as number;
  }

  static buildSetRemoveTarget(
    player: Player,
    active: boolean,
    partId = BuildPart.None,
    label = "",
    distance = 0.0,
  ) {
    return samp.callNative(
      "SAMPP_BuildSetRemoveTarget",
      "iiisf",
      player.id,
      active,
      partId,
      label,
      distance,
    ) as number;
  }

  static uiOpen(
    player: Player,
    documentId: string,
    templateId: number,
    title: string,
    body = "",
    flags = UIFlag.Default,
    capacity = 0,
  ) {
    return samp.callNative(
      "SAMPP_UIOpen",
      "isissii",
      player.id,
      documentId,
      templateId,
      title,
      body,
      flags,
      capacity,
    ) as number;
  }

  static uiClose(player: Player, documentId: string) {
    return samp.callNative("SAMPP_UIClose", "is", player.id, documentId) as number;
  }

  static uiCloseAll(player: Player) {
    return samp.callNative("SAMPP_UICloseAll", "i", player.id) as number;
  }

  static uiSetData(player: Player, documentId: string, key: string, value: string) {
    return samp.callNative("SAMPP_UISetData", "isss", player.id, documentId, key, value) as number;
  }

  static inventoryOpen(
    player: Player,
    documentId: string,
    title: string,
    slots = 30,
    body = "Server-driven inventory UI.",
    flags = UIFlag.Default,
  ) {
    return samp.callNative(
      "SAMPP_InventoryOpen",
      "issisi",
      player.id,
      documentId,
      title,
      slots,
      body,
      flags,
    ) as number;
  }

  static inventoryClear(player: Player, documentId: string) {
    return samp.callNative("SAMPP_InventoryClear", "is", player.id, documentId) as number;
  }

  static inventorySetSlot(
    player: Player,
    documentId: string,
    slot: number,
    itemId: number,
    amount: number,
    label: string,
    description = "",
    icon = "",
  ) {
    return samp.callNative(
      "SAMPP_InventorySetSlot",
      "isiiisss",
      player.id,
      documentId,
      slot,
      itemId,
      amount,
      label,
      description,
      icon,
    ) as number;
  }

  static inventorySetSlotActions(
    player: Player,
    documentId: string,
    slot: number,
    actions: string[],
  ) {
    return samp.callNative(
      "SAMPP_InventorySetSlotActions",
      "isis",
      player.id,
      documentId,
      slot,
      actions,
    ) as number;
  }

  static workspaceOpen(
    player: Player,
    documentId: string,
    layout: number,
    title: string,
    body = "",
    flags = UIFlag.Default,
  ) {
    return samp.callNative(
      "SAMPP_WorkspaceOpen",
      "isissi",
      player.id,
      documentId,
      layout,
      title,
      body,
      flags,
    ) as number;
  }

  static workspaceClear(player: Player, documentId: string) {
    return samp.callNative("SAMPP_WorkspaceClear", "is", player.id, documentId) as number;
  }

  static workspaceSetPane(
    player: Player,
    documentId: string,
    paneId: string,
    paneType: number,
    title: string,
    capacity = 0,
    body = "",
  ) {
    return samp.callNative(
      "SAMPP_WorkspaceSetPane",
      "issisis",
      player.id,
      documentId,
      paneId,
      paneType,
      title,
      capacity,
      body,
    ) as number;
  }

  static workspaceSetSlot(
    player: Player,
    documentId: string,
    paneId: string,
    slot: number,
    itemId: number,
    amount: number,
    label: string,
    description = "",
    icon = "",
  ) {
    return samp.callNative(
      "SAMPP_WorkspaceSetSlot",
      "issiiisss",
      player.id,
      documentId,
      paneId,
      slot,
      itemId,
      amount,
      label,
      description,
      icon,
    ) as number;
  }

  static workspaceSetSlotActions(
    player: Player,
    documentId: string,
    paneId: string,
    slot: number,
    actions: string,
  ) {
    return samp.callNative(
      "SAMPP_WorkspaceSetSlotActions",
      "issis",
      player.id,
      documentId,
      paneId,
      slot,
      actions,
    ) as number;
  }

  static executeCallback(type: number, identifier: string, ...args: any[]) {
    return samp.callNative(
      "SAMPP_ExecuteCallback",
      `ir[${identifier}]`,
      type,
      ...args.slice(0, identifier.length),
    ) as number;
  }

  static targetAddAction(
    player: Player,
    targetId: number,
    optionId: number,
    label: string,
    icon = "",
  ) {
    return this.targetAddRow(player, targetId, optionId, TargetRow.Action, label, icon, true) != 0;
  }

  static targetAddInfo(player: Player, targetId: number, text: string) {
    return this.targetAddRow(player, targetId, 0, TargetRow.Info, text, "", false) != 0;
  }

  static targetAddDialog(player: Player, targetId: number, text: string) {
    return this.targetAddRow(player, targetId, 0, TargetRow.Dialog, text, "", false) != 0;
  }

  static targetAddDivider(player: Player, targetId: number) {
    return this.targetAddRow(player, targetId, 0, TargetRow.Divider, "", "", false) != 0;
  }

  static targetAddHeader(player: Player, targetId: number, text: string) {
    return this.targetAddRow(player, targetId, 0, TargetRow.Header, text, "", false) != 0;
  }

  static targetAddDisabled(
    player: Player,
    targetId: number,
    optionId: number,
    label: string,
    icon = "",
  ) {
    return (
      this.targetAddRow(player, targetId, optionId, TargetRow.Disabled, label, icon, false) != 0
    );
  }

  static targetAddToggle(
    player: Player,
    targetId: number,
    optionId: number,
    label: string,
    icon = "",
  ) {
    return this.targetAddRow(player, targetId, optionId, TargetRow.Toggle, label, icon, true) != 0;
  }

  static targetAddDanger(
    player: Player,
    targetId: number,
    optionId: number,
    label: string,
    icon = "",
  ) {
    return this.targetAddRow(player, targetId, optionId, TargetRow.Danger, label, icon, true) != 0;
  }

  static targetBeginDirect(
    player: Player,
    targetId: number,
    targetType: number,
    title: string,
    ttl_ms = 500,
    flags = 0,
  ) {
    return (
      this.targetBeginEx(
        player,
        targetId,
        targetType,
        title,
        ttl_ms,
        flags | TargetFlag.DirectSelect,
      ) != 0
    );
  }

  static captureKeyNearPoint(
    player: Player,
    key: number,
    x: number,
    y: number,
    z: number,
    radius: number,
    action: string,
    priority = CapturePriority.Item,
    ttlMs = OMPPConstants.CaptureLeaseDefaultMs,
    flags = CaptureFlag.Default,
    eventMask = KeyEvent.Down,
  ) {
    if (!this.isUsing(player)) {
      return false;
    }

    if (player.getDistanceFromPoint(x, y, z) > radius) {
      return false;
    }

    return this.beginKeyCapture(player, key, eventMask, priority, ttlMs, flags, action) != 0;
  }

  static captureKeyInAnyVehicle(
    player: Player,
    key: number,
    action: string,
    priority = CapturePriority.Vehicle,
    ttlMs = OMPPConstants.CaptureLeaseDefaultMs,
    flags = CaptureFlag.Default,
    eventMask = KeyEvent.Down,
  ) {
    if (!this.isUsing(player) || !player.isInAnyVehicle()) {
      return false;
    }

    return this.beginKeyCapture(player, key, eventMask, priority, ttlMs, flags, action) != 0;
  }

  static captureKeyInVehicle(
    player: Player,
    vehicle: Vehicle,
    key: number,
    action: string,
    priority = CapturePriority.Vehicle,
    ttlMs = OMPPConstants.CaptureLeaseDefaultMs,
    flags = CaptureFlag.Default,
    eventMask = KeyEvent.Down,
  ) {
    if (!this.isUsing(player) || !vehicle.isPlayerIn(player)) {
      return false;
    }

    return this.beginKeyCapture(player, key, eventMask, priority, ttlMs, flags, action) != 0;
  }

  static captureKeyNearVehicle(
    player: Player,
    vehicle: Vehicle,
    key: number,
    radius: number,
    action: string,
    priority = CapturePriority.Vehicle,
    ttlMs = OMPPConstants.CaptureLeaseDefaultMs,
    flags = CaptureFlag.Default,
    eventMask = KeyEvent.Down,
  ) {
    if (!this.isUsing(player)) {
      return false;
    }

    const { x, y, z, ret } = vehicle.getPos();

    if (!ret) {
      return false;
    }

    return this.captureKeyNearPoint(
      player,
      key,
      x,
      y,
      z,
      radius,
      action,
      priority,
      ttlMs,
      flags,
      eventMask,
    );
  }

  static targetHasUI(player: Player) {
    return this.isUsing(player) && this.hasFeature(player, Feature.Target);
  }

  static buildHasUI(player: Player) {
    return this.isUsing(player) && this.hasFeature(player, Feature.Build);
  }

  static hasRmlUi(player: Player) {
    return this.isUsing(player) && (this.getClientCapabilities(player) & Capability.RmlUI) != 0;
  }

  static targetBeginNearPoint(
    player: Player,
    targetId: number,
    x: number,
    y: number,
    z: number,
    radius: number,
    title: string,
    ttlMs = 500,
    flags = 0,
  ) {
    if (!this.targetHasUI(player)) {
      return false;
    }

    if (player.getDistanceFromPoint(x, y, z) > radius) {
      this.targetClear(player);
      return false;
    }

    if (!this.targetBegin(player, targetId, title, ttlMs, flags)) {
      return false;
    }

    return true;
  }
}
