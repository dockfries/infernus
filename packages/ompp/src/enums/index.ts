export enum HUDComponent {
  All = 0,
  Ammo = 1,
  Weapon = 2,
  Health = 3,
  Breath = 4,
  Armour = 5,
  Minimap = 6,
  Crosshair = 7,
  Money = 8,
}

export enum HUDColour {
  MoneyPositive = 0,
  MoneyNegative = 1,
  Armour = 2,
  Health = 3,
  Breath = 4,
  Ammo = 5,
  WantedLevel = 6,
  RadioTuned = 7,
  RadioUntuned = 8,
}

export enum RadioStation {
  PlaybackFM = 1,
  KROSE = 2,
  KDST = 3,
  BounceFM = 4,
  SFUR = 5,
  Lossantos = 6,
  RadioX = 7,
  CSR = 8,
  KJAHWest = 9,
  Mastersounds = 10,
  WCTR = 11,
  UTP = 12,
  Off = 13,
}

export enum PauseMenuId {
  Stats = 0,
  StartGame = 1,
  Brief = 2,
  AudioSettings = 3,
  DisplaySettings = 4,
  Map = 5,
  DefaultSettings = 23,
  AudioDefaultSettings = 24,
  ControllerDefaultSettings = 25,
  UserTrackOptions = 26,
  Language = 28,
  Options = 33,
  QuitGame = 35,
  ControllerSetup = 36,
  RedefineControls = 37,
  FootVehicleControls = 38,
  MouseSettings = 39,
  JoypadSettings = 40,
  Main = 41,
}

export enum PlayerAction {
  All = 0,
  Sprint = 1,
  EnterCar = 2,
  Crouch = 3,
  FireWeapon = 4,
  Unknown = 5,
  SwitchWeapon = 6,
  Jump = 7,
}

export enum StuntType {
  TwoWheels = 247,
  Insane = 173,
  Wheelie = 117,
  Stoppie = 233,
}

export enum BlurIntensity {
  Default = 36,
  NoBlur = 0,
}

export enum DefaultHeight {
  Aircraft = 800,
  Jetpack = 100,
}

export enum MouseButton {
  LeftClick = 0,
  RightClick = 1,
  MiddleClick = 2,
}

export enum KeyState {
  Up = 0,
  Down = 1,
}

export enum KeyEvent {
  Down = 1,
  Up = 2,
  Both = 3,
}

export enum Feature {
  Hud = 1,
  Keybind = 2,
  KeyCapture = 4,
  Audio = 8,
  Effects = 16,
  UI = 32,
  Target = 64,
  Build = 128,
}

export enum Capability {
  NativeTransport = 1,
  KeyCapture = 2,
  TargetUI = 4,
  TargetUIV2 = 8,
  BuildUI = 16,
  RmlUI = 32,
}

export enum UITemplate {
  Panel = 0,
  Inventory = 1,
  Storage = 2,
  Crafting = 3,
  Phone = 4,
  Tablet = 5,
  Workspace = 6,
}

export enum WorkspaceLayout {
  Auto = 0,
  Inventory = 1,
  Storage = 2,
  Crafting = 3,
  Trade = 4,
}

export enum Pane {
  Grid = 0,
  Equipment = 1,
  Storage = 2,
  Loot = 3,
  RecipeList = 4,
  CraftQueue = 5,
  Info = 6,
}

export enum UIFlag {
  Modal = 1,
  CaptureMouse = 2,
  CaptureKeyboard = 4,
  CloseOnEscape = 8,
  Default = Modal | CaptureMouse | CaptureKeyboard | CloseOnEscape,
}

export enum UIEvent {
  Click = 1,
  SecondaryClick = 2,
  Close = 3,
  Submit = 4,
  SlotDrop = 5,
  WorldDrop = 6,
  InventoryAction = 7,
  InventorySplit = 8,
  WorkspaceDrop = 9,
  WorkspaceWorldDrop = 10,
  WorkspaceAction = 11,
  WorkspaceSplit = 12,
}

export enum EquipSlot {
  Head = 0,
  Mask = 1,
  Shirt = 2,
  Armor = 3,
  Pants = 4,
  Shoes = 5,
  Backpack = 6,
  Accessory = 7,
  PrimaryWeapon = 8,
  SecondaryWeapon = 9,
}

