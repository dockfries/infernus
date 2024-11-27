import { Player, Vehicle } from "@infernus/core";
import { SelStatEnum } from "../enums";
import { I_OBJ_RATE, I_OBJECT, P_CAMERA_D, CUR_VEHICLE } from "../interfaces";

export const DEBUG_VERSION = "0.5d";

export const COLOR_RED = 0xff4040ff;
export const COLOR_GREEN = 0x40ff40ff;
export const COLOR_BLUE = 0x4040ffff;

export const COLOR_CYAN = 0x40ffffff;
export const COLOR_PINK = 0xff40ffff;
export const COLOR_YELLOW = 0xffff40ff;

export const COLOR_WHITE = 0xffffffff;
export const COLOR_BLACK = 0x000000ff;
export const COLOR_NONE = 0x00000000;

export const MIN_SKIN_ID = 0;
export const MAX_SKIN_ID = 299;

export const MIN_VEHI_ID = 400;
export const MAX_VEHI_ID = 611;

export const MIN_TIME_ID = 0;
export const MAX_TIME_ID = 23;

export const MIN_WEAT_ID = 0;
export const MAX_WEAT_ID = 45;

export const MIN_OBJE_ID = 615;
export const MAX_OBJE_ID = 13563;

export const DEFAULT_GRA = 0.008;

export const VEHI_DIS = 5.0;
export const OBJE_DIS = 10.0;

export const CMODE_A = 0;
export const CMODE_B = 1;

export const O_MODE_SELECTOR = 0;
export const O_MODE_MOVER = 1;
export const O_MODE_ROTATOR = 2;

export const PI = Math.PI;

export const CAMERA_TIME = 40;

export const aSelNames = [
  // Menu selection names
  "SkinSelect",
  "VehicleSelect",
  "WeatherSelect",
  "CameraSelect",
  "ObjectSelect",
];

export const aWeaponNames = [
  "Unarmed (Fist)", // 0
  "Brass Knuckles", // 1
  "Golf Club", // 2
  "Night Stick", // 3
  "Knife", // 4
  "Baseball Bat", // 5
  "Shovel", // 6
  "Pool Cue", // 7
  "Katana", // 8
  "Chainsaw", // 9
  "Purple Dildo", // 10
  "Big White Vibrator", // 11
  "Medium White Vibrator", // 12
  "Small White Vibrator", // 13
  "Flowers", // 14
  "Cane", // 15
  "Grenade", // 16
  "Teargas", // 17
  "Molotov", // 18
  " ", // 19
  " ", // 20
  " ", // 21
  "Colt 45", // 22
  "Colt 45 (Silenced)", // 23
  "Desert Eagle", // 24
  "Normal Shotgun", // 25
  "Sawnoff Shotgun", // 26
  "Combat Shotgun", // 27
  "Micro Uzi (Mac 10)", // 28
  "MP5", // 29
  "AK47", // 30
  "M4", // 31
  "Tec9", // 32
  "Country Rifle", // 33
  "Sniper Rifle", // 34
  "Rocket Launcher", // 35
  "Heat-Seeking Rocket Launcher", // 36
  "Flamethrower", // 37
  "Minigun", // 38
  "Satchel Charge", // 39
  "Detonator", // 40
  "Spray Can", // 41
  "Fire Extinguisher", // 42
  "Camera", // 43
  "Night Vision Goggles", // 44
  "Infrared Vision Goggles", // 45
  "Parachute", // 46
  "Fake Pistol", // 47
];

