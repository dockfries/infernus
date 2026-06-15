import { defineEvent, Player, Vehicle } from "@infernus/core";

const [onOpenPauseMenu] = defineEvent({
  name: "OnPlayerOpenPauseMenu",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onClosePauseMenu] = defineEvent({
  name: "OnPlayerClosePauseMenu",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onEnterPauseSubmenu] = defineEvent({
  name: "OnPlayerEnterPauseSubmenu",
  identifier: "iii",
  beforeEach(playerId: number, from: number, to: number) {
    return {
      player: Player.getInstance(playerId)!,
      from,
      to,
    };
  },
});

const [onDriveByShot] = defineEvent({
  name: "OnDriverDriveByShot",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onStunt] = defineEvent({
  name: "OnPlayerStunt",
  identifier: "iiia",
  beforeEach(
    playerId: number,
    stuntId: number,
    money: number,
    details: [number, number, number, number, number, number],
  ) {
    return {
      player: Player.getInstance(playerId)!,
      stuntId,
      money,
      details,
    };
  },
});

const [onResolutionChange] = defineEvent({
  name: "OnPlayerResolutionChange",
  identifier: "iiia",
  beforeEach(playerId: number, x: number, y: number) {
    return {
      player: Player.getInstance(playerId)!,
      x,
      y,
    };
  },
});

const [onConnect] = defineEvent({
  name: "OnPlayerSAMPPConnect",
  identifier: "si",
  beforeEach(address: string, port: number) {
    return {
      address,
      port,
    };
  },
});

const [onJoin] = defineEvent({
  name: "OnPlayerSAMPPJoin",
  identifier: "ii",
  beforeEach(playerId: number, hasPlugin: number) {
    return {
      player: Player.getInstance(playerId)!,
      hasPlugin: !!hasPlugin,
    };
  },
});

const [onClick] = defineEvent({
  name: "OnPlayerClick",
  identifier: "iiii",
  beforeEach(playerId: number, type: number, x: number, y: number) {
    return {
      player: Player.getInstance(playerId)!,
      type,
      x,
      y,
    };
  },
});

const [onChangeRadioStation] = defineEvent({
  name: "OnPlayerChangeRadioStation",
  identifier: "iii",
  beforeEach(playerId: number, stationId: number, vehicleId: number) {
    return {
      player: Player.getInstance(playerId)!,
      stationId,
      vehicle: Vehicle.getInstance(vehicleId)!,
    };
  },
});

const [onDrinkSprunk] = defineEvent({
  name: "OnPlayerDrinkSprunk",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

// const [onPlayerSAMPPKey] = defineEvent({
//   name: "OnPlayerSAMPPKey",
//   identifier: "iiis",
//   beforeEach(playerId: number, keyId: number, keyState: number, action: string) {
//     return {
//       player: Player.getInstance(playerId)!,
//       keyId,
//       keyState,
//       action,
//     };
//   },
// });

const [onReady] = defineEvent({
  name: "OnPlayerOMPPlusReady",
  identifier: "i",
  beforeEach(playerId: number) {
    return {
      player: Player.getInstance(playerId)!,
    };
  },
});

const [onKey] = defineEvent({
  name: "OnPlayerOMPPlusKey",
  identifier: "iiis",
  beforeEach(playerId: number, keyId: number, keyState: number, action: string) {
    return {
      player: Player.getInstance(playerId)!,
      keyId,
      keyState,
      action,
    };
  },
});

// const [onPlayerSAMPPTargetMode] = defineEvent({
//   name: "OnPlayerSAMPPTargetMode",
//   identifier: "iii",
//   beforeEach(playerId: number, targetId: number, opened: number) {
//     return {
//       player: Player.getInstance(playerId)!,
//       targetId,
//       opened: !!opened,
//     };
//   },
// });

// const [onPlayerSAMPPTargetSelect] = defineEvent({
//   name: "OnPlayerSAMPPTargetSelect",
//   identifier: "iii",
//   beforeEach(playerId: number, targetId: number, optionId: number) {
//     return {
//       player: Player.getInstance(playerId)!,
//       targetId,
//       optionId,
//     };
//   },
// });

const [onTargetMode] = defineEvent({
  name: "OnPlayerOMPPlusTargetMode",
  identifier: "iii",
  beforeEach(playerId: number, targetId: number, opened: number) {
    return {
      player: Player.getInstance(playerId)!,
      targetId,
      opened: !!opened,
    };
  },
});

const [onTargetSelect] = defineEvent({
  name: "OnPlayerOMPPlusTargetSelect",
  identifier: "iii",
  beforeEach(playerId: number, targetId: number, optionId: number) {
    return {
      player: Player.getInstance(playerId)!,
      targetId,
      optionId,
    };
  },
});

// const [onPlayerSAMPPBuildSelect] = defineEvent({
//   name: "OnPlayerSAMPPBuildSelect",
//   identifier: "iii",
//   beforeEach(playerId: number, sessionId: number, partId: number) {
//     return {
//       player: Player.getInstance(playerId)!,
//       sessionId,
//       partId,
//     };
//   },
// });

// const [onPlayerSAMPPBuildPlace] = defineEvent({
//   name: "OnPlayerSAMPPBuildPlace",
//   identifier: "iiiii",
//   beforeEach(
//     playerId: number,
//     sessionId: number,
//     partId: number,
//     rotationStep: number,
//     flipped: number,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       sessionId,
//       partId,
//       rotationStep,
//       flipped: !!flipped,
//     };
//   },
// });

// const [onPlayerSAMPPBuildPlaceEx] = defineEvent({
//   name: "OnPlayerSAMPPBuildPlaceEx",
//   identifier: "iiiiiifff",
//   beforeEach(
//     playerId: number,
//     sessionId: number,
//     partId: number,
//     rotationStep: number,
//     flipped: number,
//     hasAimHit: number,
//     aimX: number,
//     aimY: number,
//     aimZ: number,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       sessionId,
//       partId,
//       rotationStep,
//       flipped: !!flipped,
//       hasAimHit: !!hasAimHit,
//       aimX,
//       aimY,
//       aimZ,
//     };
//   },
// });

// const [onPlayerSAMPPBuildPlaceGroundEx] = defineEvent({
//   name: "OnPlayerSAMPPBuildPlaceGroundEx",
//   identifier: "iiiiiifffiff",
//   beforeEach(
//     playerId: number,
//     sessionId: number,
//     partId: number,
//     rotationStep: number,
//     flipped: number,
//     hasAimHit,
//     aimX: number,
//     aimY: number,
//     aimZ: number,
//     aimSurfaceState: number,
//     footprintMinGroundZ: number,
//     footprintMaxGroundZ: number,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       sessionId,
//       partId,
//       rotationStep,
//       flipped: !!flipped,
//       hasAimHit: !!hasAimHit,
//       aimX,
//       aimY,
//       aimZ,
//       aimSurfaceState,
//       footprintMinGroundZ,
//       footprintMaxGroundZ,
//     };
//   },
// });

// const [onPlayerSAMPPBuildCancel] = defineEvent({
//   name: "OnPlayerSAMPPBuildCancel",
//   identifier: "ii",
//   beforeEach(playerId: number, sessionId: number) {
//     return {
//       player: Player.getInstance(playerId)!,
//       sessionId,
//     };
//   },
// });

// const [onPlayerSAMPPBuildPreview] = defineEvent({
//   name: "OnPlayerSAMPPBuildPreview",
//   identifier: "iiiii",
//   beforeEach(
//     playerId: number,
//     sessionId: number,
//     partId: number,
//     rotationStep: number,
//     flipped: number,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       sessionId,
//       partId,
//       rotationStep,
//       flipped: !!flipped,
//     };
//   },
// });

// const [onPlayerSAMPPBuildPreviewEx] = defineEvent({
//   name: "OnPlayerSAMPPBuildPreviewEx",
//   identifier: "iiiiiifff",
//   beforeEach(
//     playerId: number,
//     sessionId: number,
//     partId: number,
//     rotationStep: number,
//     flipped: number,
//     hasAimHit: number,
//     aimX: number,
//     aimY: number,
//     aimZ: number,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       sessionId,
//       partId,
//       rotationStep,
//       flipped: !!flipped,
//       hasAimHit: !!hasAimHit,
//       aimX,
//       aimY,
//       aimZ,
//     };
//   },
// });

// const [onPlayerSAMPPBuildPreviewGroundEx] = defineEvent({
//   name: "OnPlayerSAMPPBuildPreviewGroundEx",
//   identifier: "iiiiiifffiff",
//   beforeEach(
//     playerId: number,
//     sessionId: number,
//     partId: number,
//     rotationStep: number,
//     flipped: number,
//     hasAimHit: number,
//     aimX: number,
//     aimY: number,
//     aimZ: number,
//     aimSurfaceState: number,
//     footprintMinGroundZ: number,
//     footprintMaxGroundZ: number,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       sessionId,
//       partId,
//       rotationStep,
//       flipped: !!flipped,
//       hasAimHit: !!hasAimHit,
//       aimX,
//       aimY,
//       aimZ,
//       aimSurfaceState,
//       footprintMinGroundZ,
//       footprintMaxGroundZ,
//     };
//   },
// });

const [onBuildSelect] = defineEvent({
  name: "OnPlayerOMPPlusBuildSelect",
  identifier: "iii",
  beforeEach(playerId: number, sessionId: number, partId: number) {
    return {
      player: Player.getInstance(playerId)!,
      sessionId,
      partId,
    };
  },
});

const [onBuildPlace] = defineEvent({
  name: "OnPlayerOMPPlusBuildPlace",
  identifier: "iiiii",
  beforeEach(
    playerId: number,
    sessionId: number,
    partId: number,
    rotationStep: number,
    flipped: number,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      sessionId,
      partId,
      rotationStep,
      flipped: !!flipped,
    };
  },
});

const [onPlaceEx] = defineEvent({
  name: "OnPlayerOMPPlusBuildPlaceEx",
  identifier: "iiiiiifff",
  beforeEach(
    playerId: number,
    sessionId: number,
    partId: number,
    rotationStep: number,
    flipped: number,
    hasAimHit: number,
    aimX: number,
    aimY: number,
    aimZ: number,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      sessionId,
      partId,
      rotationStep,
      flipped: !!flipped,
      hasAimHit: !!hasAimHit,
      aimX,
      aimY,
      aimZ,
    };
  },
});

const [onPlaceGroundEx] = defineEvent({
  name: "OnPlayerOMPPlusBuildPlaceGroundEx",
  identifier: "iiiiiifffiff",
  beforeEach(
    playerId: number,
    sessionId: number,
    partId: number,
    rotationStep: number,
    flipped: number,
    hasAimHit: number,
    aimX: number,
    aimY: number,
    aimZ: number,
    aimSurfaceState: number,
    footprintMinGroundZ: number,
    footprintMaxGroundZ: number,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      sessionId,
      partId,
      rotationStep,
      flipped: !!flipped,
      hasAimHit: !!hasAimHit,
      aimX,
      aimY,
      aimZ,
      aimSurfaceState,
      footprintMinGroundZ,
      footprintMaxGroundZ,
    };
  },
});

const [onBuildCancel] = defineEvent({
  name: "OnPlayerOMPPlusBuildCancel",
  identifier: "ii",
  beforeEach(playerId: number, sessionId: number) {
    return {
      player: Player.getInstance(playerId)!,
      sessionId,
    };
  },
});

const [onBuildPreview] = defineEvent({
  name: "OnPlayerOMPPlusBuildPreview",
  identifier: "iiiii",
  beforeEach(
    playerId: number,
    sessionId: number,
    partId: number,
    rotationStep: number,
    flipped: number,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      sessionId,
      partId,
      rotationStep,
      flipped: !!flipped,
    };
  },
});

const [onBuildPreviewEx] = defineEvent({
  name: "OnPlayerOMPPlusBuildPreviewEx",
  identifier: "iiiiiifff",
  beforeEach(
    playerId: number,
    sessionId: number,
    partId: number,
    rotationStep: number,
    flipped: number,
    hasAimHit: number,
    aimX: number,
    aimY: number,
    aimZ: number,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      sessionId,
      partId,
      rotationStep,
      flipped: !!flipped,
      hasAimHit: !!hasAimHit,
      aimX,
      aimY,
      aimZ,
    };
  },
});

