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

export const orig_AddStaticVehicle = Vehicle.__inject__AddStaticVehicle;
export const orig_AddStaticVehicleEx = Vehicle.__inject__AddStaticVehicleEx;
export const orig_CreateVehicle = Vehicle.__inject__CreateVehicle;
export const orig_DestroyVehicle = Vehicle.__inject__DestroyVehicle;

export const orig_AddPlayerClass = GameMode.addPlayerClass;
export const orig_AddPlayerClassEx = GameMode.addPlayerClassEx;
export const orig_EditPlayerClass = GameMode.editPlayerClass;

export const orig_TextDrawCreate = TextDraw.__inject__TextDrawCreate;
export const orig_TextDrawDestroy = TextDraw.__inject__TextDrawDestroy;
export const orig_TextDrawLetterSize = TextDraw.__inject__TextDrawLetterSize;
export const orig_TextDrawTextSize = TextDraw.__inject__TextDrawTextSize;
export const orig_TextDrawAlignment = TextDraw.__inject__TextDrawAlignment;
export const orig_TextDrawColor = TextDraw.__inject__TextDrawColor;
export const orig_TextDrawUseBox = TextDraw.__inject__TextDrawUseBox;
export const orig_TextDrawBoxColor = TextDraw.__inject__TextDrawBoxColor;
export const orig_TextDrawSetShadow = TextDraw.__inject__TextDrawSetShadow;
export const orig_TextDrawSetOutline = TextDraw.__inject__TextDrawSetOutline;
export const orig_TextDrawBackgroundColor =
  TextDraw.__inject__TextDrawBackgroundColor;
export const orig_TextDrawFont = TextDraw.__inject__TextDrawFont;
export const orig_TextDrawSetProportional =
  TextDraw.__inject__TextDrawSetProportional;
export const orig_TextDrawSetSelectable =
  TextDraw.__inject__TextDrawSetSelectable;
export const orig_TextDrawShowForPlayer =
  TextDraw.__inject__TextDrawShowForPlayer;
export const orig_TextDrawHideForPlayer =
  TextDraw.__inject__TextDrawHideForPlayer;
export const orig_TextDrawShowForAll = TextDraw.__inject__TextDrawShowForAll;
export const orig_TextDrawHideForAll = TextDraw.__inject__TextDrawHideForAll;
export const orig_TextDrawSetString = TextDraw.__inject__TextDrawSetString;
export const orig_TextDrawSetPreviewModel =
  TextDraw.__inject__TextDrawSetPreviewModel;
export const orig_TextDrawSetPreviewRot =
  TextDraw.__inject__TextDrawSetPreviewRot;
export const orig_TextDrawSetPreviewVehCol =
  TextDraw.__inject__TextDrawSetPreviewVehicleColors;
export const orig_IsValidTextDraw = TextDraw.__inject__IsValidTextDraw;
export const orig_IsTextDrawVisibleForPlayer =
  TextDraw.__inject__IsTextDrawVisibleForPlayer;
export const orig_TextDrawGetString = TextDraw.__inject__TextDrawGetString;
export const orig_TextDrawSetPos = TextDraw.__inject__TextDrawSetPos;
export const orig_TextDrawGetLetterSize =
  TextDraw.__inject__TextDrawGetLetterSize;
export const orig_TextDrawGetTextSize = TextDraw.__inject__TextDrawGetTextSize;
export const orig_TextDrawGetPos = TextDraw.__inject__TextDrawGetPos;
export const orig_TextDrawGetColor = TextDraw.__inject__TextDrawGetColor;
export const orig_TextDrawGetBoxColor = TextDraw.__inject__TextDrawGetBoxColor;
export const orig_TextDrawGetBackgroundColor =
  TextDraw.__inject__TextDrawGetBackgroundColor;
export const orig_TextDrawGetShadow = TextDraw.__inject__TextDrawGetShadow;
export const orig_TextDrawGetOutline = TextDraw.__inject__TextDrawGetOutline;
export const orig_TextDrawGetFont = TextDraw.__inject__TextDrawGetFont;
export const orig_TextDrawIsBox = TextDraw.__inject__TextDrawIsBox;
export const orig_TextDrawIsProportional =
  TextDraw.__inject__TextDrawIsProportional;
export const orig_TextDrawIsSelectable =
  TextDraw.__inject__TextDrawIsSelectable;
export const orig_TextDrawGetAlignment =
  TextDraw.__inject__TextDrawGetAlignment;
export const orig_TextDrawGetPreviewModel =
  TextDraw.__inject__TextDrawGetPreviewModel;
export const orig_TextDrawGetPreviewRot =
  TextDraw.__inject__TextDrawGetPreviewRot;
export const orig_TextDrawSetStringForPlayer =
  TextDraw.__inject__TextDrawSetStringForPlayer;
export const orig_TextDrawGetPreviewVehCol =
  TextDraw.__inject__TextDrawGetPreviewVehicleColors;

