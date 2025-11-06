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

export const orig_AddStaticVehicle = Vehicle.__inject__.addStatic;
export const orig_AddStaticVehicleEx = Vehicle.__inject__.addStaticEx;
export const orig_CreateVehicle = Vehicle.__inject__.create;
export const orig_DestroyVehicle = Vehicle.__inject__.destroy;

export const orig_AddPlayerClass = GameMode.addPlayerClass;
export const orig_AddPlayerClassEx = GameMode.addPlayerClassEx;
export const orig_EditPlayerClass = GameMode.editPlayerClass;

export const orig_TextDrawCreate = TextDraw.__inject__.create;
export const orig_TextDrawDestroy = TextDraw.__inject__.destroy;
export const orig_TextDrawLetterSize = TextDraw.__inject__.setLetterSize;
export const orig_TextDrawTextSize = TextDraw.__inject__.setTextSize;
export const orig_TextDrawAlignment = TextDraw.__inject__.setAlignment;
export const orig_TextDrawColor = TextDraw.__inject__.setColor;
export const orig_TextDrawUseBox = TextDraw.__inject__.useBox;
export const orig_TextDrawBoxColor = TextDraw.__inject__.setBoxColor;
export const orig_TextDrawSetShadow = TextDraw.__inject__.setShadow;
export const orig_TextDrawSetOutline = TextDraw.__inject__.setOutline;
export const orig_TextDrawBackgroundColor =
  TextDraw.__inject__.setBackgroundColor;
export const orig_TextDrawFont = TextDraw.__inject__.setFont;
export const orig_TextDrawSetProportional = TextDraw.__inject__.setProportional;
export const orig_TextDrawSetSelectable = TextDraw.__inject__.setSelectable;
export const orig_TextDrawShowForPlayer = TextDraw.__inject__.showForPlayer;
export const orig_TextDrawHideForPlayer = TextDraw.__inject__.hideForPlayer;
export const orig_TextDrawShowForAll = TextDraw.__inject__.showForAll;
export const orig_TextDrawHideForAll = TextDraw.__inject__.hideForAll;
export const orig_TextDrawSetString = TextDraw.__inject__.setString;
export const orig_TextDrawSetPreviewModel = TextDraw.__inject__.setPreviewModel;
export const orig_TextDrawSetPreviewRot = TextDraw.__inject__.setPreviewRot;
export const orig_TextDrawSetPreviewVehCol =
  TextDraw.__inject__.setPreviewVehicleColors;
export const orig_IsValidTextDraw = TextDraw.__inject__.isValid;
export const orig_IsTextDrawVisibleForPlayer =
  TextDraw.__inject__.isVisibleForPlayer;
export const orig_TextDrawGetString = TextDraw.__inject__.getString;
export const orig_TextDrawSetPos = TextDraw.__inject__.setPos;
export const orig_TextDrawGetLetterSize = TextDraw.__inject__.getLetterSize;
export const orig_TextDrawGetTextSize = TextDraw.__inject__.getTextSize;
export const orig_TextDrawGetPos = TextDraw.__inject__.getPos;
export const orig_TextDrawGetColor = TextDraw.__inject__.getColor;
export const orig_TextDrawGetBoxColor = TextDraw.__inject__.getBoxColor;
export const orig_TextDrawGetBackgroundColor =
  TextDraw.__inject__.getBackgroundColor;
export const orig_TextDrawGetShadow = TextDraw.__inject__.getShadow;
export const orig_TextDrawGetOutline = TextDraw.__inject__.getOutline;
export const orig_TextDrawGetFont = TextDraw.__inject__.getFont;
export const orig_TextDrawIsBox = TextDraw.__inject__.isBox;
export const orig_TextDrawIsProportional = TextDraw.__inject__.isProportional;
export const orig_TextDrawIsSelectable = TextDraw.__inject__.isSelectable;
export const orig_TextDrawGetAlignment = TextDraw.__inject__.getAlignment;
export const orig_TextDrawGetPreviewModel = TextDraw.__inject__.getPreviewModel;
export const orig_TextDrawGetPreviewRot = TextDraw.__inject__.getPreviewRot;
export const orig_TextDrawSetStringForPlayer =
  TextDraw.__inject__.setStringForPlayer;
export const orig_TextDrawGetPreviewVehCol =
  TextDraw.__inject__.getPreviewVehicleColors;

