import {
  defineHooks,
  Checkpoint,
  RaceCheckpoint,
  GameMode,
  Player,
  TextDraw,
  Vehicle,
} from "@infernus/core";

export const [orig_playerMethods, setPlayerHook] = defineHooks(Player);
export const [orig_vehicleMethods, setVehicleHook] = defineHooks(Vehicle);

export const orig_IsPlayerInCheckpoint = Checkpoint.isPlayerIn;
export const orig_IsPlayerInRaceCheckpoint = RaceCheckpoint.isPlayerIn;

export const orig_AddStaticVehicle = Vehicle.__inject__.AddStaticVehicle;
export const orig_AddStaticVehicleEx = Vehicle.__inject__.AddStaticVehicleEx;
export const orig_CreateVehicle = Vehicle.__inject__.CreateVehicle;
export const orig_DestroyVehicle = Vehicle.__inject__.DestroyVehicle;

export const orig_AddPlayerClass = GameMode.addPlayerClass;
export const orig_AddPlayerClassEx = GameMode.addPlayerClassEx;
export const orig_EditPlayerClass = GameMode.editPlayerClass;

export const orig_TextDrawCreate = TextDraw.__inject__.TextDrawCreate;
export const orig_TextDrawDestroy = TextDraw.__inject__.TextDrawDestroy;
export const orig_TextDrawLetterSize = TextDraw.__inject__.TextDrawLetterSize;
export const orig_TextDrawTextSize = TextDraw.__inject__.TextDrawTextSize;
export const orig_TextDrawAlignment = TextDraw.__inject__.TextDrawAlignment;
export const orig_TextDrawColor = TextDraw.__inject__.TextDrawColor;
export const orig_TextDrawUseBox = TextDraw.__inject__.TextDrawUseBox;
export const orig_TextDrawBoxColor = TextDraw.__inject__.TextDrawBoxColor;
export const orig_TextDrawSetShadow = TextDraw.__inject__.TextDrawSetShadow;
export const orig_TextDrawSetOutline = TextDraw.__inject__.TextDrawSetOutline;
export const orig_TextDrawBackgroundColor =
  TextDraw.__inject__.TextDrawBackgroundColor;
export const orig_TextDrawFont = TextDraw.__inject__.TextDrawFont;
export const orig_TextDrawSetProportional =
  TextDraw.__inject__.TextDrawSetProportional;
export const orig_TextDrawSetSelectable =
  TextDraw.__inject__.TextDrawSetSelectable;
export const orig_TextDrawShowForPlayer =
  TextDraw.__inject__.TextDrawShowForPlayer;
export const orig_TextDrawHideForPlayer =
  TextDraw.__inject__.TextDrawHideForPlayer;
export const orig_TextDrawShowForAll = TextDraw.__inject__.TextDrawShowForAll;
export const orig_TextDrawHideForAll = TextDraw.__inject__.TextDrawHideForAll;
export const orig_TextDrawSetString = TextDraw.__inject__.TextDrawSetString;
export const orig_TextDrawSetPreviewModel =
  TextDraw.__inject__.TextDrawSetPreviewModel;
export const orig_TextDrawSetPreviewRot =
  TextDraw.__inject__.TextDrawSetPreviewRot;
export const orig_TextDrawSetPreviewVehCol =
  TextDraw.__inject__.TextDrawSetPreviewVehicleColors;
export const orig_IsValidTextDraw = TextDraw.__inject__.IsValidTextDraw;
export const orig_IsTextDrawVisibleForPlayer =
  TextDraw.__inject__.IsTextDrawVisibleForPlayer;
export const orig_TextDrawGetString = TextDraw.__inject__.TextDrawGetString;
export const orig_TextDrawSetPos = TextDraw.__inject__.TextDrawSetPos;
export const orig_TextDrawGetLetterSize =
  TextDraw.__inject__.TextDrawGetLetterSize;
export const orig_TextDrawGetTextSize = TextDraw.__inject__.TextDrawGetTextSize;
export const orig_TextDrawGetPos = TextDraw.__inject__.TextDrawGetPos;
export const orig_TextDrawGetColor = TextDraw.__inject__.TextDrawGetColor;
export const orig_TextDrawGetBoxColor = TextDraw.__inject__.TextDrawGetBoxColor;
export const orig_TextDrawGetBackgroundColor =
  TextDraw.__inject__.TextDrawGetBackgroundColor;
export const orig_TextDrawGetShadow = TextDraw.__inject__.TextDrawGetShadow;
export const orig_TextDrawGetOutline = TextDraw.__inject__.TextDrawGetOutline;
export const orig_TextDrawGetFont = TextDraw.__inject__.TextDrawGetFont;
export const orig_TextDrawIsBox = TextDraw.__inject__.TextDrawIsBox;
export const orig_TextDrawIsProportional =
  TextDraw.__inject__.TextDrawIsProportional;
export const orig_TextDrawIsSelectable =
  TextDraw.__inject__.TextDrawIsSelectable;
export const orig_TextDrawGetAlignment =
  TextDraw.__inject__.TextDrawGetAlignment;
export const orig_TextDrawGetPreviewModel =
  TextDraw.__inject__.TextDrawGetPreviewModel;