const [onBuildPreviewGroundEx] = defineEvent({
  name: "onPlayerOMPPlusBuildPreviewGroundEx",
  identifier: "iiiiiifffiff",
  beforeEach(
    playerId: number,
    sessionId: number,
    partId: number,
    rotationStep: number,
    flipped: number,
    hasAimHit: number,
    aimX: number,
    aimY: number,
    aimZ: number,
    aimSurfaceState: number,
    footprintMinGroundZ: number,
    footprintMaxGroundZ: number,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      sessionId,
      partId,
      rotationStep,
      flipped: !!flipped,
      hasAimHit: !!hasAimHit,
      aimX,
      aimY,
      aimZ,
      aimSurfaceState,
      footprintMinGroundZ,
      footprintMaxGroundZ,
    };
  },
});

// const [onPlayerSAMPPUIEvent] = defineEvent({
//   name: "OnPlayerSAMPPUIEvent",
//   identifier: "isiiss",
//   beforeEach(
//     playerId: number,
//     documentId: string,
//     eventType: number,
//     slot: number,
//     element: string,
//     payload: string,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       documentId,
//       eventType,
//       slot,
//       element,
//       payload,
//     };
//   },
// });

const [onUIEvent] = defineEvent({
  name: "OnPlayerOMPPlusUIEvent",
  identifier: "isiiss",
  beforeEach(
    playerId: number,
    documentId: string,
    eventType: number,
    slot: number,
    element: string,
    payload: string,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      documentId,
      eventType,
      slot,
      element,
      payload,
    };
  },
});