export const aVehicleNames = [
  // Vehicle Names - Betamaster
  "Landstalker",
  "Bravura",
  "Buffalo",
  "Linerunner",
  "Perrenial",
  "Sentinel",
  "Dumper",
  "Firetruck",
  "Trashmaster",
  "Stretch",
  "Manana",
  "Infernus",
  "Voodoo",
  "Pony",
  "Mule",
  "Cheetah",
  "Ambulance",
  "Leviathan",
  "Moonbeam",
  "Esperanto",
  "Taxi",
  "Washington",
  "Bobcat",
  "Mr Whoopee",
  "BF Injection",
  "Hunter",
  "Premier",
  "Enforcer",
  "Securicar",
  "Banshee",
  "Predator",
  "Bus",
  "Rhino",
  "Barracks",
  "Hotknife",
  "Trailer 1", //artict1
  "Previon",
  "Coach",
  "Cabbie",
  "Stallion",
  "Rumpo",
  "RC Bandit",
  "Romero",
  "Packer",
  "Monster",
  "Admiral",
  "Squalo",
  "Seasparrow",
  "Pizzaboy",
  "Tram",
  "Trailer 2", //artict2
  "Turismo",
  "Speeder",
  "Reefer",
  "Tropic",
  "Flatbed",
  "Yankee",
  "Caddy",
  "Solair",
  "Berkley's RC Van",
  "Skimmer",
  "PCJ-600",
  "Faggio",
  "Freeway",
  "RC Baron",
  "RC Raider",
  "Glendale",
  "Oceanic",
  "Sanchez",
  "Sparrow",
  "Patriot",
  "Quad",
  "Coastguard",
  "Dinghy",
  "Hermes",
  "Sabre",
  "Rustler",
  "ZR-350",
  "Walton",
  "Regina",
  "Comet",
  "BMX",
  "Burrito",
  "Camper",
  "Marquis",
  "Baggage",
  "Dozer",
  "Maverick",
  "News Chopper",
  "Rancher",
  "FBI Rancher",
  "Virgo",
  "Greenwood",
  "Jetmax",
  "Hotring",
  "Sandking",
  "Blista Compact",
  "Police Maverick",
  "Boxville",
  "Benson",
  "Mesa",
  "RC Goblin",
  "Hotring Racer A", //hotrina
  "Hotring Racer B", //hotrinb
  "Bloodring Banger",
  "Rancher",
  "Super GT",
  "Elegant",
  "Journey",
  "Bike",
  "Mountain Bike",
  "Beagle",
  "Cropdust",
  "Stunt",
  "Tanker", //petro
  "Roadtrain",
  "Nebula",
  "Majestic",
  "Buccaneer",
  "Shamal",
  "Hydra",
  "FCR-900",
  "NRG-500",
  "HPV1000",
  "Cement Truck",
  "Tow Truck",
  "Fortune",
  "Cadrona",
  "FBI Truck",
  "Willard",
  "Forklift",
  "Tractor",
  "Combine",
  "Feltzer",
  "Remington",
  "Slamvan",
  "Blade",
  "Freight",
  "Streak",
  "Vortex",
  "Vincent",
  "Bullet",
  "Clover",
  "Sadler",
  "Firetruck LA", //firela
  "Hustler",
  "Intruder",
  "Primo",
  "Cargobob",
  "Tampa",
  "Sunrise",
  "Merit",
  "Utility",
  "Nevada",
  "Yosemite",
  "Windsor",
  "Monster A", //monstera
  "Monster B", //monsterb
  "Uranus",
  "Jester",
  "Sultan",
  "Stratum",
  "Elegy",
  "Raindance",
  "RC Tiger",
  "Flash",
  "Tahoma",
  "Savanna",
  "Bandito",
  "Freight Flat", //freiflat
  "Streak Carriage", //streakc
  "Kart",
  "Mower",
  "Duneride",
  "Sweeper",
  "Broadway",
  "Tornado",
  "AT-400",
  "DFT-30",
  "Huntley",
  "Stafford",
  "BF-400",
  "Newsvan",
  "Tug",
  "Trailer 3", //petrotr
  "Emperor",
  "Wayfarer",
  "Euros",
  "Hotdog",
  "Club",
  "Freight Carriage", //freibox
  "Trailer 3", //artict3
  "Andromada",
  "Dodo",
  "RC Cam",
  "Launch",
  "Police Car (LSPD)",
  "Police Car (SFPD)",
  "Police Car (LVPD)",
  "Police Ranger",
  "Picador",
  "S.W.A.T. Van",
  "Alpha",
  "Phoenix",
  "Glendale",
  "Sadler",
  "Luggage Trailer A", //bagboxa
  "Luggage Trailer B", //bagboxb
  "Stair Trailer", //tugstair
  "Boxville",
  "Farm Plow", //farmtr1
  "Utility Trailer", //utiltr1
];

export const gPlayerStatus = new Map<Player, SelStatEnum>(); // Player Status
export const gPlayerTimers = new Map<Player, NodeJS.Timeout>(); // Player TimerID's for keyPresses
export const gWorldStatus: [number, number] = [12, 4]; // Time, Weather

export const curPlayerSkin = new Map<Player, number>(); //  {MIN_SKIN_ID, ...}; // Current Player Skin ID
export const curPlayerVehM = new Map<Player, number>(); //  {MIN_VEHI_ID, ...}; // Current Player Vehicle ID
export const curPlayerVehI = new Map<Player, number>(); //  {-1, ...};

export const pObjectRate = new Map<Player, I_OBJ_RATE>();
export const curPlayerObjM = new Map<Player, I_OBJECT>();
export const curPlayerObjI = new Map<Player, number>(); //  {-1, ...};
export const curPlayerCamD = new Map<Player, P_CAMERA_D>();
export const curServerVehP = new Map<Vehicle, CUR_VEHICLE>();