export const orig_TextDrawGetPreviewRot =
  TextDraw.__inject__.TextDrawGetPreviewRot;
export const orig_TextDrawSetStringForPlayer =
  TextDraw.__inject__.TextDrawSetStringForPlayer;
export const orig_TextDrawGetPreviewVehCol =
  TextDraw.__inject__.TextDrawGetPreviewVehicleColors;

export const orig_CreatePlayerTextDraw =
  TextDraw.__inject__.CreatePlayerTextDraw;
export const orig_PlayerTextDrawDestroy =
  TextDraw.__inject__.PlayerTextDrawDestroy;
export const orig_PlayerTextDrawLetterSize =
  TextDraw.__inject__.PlayerTextDrawLetterSize;
export const orig_PlayerTextDrawTextSize =
  TextDraw.__inject__.PlayerTextDrawTextSize;
export const orig_PlayerTextDrawAlignment =
  TextDraw.__inject__.PlayerTextDrawAlignment;
export const orig_PlayerTextDrawColor = TextDraw.__inject__.PlayerTextDrawColor;
export const orig_PlayerTextDrawUseBox =
  TextDraw.__inject__.PlayerTextDrawUseBox;
export const orig_PlayerTextDrawBoxColor =
  TextDraw.__inject__.PlayerTextDrawBoxColor;
export const orig_PlayerTextDrawSetShadow =
  TextDraw.__inject__.PlayerTextDrawSetShadow;
export const orig_PlayerTextDrawSetOutline =
  TextDraw.__inject__.PlayerTextDrawSetOutline;
export const orig_PlayerTextDrawBackgroundColor =
  TextDraw.__inject__.PlayerTextDrawBackgroundColor;
export const orig_PlayerTextDrawFont = TextDraw.__inject__.PlayerTextDrawFont;
export const orig_PlayerTextDrawSetProportional =
  TextDraw.__inject__.PlayerTextDrawSetProportional;
export const orig_PlayerTextDrawSetSelectable =
  TextDraw.__inject__.PlayerTextDrawSetSelectable;
export const orig_PlayerTextDrawShow = TextDraw.__inject__.PlayerTextDrawShow;
export const orig_PlayerTextDrawHide = TextDraw.__inject__.PlayerTextDrawHide;
export const orig_PlayerTextDrawSetString =
  TextDraw.__inject__.PlayerTextDrawSetString;
export const orig_PlayerTextDrawSetPreviewModel =
  TextDraw.__inject__.PlayerTextDrawSetPreviewModel;
export const orig_PlayerTextDrawSetPreviewRot =
  TextDraw.__inject__.PlayerTextDrawSetPreviewRot;
export const orig_PlayerTextDrawSetPreviewVehCol =
  TextDraw.__inject__.PlayerTextDrawSetPreviewVehicleColors;
export const orig_IsValidPlayerTextDraw =
  TextDraw.__inject__.IsValidPlayerTextDraw;
export const orig_IsPlayerTextDrawVisible =
  TextDraw.__inject__.IsPlayerTextDrawVisible;
export const orig_PlayerTextDrawGetString =
  TextDraw.__inject__.PlayerTextDrawGetString;
export const orig_PlayerTextDrawSetPos =
  TextDraw.__inject__.PlayerTextDrawSetPos;
export const orig_PlayerTextDrawGetLetterSize =
  TextDraw.__inject__.PlayerTextDrawGetLetterSize;
export const orig_PlayerTextDrawGetTextSize =
  TextDraw.__inject__.PlayerTextDrawGetTextSize;
export const orig_PlayerTextDrawGetPos =
  TextDraw.__inject__.PlayerTextDrawGetPos;
export const orig_PlayerTextDrawGetColor =
  TextDraw.__inject__.PlayerTextDrawGetColor;
export const orig_PlayerTextDrawGetBoxColor =
  TextDraw.__inject__.PlayerTextDrawGetBoxColor;
export const orig_PlayerTextDrawGetShadow =
  TextDraw.__inject__.PlayerTextDrawGetShadow;
export const orig_PlayerTextDrawGetOutline =
  TextDraw.__inject__.PlayerTextDrawGetOutline;
export const orig_PlayerTextDrawGetFont =
  TextDraw.__inject__.PlayerTextDrawGetFont;
export const orig_PlayerTextDrawIsBox = TextDraw.__inject__.PlayerTextDrawIsBox;
export const orig_PlayerTextDrawIsProportional =
  TextDraw.__inject__.PlayerTextDrawIsProportional;
export const orig_PlayerTextDrawIsSelectable =
  TextDraw.__inject__.PlayerTextDrawIsSelectable;
export const orig_PlayerTextDrawGetAlignment =
  TextDraw.__inject__.PlayerTextDrawGetAlignment;
export const orig_PlayerTextDrawGetPreviewModel =
  TextDraw.__inject__.PlayerTextDrawGetPreviewModel;
export const orig_PlayerTextDrawGetPreviewRot =
  TextDraw.__inject__.PlayerTextDrawGetPreviewRot;
export const orig_PlayerTextDrawGetBackgroundCol =
  TextDraw.__inject__.PlayerTextDrawGetBackgroundColor;
export const orig_PlayerTextDrawGetPreviewVehCol =
  TextDraw.__inject__.PlayerTextDrawGetPreviewVehicleColors;