export const orig_CreatePlayerTextDraw =
  TextDraw.__inject__CreatePlayerTextDraw;
export const orig_PlayerTextDrawDestroy =
  TextDraw.__inject__PlayerTextDrawDestroy;
export const orig_PlayerTextDrawLetterSize =
  TextDraw.__inject__PlayerTextDrawLetterSize;
export const orig_PlayerTextDrawTextSize =
  TextDraw.__inject__PlayerTextDrawTextSize;
export const orig_PlayerTextDrawAlignment =
  TextDraw.__inject__PlayerTextDrawAlignment;
export const orig_PlayerTextDrawColor = TextDraw.__inject__PlayerTextDrawColor;
export const orig_PlayerTextDrawUseBox =
  TextDraw.__inject__PlayerTextDrawUseBox;
export const orig_PlayerTextDrawBoxColor =
  TextDraw.__inject__PlayerTextDrawBoxColor;
export const orig_PlayerTextDrawSetShadow =
  TextDraw.__inject__PlayerTextDrawSetShadow;
export const orig_PlayerTextDrawSetOutline =
  TextDraw.__inject__PlayerTextDrawSetOutline;
export const orig_PlayerTextDrawBackgroundColor =
  TextDraw.__inject__PlayerTextDrawBackgroundColor;
export const orig_PlayerTextDrawFont = TextDraw.__inject__PlayerTextDrawFont;
export const orig_PlayerTextDrawSetProportional =
  TextDraw.__inject__PlayerTextDrawSetProportional;
export const orig_PlayerTextDrawSetSelectable =
  TextDraw.__inject__PlayerTextDrawSetSelectable;
export const orig_PlayerTextDrawShow = TextDraw.__inject__PlayerTextDrawShow;
export const orig_PlayerTextDrawHide = TextDraw.__inject__PlayerTextDrawHide;
export const orig_PlayerTextDrawSetString =
  TextDraw.__inject__PlayerTextDrawSetString;
export const orig_PlayerTextDrawSetPreviewModel =
  TextDraw.__inject__PlayerTextDrawSetPreviewModel;
export const orig_PlayerTextDrawSetPreviewRot =
  TextDraw.__inject__PlayerTextDrawSetPreviewRot;
export const orig_PlayerTextDrawSetPreviewVehCol =
  TextDraw.__inject__PlayerTextDrawSetPreviewVehicleColors;
export const orig_IsValidPlayerTextDraw =
  TextDraw.__inject__IsValidPlayerTextDraw;
export const orig_IsPlayerTextDrawVisible =
  TextDraw.__inject__IsPlayerTextDrawVisible;
export const orig_PlayerTextDrawGetString =
  TextDraw.__inject__PlayerTextDrawGetString;
export const orig_PlayerTextDrawSetPos =
  TextDraw.__inject__PlayerTextDrawSetPos;
export const orig_PlayerTextDrawGetLetterSize =
  TextDraw.__inject__PlayerTextDrawGetLetterSize;
export const orig_PlayerTextDrawGetTextSize =
  TextDraw.__inject__PlayerTextDrawGetTextSize;
export const orig_PlayerTextDrawGetPos =
  TextDraw.__inject__PlayerTextDrawGetPos;
export const orig_PlayerTextDrawGetColor =
  TextDraw.__inject__PlayerTextDrawGetColor;
export const orig_PlayerTextDrawGetBoxColor =
  TextDraw.__inject__PlayerTextDrawGetBoxColor;
export const orig_PlayerTextDrawGetShadow =
  TextDraw.__inject__PlayerTextDrawGetShadow;
export const orig_PlayerTextDrawGetOutline =
  TextDraw.__inject__PlayerTextDrawGetOutline;
export const orig_PlayerTextDrawGetFont =
  TextDraw.__inject__PlayerTextDrawGetFont;
export const orig_PlayerTextDrawIsBox = TextDraw.__inject__PlayerTextDrawIsBox;
export const orig_PlayerTextDrawIsProportional =
  TextDraw.__inject__PlayerTextDrawIsProportional;
export const orig_PlayerTextDrawIsSelectable =
  TextDraw.__inject__PlayerTextDrawIsSelectable;
export const orig_PlayerTextDrawGetAlignment =
  TextDraw.__inject__PlayerTextDrawGetAlignment;
export const orig_PlayerTextDrawGetPreviewModel =
  TextDraw.__inject__PlayerTextDrawGetPreviewModel;
export const orig_PlayerTextDrawGetPreviewRot =
  TextDraw.__inject__PlayerTextDrawGetPreviewRot;
export const orig_PlayerTextDrawGetBackgroundCol =
  TextDraw.__inject__PlayerTextDrawGetBackgroundColor;
export const orig_PlayerTextDrawGetPreviewVehCol =
  TextDraw.__inject__PlayerTextDrawGetPreviewVehicleColors;