// const [onPlayerSAMPPInventoryClick] = defineEvent({
//   name: "OnPlayerSAMPPInventoryClick",
//   identifier: "isiis",
//   beforeEach(
//     playerId: number,
//     documentId: string,
//     slot: number,
//     eventType: number,
//     payload: string,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       documentId,
//       eventType,
//       slot,
//       payload,
//     };
//   },
// });

const [onInventoryClick] = defineEvent({
  name: "OnPlayerOMPPlusInventoryClick",
  identifier: "isiis",
  beforeEach(
    playerId: number,
    documentId: string,
    slot: number,
    eventType: number,
    payload: string,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      documentId,
      eventType,
      slot,
      payload,
    };
  },
});

// const [onPlayerSAMPPInventoryDrop] = defineEvent({
//   name: "OnPlayerSAMPPInventoryDrop",
//   identifier: "isiis",
//   beforeEach(
//     playerId: number,
//     documentId: string,
//     fromSlot: number,
//     toSlot: number,
//     payload: string,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       documentId,
//       fromSlot,
//       toSlot,
//       payload,
//     };
//   },
// });

const [onInventoryDrop] = defineEvent({
  name: "OnPlayerOMPPlusInventoryDrop",
  identifier: "isiis",
  beforeEach(
    playerId: number,
    documentId: string,
    fromSlot: number,
    toSlot: number,
    payload: string,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      documentId,
      fromSlot,
      toSlot,
      payload,
    };
  },
});

