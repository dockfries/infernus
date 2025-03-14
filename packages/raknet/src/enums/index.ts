export enum PacketRpcEventType {
  IncomingPacket,
  IncomingRpc,
  OutgoingPacket,
  OutgoingRpc,
  IncomingCustomRpc,

  NumberOfEventTypes,
}

export enum PacketRpcValueType {
  Int8,
  Int16,
  Int32,
  UInt8,
  UInt16,
  UInt32,
  Float,
  Bool,
  String,

  CInt8,
  CInt16,
  CInt32,
  CUInt8,
  CUInt16,
  CUInt32,
  CFloat,
  CBool,
  CString,

  Bits,
  Float3,
  Float4,
  Vector,
  NormQuat,

  String8,
  String32,

  IgnoreBits,
}

export enum PacketRpcPriority {
  System,
  High,
  Medium,
  Low,
}

export enum PacketRpcReliability {
  Unreliable = 6,
  UnreliableSequenced,
  Reliable,
  ReliableOrdered,
  ReliableSequenced,
}

export enum RakNetNatives {
  SendPacket,
  SendRpc,
  EmulateIncomingPacket,
  EmulateIncomingRpc,
  New,
  NewCopy,
  Delete,
  Reset,
  ResetReadPointer,
  ResetWritePointer,
  IgnoreBits,
  SetWriteOffset,
  GetWriteOffset,
  SetReadOffset,
  GetReadOffset,
  GetNumberOfBitsUsed,
  GetNumberOfBytesUsed,
  GetNumberOfUnreadBits,
  GetNumberOfBitsAllocated,
}

export enum PacketIdList {
  DriverSync = 200,
  RconCommand = 201,
  AimSync = 203,
  WeaponsUpdate = 204,
  StatsUpdate = 205,
  BulletSync = 206,
  OnFootSync = 207,
  MarkersSync = 208,
  UnoccupiedSync = 209,
  TrailerSync = 210,
  PassengerSync = 211,
  SpectatingSync = 212,

  // Raknet Internal
  InternalPing = 6,
  ConnectedPong = 9,
  RequestStaticData = 10,
  ConnectionRequest = 11,
  AuthKey = 12,
  RpcMapping = 17,
  DetectLostConnections = 23,
  NewIncomingConnection = 30,
  NoFreeIncomingConnections = 31,
  DisconnectionNotification = 32,
  ConnectionLost = 33,
  ConnectionRequestAccepted = 34,
  ConnectionAttemptFailed = 35,
  ConnectionBanned = 36,
  InvalidPassword = 37,
  ModifiedPacket = 38,
}