export enum CaptureFlag {
  ConsumeGameInput = 1,
  BlockSwitchWeapon = 2,
  Default = ConsumeGameInput | BlockSwitchWeapon,
}

export enum CapturePriority {
  Low = 0,
  Item = 20,
  Vehicle = 40,
  Menu = 60,
}

export enum TargetFlag {
  HidePrompt = 1,
  DirectSelect = 2,
  PayloadV2 = 1073741824,
}

export enum TargetType {
  Generic = 0,
  Vehicle = 1,
  House = 2,
  NPC = 3,
  Actor = 4,
  Object = 5,
  Item = 6,
  Player = 7,
  Custom = 8,
}

export enum TargetLayout {
  Auto = 0,
  Compact = 1,
  Standard = 2,
  Dialog = 3,
  Wide = 4,
  Minimal = 5,
  Category = 6,
}

export enum TargetRow {
  Action = 0,
  Info = 1,
  Dialog = 2,
  Divider = 3,
  Header = 4,
  Disabled = 5,
  Toggle = 6,
  Danger = 7,
}

export enum BuildResult {
  Success = 1,
  Error = 2,
  PreviewValid = 3,
  PreviewInvalid = 4,
}

export enum BuildAimSurface {
  None = 0,
  Ground = 1,
  BlockedNonGround = 2,
}

export enum BuildPart {
  None = 0,
  Foundation = 1,
  Wall = 2,
  Doorframe = 3,
  Floor = 4,
  Roof = 5,
  Stairs = 6,
  Door = 7,
  FloorStairs = 8,
  Remove = 100,
}

export enum KeyCode {
  LBUTTON = 0x01,
  RBUTTON = 0x02,
  MBUTTON = 0x04,
  XBUTTON1 = 0x05,
  XBUTTON2 = 0x06,
  BACKSPACE = 0x08,
  TAB = 0x09,
  ENTER = 0x0d,
  SHIFT = 0x10,
  CONTROL = 0x11,
  ALT = 0x12,
  PAUSE = 0x13,
  CAPSLOCK = 0x14,
  ESCAPE = 0x1b,
  SPACE = 0x20,
  PAGEUP = 0x21,
  PAGEDOWN = 0x22,
  END = 0x23,
  HOME = 0x24,
  LEFT = 0x25,
  UP = 0x26,
  RIGHT = 0x27,
  DOWN = 0x28,
  INSERT = 0x2d,
  DELETE = 0x2e,
  KEY_0 = 0x30,
  KEY_1 = 0x31,
  KEY_2 = 0x32,
  KEY_3 = 0x33,
  KEY_4 = 0x34,
  KEY_5 = 0x35,
  KEY_6 = 0x36,
  KEY_7 = 0x37,
  KEY_8 = 0x38,
  KEY_9 = 0x39,
  A = 0x41,
  B = 0x42,
  C = 0x43,
  D = 0x44,
  E = 0x45,
  F = 0x46,
  G = 0x47,
  H = 0x48,
  I = 0x49,
  J = 0x4a,
  K = 0x4b,
  L = 0x4c,
  M = 0x4d,
  N = 0x4e,
  O = 0x4f,
  P = 0x50,
  Q = 0x51,
  R = 0x52,
  S = 0x53,
  T = 0x54,
  U = 0x55,
  V = 0x56,
  W = 0x57,
  X = 0x58,
  Y = 0x59,
  Z = 0x5a,
  NUMPAD0 = 0x60,
  NUMPAD1 = 0x61,
  NUMPAD2 = 0x62,
  NUMPAD3 = 0x63,
  NUMPAD4 = 0x64,
  NUMPAD5 = 0x65,
  NUMPAD6 = 0x66,
  NUMPAD7 = 0x67,
  NUMPAD8 = 0x68,
  NUMPAD9 = 0x69,
  F1 = 0x70,
  F2 = 0x71,
  F3 = 0x72,
  F4 = 0x73,
  F5 = 0x74,
  F6 = 0x75,
  F7 = 0x76,
  F8 = 0x77,
  F9 = 0x78,
  F10 = 0x79,
  F11 = 0x7a,
  F12 = 0x7b,
}