// const [onPlayerSAMPPInventoryAction] = defineEvent({
//   name: "OnPlayerSAMPPInventoryAction",
//   identifier: "isiss",
//   beforeEach(playerId: number, documentId: string, slot: number, action: string, payload: string) {
//     return {
//       player: Player.getInstance(playerId)!,
//       documentId,
//       slot,
//       action,
//       payload,
//     };
//   },
// });

const [onInventoryAction] = defineEvent({
  name: "OnPlayerOMPPlusInventoryAction",
  identifier: "isiss",
  beforeEach(playerId: number, documentId: string, slot: number, action: string, payload: string) {
    return {
      player: Player.getInstance(playerId)!,
      documentId,
      slot,
      action,
      payload,
    };
  },
});

// const [onPlayerSAMPPInventorySplit] = defineEvent({
//   name: "OnPlayerSAMPPInventorySplit",
//   identifier: "isiis",
//   beforeEach(playerId: number, documentId: string, slot: number, amount: number, payload: string) {
//     return {
//       player: Player.getInstance(playerId)!,
//       documentId,
//       slot,
//       amount,
//       payload,
//     };
//   },
// });

const [onInventorySplit] = defineEvent({
  name: "OnPlayerOMPPlusInventorySplit",
  identifier: "isiis",
  beforeEach(playerId: number, documentId: string, slot: number, amount: number, payload: string) {
    return {
      player: Player.getInstance(playerId)!,
      documentId,
      slot,
      amount,
      payload,
    };
  },
});