export enum RPCIdList {
  ShowActor = 171,
  HideActor = 172,
  ApplyActorAnimation = 173,
  ClearActorAnimation = 174,
  SetActorFacingAngle = 175,
  SetActorPos = 176,
  SetActorHealth = 178,
  SetPlayerAttachedObject = 113,
  ChatBubble = 59,
  GiveActorDamage = 177,
  DisableCheckpoint = 37,
  SetRaceCheckpoint = 38,
  DisableRaceCheckpoint = 39,
  SetCheckpoint = 107,
  ShowDialog = 61,
  AddGangZone = 108,
  GangZoneDestroy = 120,
  GangZoneFlash = 121,
  GangZoneStopFlash = 85,
  ShowGameText = 73,
  SetGravity = 146,
  SetMapIcon = 56,
  RemoveMapIcon = 144,
  InitMenu = 76,
  ShowMenu = 77,
  HideMenu = 78,
  ShowPlayerNameTag = 80,
  CreateObject = 44,
  SetPlayerObjectMaterialText = 84,
  AttachObjectToPlayer = 75,
  AttachCameraToObject = 81,
  EditAttachedObject = 116,
  EditObject = 117,
  EnterEditObject = 27,
  CancelEdit = 28,
  SetObjectPos = 45,
  SetObjectRotation = 46,
  DestroyObject = 47,
  MoveObject = 99,
  StopObject = 122,
  CreatePickup = 95,
  DestroyPickup = 63,
  ServerJoin = 137,
  ServerQuit = 138,
  InitGame = 139,
  ConnectionRejected = 130,
  UpdateScoresAndPings = 155,
  ClientJoin = 25,
  NpcJoin = 54,
  ClientCheck = 103,
  GameModeRestart = 40,
  ApplyPlayerAnimation = 86,
  ClearPlayerAnimation = 87,
  DeathBroadcast = 166,
  SetPlayerName = 11,
  SetPlayerPos = 12,
  SetPlayerPosFindZ = 13,
  SetPlayerFacingAngle = 19,
  SetPlayerSkillLevel = 34,
  SetPlayerSkin = 153,
  SetPlayerTime = 29,
  SetPlayerSpecialAction = 88,
  SetWeather = 152,
  SetWorldBounds = 17,
  SetPlayerVelocity = 90,
  TogglePlayerControllable = 15,
  TogglePlayerSpectating = 124,
  ToggleClock = 30,
  SetPlayerTeam = 69,
  PlaySound = 16,
  GivePlayerMoney = 18,
  ResetPlayerMoney = 20,
  ResetPlayerWeapons = 21,
  GivePlayerWeapon = 22,
  PlayAudioStream = 41,
  PlayCrimeReport = 112,
  StopAudioStream = 42,
  RemoveBuilding = 43,
  SetPlayerHealth = 14,
  SetPlayerArmour = 66,
  SetWeaponAmmo = 145,
  SetCameraBehind = 162,
  SetArmedWeapon = 67,
  WorldPlayerAdd = 32,
  WorldPlayerRemove = 163,
  InterpolateCamera = 82,
  CreateExplosion = 79,
  SendDeathMessage = 55,
  SendGameTimeUpdate = 60,
  SendClientMessage = 93,
  SetShopName = 33,
  SetPlayerDrunkLevel = 35,
  SetPlayerFightingStyle = 89,
  SetInterior = 156,
  SetPlayerColor = 72,
  ForceClassSelection = 74,
  ToggleWidescreen = 111,
  SetPlayerWantedLevel = 133,
  SetCameraPos = 157,
  SetCameraLookAt = 158,
  SetSpawnInfo = 68,
  RequestClass = 128,
  RequestSpawn = 129,
  SpectatePlayer = 126,
  SpectateVehicle = 127,
  EnableStuntBonus = 104,
  ToggleSelectTextDraw = 83,
  TextDrawSetString = 105,
  ShowTextDraw = 134,
  HideTextDraw = 135,
  PlayerEnterVehicle = 26,
  PlayerExitVehicle = 154,
  RemoveVehicleComponent = 57,
  AttachTrailerToVehicle = 148,
  DetachTrailerFromVehicle = 149,
  LinkVehicleToInterior = 65,
  PutPlayerInVehicle = 70,
  RemovePlayerFromVehicle = 71,
  UpdateVehicleDamageStatus = 106,
  SetVehicleTireStatus = 98,
  ScmEvent = 96,
  SetVehicleNumberPlate = 123,
  DisableVehicleCollisions = 167,
  SetVehicleHealth = 147,
  SetVehicleVelocity = 91,
  SetVehiclePos = 159,
  SetVehicleZAngle = 160,
  SetVehicleParams = 161,
  SetVehicleParamsEx = 24,
  WorldVehicleAdd = 164,
  WorldVehicleRemove = 165,
  Create3DTextLabel = 36,
  Delete3DTextLabel = 58,
  SetWorldTime = 94,
  ToggleCameraTarget = 170,
  EnterVehicle = PlayerEnterVehicle,
  ExitVehicle = PlayerExitVehicle,
  VehicleDamaged = UpdateVehicleDamageStatus,
  VehicleDestroyed = 136,
  SendSpawn = 52,
  ChatMessage = 101,
  InteriorChangeNotification = 118,
  DeathNotification = 53,
  SendCommand = 50,
  ClickPlayer = 23,
  DialogResponse = 62,
  ClientCheckResponse = ClientCheck,
  GiveTakeDamage = 115,
  MapMarker = 119,
  MenuSelect = 132,
  MenuQuit = 140,
  SelectTextDraw = ToggleSelectTextDraw,
  PickedUpPickup = 131,
  SelectObject = EnterEditObject,
  CameraTarget = 168,

  // 0.3DL
  SetPlayerVirtualWorld = 48,
  ModelInfo = 179,
  ModelFile = 183,
  SrcFinishedDownloading = 185,
  FinishedDownloading = 184,
  RequestDffFile = 181,
  RequestTxdFile = 182,
}

export enum InternalPacketIdList {
  INTERNAL_PING = 6,
  CONNECTED_PONG = 9,
  REQUEST_STATIC_DATA = 10,
  CONNECTION_REQUEST = 11,
  AUTH_KEY = 12,
  RPC_MAPPING = 17,
  DETECT_LOST_CONNECTIONS = 23,
  NEW_INCOMING_CONNECTION = 30,
  NO_FREE_INCOMING_CONNECTIONS = 31,
  DISCONNECTION_NOTIFICATION = 32,
  CONNECTION_LOST = 33,
  CONNECTION_REQUEST_ACCEPTED = 34,
  CONNECTION_ATTEMPT_FAILED = 35,
  CONNECTION_BANNED = 36,
  INVALID_PASSWORD = 37,
  MODIFIED_PACKET = 38,
  RECEIVED_STATIC_DATA = 41,
}