export const orig_CreatePlayerTextDraw = TextDraw.__inject__.createPlayer;
export const orig_PlayerTextDrawDestroy = TextDraw.__inject__.destroyPlayer;
export const orig_PlayerTextDrawLetterSize =
  TextDraw.__inject__.setLetterSizePlayer;
export const orig_PlayerTextDrawTextSize =
  TextDraw.__inject__.setTextSizePlayer;
export const orig_PlayerTextDrawAlignment =
  TextDraw.__inject__.setAlignmentPlayer;
export const orig_PlayerTextDrawColor = TextDraw.__inject__.setColorPlayer;
export const orig_PlayerTextDrawUseBox = TextDraw.__inject__.useBoxPlayer;
export const orig_PlayerTextDrawBoxColor =
  TextDraw.__inject__.setBoxColorPlayer;
export const orig_PlayerTextDrawSetShadow = TextDraw.__inject__.setShadowPlayer;
export const orig_PlayerTextDrawSetOutline =
  TextDraw.__inject__.setOutlinePlayer;
export const orig_PlayerTextDrawBackgroundColor =
  TextDraw.__inject__.setBackgroundColorPlayer;
export const orig_PlayerTextDrawFont = TextDraw.__inject__.setFontPlayer;
export const orig_PlayerTextDrawSetProportional =
  TextDraw.__inject__.setProportionalPlayer;
export const orig_PlayerTextDrawSetSelectable =
  TextDraw.__inject__.setSelectablePlayer;
export const orig_PlayerTextDrawShow = TextDraw.__inject__.showPlayer;
export const orig_PlayerTextDrawHide = TextDraw.__inject__.hidePlayer;
export const orig_PlayerTextDrawSetString = TextDraw.__inject__.setStringPlayer;
export const orig_PlayerTextDrawSetPreviewModel =
  TextDraw.__inject__.setPreviewModelPlayer;
export const orig_PlayerTextDrawSetPreviewRot =
  TextDraw.__inject__.setPreviewRotPlayer;
export const orig_PlayerTextDrawSetPreviewVehCol =
  TextDraw.__inject__.setPreviewVehicleColorsPlayer;
export const orig_IsValidPlayerTextDraw = TextDraw.__inject__.isValidPlayer;
export const orig_IsPlayerTextDrawVisible = TextDraw.__inject__.isVisiblePlayer;
export const orig_PlayerTextDrawGetString = TextDraw.__inject__.getStringPlayer;
export const orig_PlayerTextDrawSetPos = TextDraw.__inject__.setPosPlayer;
export const orig_PlayerTextDrawGetLetterSize =
  TextDraw.__inject__.getLetterSizePlayer;
export const orig_PlayerTextDrawGetTextSize =
  TextDraw.__inject__.getTextSizePlayer;
export const orig_PlayerTextDrawGetPos = TextDraw.__inject__.getPosPlayer;
export const orig_PlayerTextDrawGetColor = TextDraw.__inject__.getColorPlayer;
export const orig_PlayerTextDrawGetBoxColor =
  TextDraw.__inject__.getBoxColorPlayer;
export const orig_PlayerTextDrawGetShadow = TextDraw.__inject__.getShadowPlayer;
export const orig_PlayerTextDrawGetOutline =
  TextDraw.__inject__.getOutlinePlayer;
export const orig_PlayerTextDrawGetFont = TextDraw.__inject__.getFontPlayer;
export const orig_PlayerTextDrawIsBox = TextDraw.__inject__.isBoxPlayer;
export const orig_PlayerTextDrawIsProportional =
  TextDraw.__inject__.isProportionalPlayer;
export const orig_PlayerTextDrawIsSelectable =
  TextDraw.__inject__.isSelectablePlayer;
export const orig_PlayerTextDrawGetAlignment =
  TextDraw.__inject__.getAlignmentPlayer;
export const orig_PlayerTextDrawGetPreviewModel =
  TextDraw.__inject__.getPreviewModelPlayer;
export const orig_PlayerTextDrawGetPreviewRot =
  TextDraw.__inject__.getPreviewRotPlayer;
export const orig_PlayerTextDrawGetBackgroundCol =
  TextDraw.__inject__.getBackgroundColorPlayer;
export const orig_PlayerTextDrawGetPreviewVehCol =
  TextDraw.__inject__.getPreviewVehicleColorsPlayer;