// const [onPlayerSAMPPWorkspaceDrop] = defineEvent({
//   name: "OnPlayerSAMPPWorkspaceDrop",
//   identifier: "issisiis",
//   beforeEach(
//     playerId: number,
//     documentId: string,
//     fromPane: string,
//     fromSlot: number,
//     toPane: string,
//     toSlot: number,
//     amount: number,
//     payload: string,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       documentId,
//       fromPane,
//       fromSlot,
//       toPane,
//       toSlot,
//       amount,
//       payload,
//     };
//   },
// });

const [onWorkspaceDrop] = defineEvent({
  name: "OnPlayerOMPPlusWorkspaceDrop",
  identifier: "issisiis",
  beforeEach(
    playerId: number,
    documentId: string,
    fromPane: string,
    fromSlot: number,
    toPane: string,
    toSlot: number,
    amount: number,
    payload: string,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      documentId,
      fromPane,
      fromSlot,
      toPane,
      toSlot,
      amount,
      payload,
    };
  },
});

// const [onPlayerSAMPPWorkspaceAction] = defineEvent({
//   name: "OnPlayerSAMPPWorkspaceAction",
//   identifier: "ississ",
//   beforeEach(
//     playerId: number,
//     documentId: string,
//     paneId: string,
//     slot: number,
//     action: string,
//     payload: string,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       documentId,
//       paneId,
//       slot,
//       action,
//       payload,
//     };
//   },
// });

const [onWorkspaceAction] = defineEvent({
  name: "OnPlayerOMPPlusWorkspaceAction",
  identifier: "ississ",
  beforeEach(
    playerId: number,
    documentId: string,
    paneId: string,
    slot: number,
    action: string,
    payload: string,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      documentId,
      paneId,
      slot,
      action,
      payload,
    };
  },
});

// const [onPlayerSAMPPWorkspaceSplit] = defineEvent({
//   name: "OnPlayerSAMPPWorkspaceSplit",
//   identifier: "issiis",
//   beforeEach(
//     playerId: number,
//     documentId: string,
//     paneId: string,
//     slot: number,
//     amount: number,
//     payload: string,
//   ) {
//     return {
//       player: Player.getInstance(playerId)!,
//       documentId,
//       paneId,
//       slot,
//       amount,
//       payload,
//     };
//   },
// });

const [onWorkspaceSplit] = defineEvent({
  name: "OnPlayerOMPPlusWorkspaceSplit",
  identifier: "issiis",
  beforeEach(
    playerId: number,
    documentId: string,
    paneId: string,
    slot: number,
    amount: number,
    payload: string,
  ) {
    return {
      player: Player.getInstance(playerId)!,
      documentId,
      paneId,
      slot,
      amount,
      payload,
    };
  },
});

export const OMPPEvent = {
  onOpenPauseMenu,
  onClosePauseMenu,
  onEnterPauseSubmenu,
  onDriveByShot,
  onStunt,
  onResolutionChange,
  onConnect,
  onJoin,
  onClick,
  onChangeRadioStation,
  onDrinkSprunk,
  onReady,
  onKey,
  onTargetMode,
  onTargetSelect,
  onBuildSelect,
  onBuildPlace,
  onPlaceEx,
  onPlaceGroundEx,
  onBuildCancel,
  onBuildPreview,
  onBuildPreviewEx,
  onBuildPreviewGroundEx,
  onUIEvent,
  onInventoryClick,
  onInventoryDrop,
  onInventoryAction,
  onInventorySplit,
  onWorkspaceDrop,
  onWorkspaceAction,
  onWorkspaceSplit,
};
