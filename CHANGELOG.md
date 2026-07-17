## [0.14.6](https://github.com/dockfries/infernus/compare/v0.14.5...v0.14.6) (2026-07-17)

### ⚠ BREAKING CHANGES

- **raknet:** overhaul BitStream API — unify readValue/writeValue, drop polyfill

### Features

- **cef:** loadUrl, setEscapeMenuMode ([6e5e862](https://github.com/dockfries/infernus/commit/6e5e862b7d45e79e0573fe07ffa0bb0b28388672))
- **cef:** setPlayerListMode, onDownloadProgress ([f90f6e1](https://github.com/dockfries/infernus/commit/f90f6e16adc3cdef6d81d83dc4de72c67fa3bded))
- **ompp:** create a wrapper for ompp ([422ff55](https://github.com/dockfries/infernus/commit/422ff55f8351112f279abc14cc9248b5f33a392f))
- **raknet:** overhaul BitStream API — unify readValue/writeValue, drop polyfill ([859639d](https://github.com/dockfries/infernus/commit/859639d474e64c85f0fcc1e2355f259e647a66aa))
- **root:** upgrade pnpm 11 ([28d2214](https://github.com/dockfries/infernus/commit/28d22140e65d156112c7cd842cc0fe7160b3fe2c))
- **s-art:** create a wrapper for s-art ([e1cf69b](https://github.com/dockfries/infernus/commit/e1cf69b0ea9dd89c31a293caa1f67d62fc49f0d8))
- **samp-voice:** add natives ([2ddbaee](https://github.com/dockfries/infernus/commit/2ddbaee75cb4ccdca22802ae8ec2d9c3e0bc5e4c))
- **veh-para:** add a wrapper for veh-para ([885ad57](https://github.com/dockfries/infernus/commit/885ad573290b033258820c1d04ca8ac8a7c5c80f))
- **weapon-config:** sync 359 ([d5a72cd](https://github.com/dockfries/infernus/commit/d5a72cd61ce449c74171f992aaafd4f15d813f2e))
- **weapon-config:** sync 359, 362 ([d71e45f](https://github.com/dockfries/infernus/commit/d71e45f49165849720b5cff98f984228d75557c8))
- **weapon-config:** sync 360, 361 ([b6f7224](https://github.com/dockfries/infernus/commit/b6f72247ef0c27cd0ecf4de1eaa2666fe488981f))
- **weapon-config:** sync 364 ([6267eb3](https://github.com/dockfries/infernus/commit/6267eb3fc6b037d04990c3e8261f75c6f33c16e5))

### Bug Fixes

- **ci:** pnpm-lock fix ([09bed60](https://github.com/dockfries/infernus/commit/09bed60a2b93df3d9424a07b1af6b19a2c417e86))
- **colandreas, create-app:** export and import ([0f8f00f](https://github.com/dockfries/infernus/commit/0f8f00f25f64e315707933b7df750b09d363291d))
- **core:** if exit is triggered first, stop init ([2a82f4a](https://github.com/dockfries/infernus/commit/2a82f4a9d113729a7f8394a0d0761080db8fb214))
- **core:** maybe check again afterEach ([6999f22](https://github.com/dockfries/infernus/commit/6999f220305f06f3a4feb771e80fd08a6693a17b))
- **raknet:** correct string read/write size handling ([986a411](https://github.com/dockfries/infernus/commit/986a4112e9c08fa47c4c5c441318eb8415695b3e))
- **s-art:** export exceptions ([74e65fa](https://github.com/dockfries/infernus/commit/74e65fa144d02b57896c7b5b62855218ad4f13a1))
- **samp-voice:** checkSpeaker ([7e836ec](https://github.com/dockfries/infernus/commit/7e836ec0e3a4f920bf63d94f99fbe06d3af65361))
- **skills:** correct SKILL docs to match actual API code ([b57da9c](https://github.com/dockfries/infernus/commit/b57da9c5318e6d84a574ed119b9c4bcd60fa2652))

## [0.14.5](https://github.com/dockfries/infernus/compare/v0.14.4...v0.14.5) (2026-05-25)

### ⚠ BREAKING CHANGES

- **mapandreas:** init is now async and throws on failure instead of
  returning a boolean. unload is now synchronous and returns void.
  NoBuffer mode is treated as Full, Medium as Minimal.
- **gps,map-loader:** MapLoaderError renamed to MapLoaderException.
- **cef:** untested emit, on
- **cef:** untested, but used if available for cef next

### Features

- **cef:** untested emit, on ([157e577](https://github.com/dockfries/infernus/commit/157e577888a2120f94c33c838d93d460251f2445))
- **cef:** untested, but used if available for cef next ([60bd6df](https://github.com/dockfries/infernus/commit/60bd6dffbeedc944977575cf621bdc676101e13d))
- **core:** manage model download ([3ce496d](https://github.com/dockfries/infernus/commit/3ce496d02f0c5e55dbccb60a3478c9a1d6706993))
- **mapandreas:** rewrite as pure TypeScript, remove native plugin dependency ([dbf8ce4](https://github.com/dockfries/infernus/commit/dbf8ce4fca89805e5d895e535589f835efde19d1))
- **skills:** add omp-infernus-core-use skill (untested) ([cdb18e8](https://github.com/dockfries/infernus/commit/cdb18e82c3902d34aed240ea5d96719103cf2eed))
- **weapon-config:** additional bodyPart check ([53186e2](https://github.com/dockfries/infernus/commit/53186e24de00221ce379b94c0e0046cc88ecafe6))

### Bug Fixes

- **colandreas:** clear CA_Objects length ([e2a8f61](https://github.com/dockfries/infernus/commit/e2a8f614d5977a0b098ae7b27aeaa483825976e8))
- **core:** add disconnected flag to Player, remove stopWhenDisconnect ([353cc88](https://github.com/dockfries/infernus/commit/353cc882bc65b67309d0042d8b30d409b134276b))
- **core:** clamp color channels, fix hex validation, use samp.logprint ([59bf775](https://github.com/dockfries/infernus/commit/59bf77571270cbbcbb986d88b9511e113c56c7c6))
- **core:** dialog showingIds leak and filterscript race condition ([b088828](https://github.com/dockfries/infernus/commit/b08882834a245369806ff4153fea7f282f48581e))
- **core:** guard static isConnected against stale pool entries ([4ed6abc](https://github.com/dockfries/infernus/commit/4ed6abc190c3baef697ac8007b8a11c30177d95a))
- **gps,map-loader:** export Exception classes from public API ([8e77328](https://github.com/dockfries/infernus/commit/8e77328abc6ae907b649a55a680e66b96eae27f2))
- **multiple:** correct various bugs across multiple packages ([544ea4d](https://github.com/dockfries/infernus/commit/544ea4d8697a95fdff5a589f8ab61ff3ad551024))
- **nex-ac:** sync with original nex-ac.inc v1.9.68 ([046d5c4](https://github.com/dockfries/infernus/commit/046d5c463828e5b8e4faf99ce48c0fb522ad69cc))
- **skills:** correct nex-ac upstream URL ([6fc6866](https://github.com/dockfries/infernus/commit/6fc68660f2390218ff49d3aab5f03200c01d938b))
- **weapon-config:** custom DL skins, damage from NPCs ([134b492](https://github.com/dockfries/infernus/commit/134b49242bdc21ac5cb9b0697af807574950db67))
- **weapon-config:** update Health Bar when setting max health/armor ([f3427b3](https://github.com/dockfries/infernus/commit/f3427b359d2c808528b0c3fd8bc06f1c57637dfa))

### Reverts

- **core:** manage model download ([7d0bbf9](https://github.com/dockfries/infernus/commit/7d0bbf99b8e4060fc70ddbaec0f9e9ece53f6c10))
- **weapon-config:** wtf s_FakeQuat == s_FakeQuat and angle != angle? ([c6f1d3a](https://github.com/dockfries/infernus/commit/c6f1d3ac0cea843e9eeb9f7f842d17615a9ba7d7))

## [0.14.4](https://github.com/dockfries/infernus/compare/v0.14.3...v0.14.4) (2026-01-30)

### Bug Fixes

- **core:** spreadErr CommandErrors.RECEIVED_THROW ([e32a9e5](https://github.com/dockfries/infernus/commit/e32a9e5dc5ca0df4cddcfce5238394f577a30ac5))
- **core:** types in .d.ts ([055a2ea](https://github.com/dockfries/infernus/commit/055a2ea6963c06b229f29dcc8b96d12c54131798))

## [0.14.3](https://github.com/dockfries/infernus/compare/v0.14.2...v0.14.3) (2026-01-28)

### ⚠ BREAKING CHANGES

- **core:** revert player entity checkPoint, isLeavingSpectatorMode

### Features

- **core:** add npc, player natives ([f7cf6ac](https://github.com/dockfries/infernus/commit/f7cf6ac4aa4e6280484cebf2ecbc749ed7deb6a8))
- **core:** revert player entity checkPoint, isLeavingSpectatorMode ([d8cabf1](https://github.com/dockfries/infernus/commit/d8cabf17394b34771cf0a113f54c3ba59ef322c7))
- **weapon-config:** update takeDamage 347 ([28337a2](https://github.com/dockfries/infernus/commit/28337a2cf28d068d07fb968b3f52177023a8e9fb))

### Bug Fixes

- **build:** rolldown dts no export failed to emit declaration file ([d10d2df](https://github.com/dockfries/infernus/commit/d10d2df4b12c7da67c758a9dcbb8c511e96713a3))
- **core:** inject for three getMethods ([a6a63dd](https://github.com/dockfries/infernus/commit/a6a63dd8158dcedadf0b8a8a3ce8e8215983e1ad))

### Reverts

- **query:** iconv ([a2c1735](https://github.com/dockfries/infernus/commit/a2c173553b32b93b60b3dca5c4aa7ac47322ed2c))

## [0.14.2](https://github.com/dockfries/infernus/compare/v0.14.1...v0.14.2) (2025-12-31)

### Features

- **create-app:** only update cache when dep version equal ([d6f6e07](https://github.com/dockfries/infernus/commit/d6f6e072e5a081aaf50ded59fcc4959b08a07e0f))
- **progress:** maybe we can hook destroy textdraw ([9d726ac](https://github.com/dockfries/infernus/commit/9d726ac02122879cdcca3db2a55860cedd0568d8))

### Bug Fixes

- **core:** match cmdText maybe null ([89bf9c3](https://github.com/dockfries/infernus/commit/89bf9c36c27b4484c47e244dfc683a3a7379a3a5))
- **core:** streamer pickup streamInOut player type ([48f176e](https://github.com/dockfries/infernus/commit/48f176ed7840f0affaea37ea0a9ccb4e15e21094))
- **weapon-config:** use try catch for new TextDraw ([ee563a2](https://github.com/dockfries/infernus/commit/ee563a2b7f7f4c97a2892cc420db04244109846a))

## [0.14.1](https://github.com/dockfries/infernus/compare/v0.14.0...v0.14.1) (2025-12-19)

### Features

- **core:** a couple of native types, missing natives, default params ([0d810d0](https://github.com/dockfries/infernus/commit/0d810d0f0228b58ffed8db61540ed4a1ba7168cc))

## [0.14.0](https://github.com/dockfries/infernus/compare/v0.13.4...v0.14.0) (2025-12-17)

### ⚠ BREAKING CHANGES

- **core, nex-ac, weapon-config:** pickup add per player, change some throw message

### Features

- **core, nex-ac, weapon-config:** pickup add per player, change some throw message ([86a011c](https://github.com/dockfries/infernus/commit/86a011c6fa61950f4e25dcf02c915859521dc31c))
- **core:** add npc angle to pos natives ([9d9e103](https://github.com/dockfries/infernus/commit/9d9e103c02d53a045b67a7035406c688eddcd593))
- **core:** moveType to auto by default ([ce75809](https://github.com/dockfries/infernus/commit/ce75809365375d3c0951084c1d53893141624d74))

## [0.13.4](https://github.com/dockfries/infernus/compare/v0.13.3...v0.13.4) (2025-12-01)

### Features

- **core:** npc getPosMovingTo, getCustomSkin ([5f75d40](https://github.com/dockfries/infernus/commit/5f75d404d252bdb51e64eac76083bfb3d9e241cf))
- **progress:** init ([7094299](https://github.com/dockfries/infernus/commit/709429997cb9466ccb489c1dbcecd438c21ef25c))

### Bug Fixes

- **core:** remove unused player gangzone destroy ([938569a](https://github.com/dockfries/infernus/commit/938569a81256f57d618c07702535ea46ae3a4260))

## [0.13.3](https://github.com/dockfries/infernus/compare/v0.13.2...v0.13.3) (2025-11-21)

### Features

- **core:** some origin playerPool need destroy onDisconnect ([de3a6fe](https://github.com/dockfries/infernus/commit/de3a6fe90aca8e32220dae831824388f5a3aded2))

### Bug Fixes

- **core:** getAnimationName ([fde73fa](https://github.com/dockfries/infernus/commit/fde73fa3d34da833de5d16840e66cb89e753f469))
- **core:** getPlayerCameraTarget, some getMethods, id constructor check invalid ([9ce3532](https://github.com/dockfries/infernus/commit/9ce3532e8a54266538511fec73959c4b8faba07a))
- **core:** objectMp edit player params ([6d23ea9](https://github.com/dockfries/infernus/commit/6d23ea91ba6f9f904223d675686f2bd7caf9e35a))

## [0.13.2](https://github.com/dockfries/infernus/compare/v0.13.1...v0.13.2) (2025-11-06)

### Features

- **fs:** npc should use create method ([f1cca06](https://github.com/dockfries/infernus/commit/f1cca06894f2eb2999d80d35197f900201a53eee))

### Bug Fixes

- **build:** update build configuration and export types ([207b40f](https://github.com/dockfries/infernus/commit/207b40fc95da0a81d5e281ecc726c046d900319a))

## [0.13.1](https://github.com/dockfries/infernus/compare/v0.13.0...v0.13.1) (2025-11-06)

### Features

- **core, filterscript:** add charset to menu ([5f78d48](https://github.com/dockfries/infernus/commit/5f78d48c856234386dfd9250c29232e728b50d2f))
- **core, streamer, nex-ac, weapon-config:** change **inject** methods ([e13443f](https://github.com/dockfries/infernus/commit/e13443f9f57689bf4ffde6e2ac1fc3f5bf87c3e2))
- **core:** improve error handling and afterEach execution in bus middleware ([28d683e](https://github.com/dockfries/infernus/commit/28d683ee866d3de736e54f9fdd229fac679e841a))
- **core:** make **inject** methods lowercase and shorthand ([a856a68](https://github.com/dockfries/infernus/commit/a856a68723a017df917090b20697e5d4145f2d3f))
- **core:** player, npc **inject** ([8ce007e](https://github.com/dockfries/infernus/commit/8ce007ea6f3d7307aaa30c56fbb4ebcb05de234e))
- **distance:** add actor, object functions ([e668837](https://github.com/dockfries/infernus/commit/e668837c8d7066823496a0500fcbc50b25ee6d68))
- **nex-ac:** 1.9.67 ([575649a](https://github.com/dockfries/infernus/commit/575649acd56ac147d369db7a3f096c6ba01867bc))
- **nex-ac:** initialize arrays with proper sizes in ACInfoStruct ([623f595](https://github.com/dockfries/infernus/commit/623f59547946a71c3c27dd945ac446830cff7219))

### Bug Fixes

- **core:** streamer getPlayerCameraTarget Streamer.INVALID_ID ([ac3ca61](https://github.com/dockfries/infernus/commit/ac3ca618a2550608efd39e1d335c3f8d4ed5b16f))
- **nex-ac:** rename ru locale file to ru-RU ([5041ea8](https://github.com/dockfries/infernus/commit/5041ea895c1d4903a32c7e5852168668bf9924d5))

## [0.13.0](https://github.com/dockfries/infernus/compare/v0.12.7...v0.13.0) (2025-10-31)

### ⚠ BREAKING CHANGES

- **core:** add checkpoint and raceCp

### Features

- **core, fs, streamer:** add TextLabel component, rename Los to LOS ([a99e7f3](https://github.com/dockfries/infernus/commit/a99e7f3f752d397bdabaa547639a3512b6fd9b7e))
- **core, nex-ac:** pickup inject ([c1d66b7](https://github.com/dockfries/infernus/commit/c1d66b7ade8b7d397a7bdc7d9361c17699a9cd80))
- **core:** add Actor entity class and update native wrapper ([855fdeb](https://github.com/dockfries/infernus/commit/855fdeb303a71ce86dcde34b3e570de14b9dc4dd))
- **core:** add checkpoint and raceCp ([e0dbf45](https://github.com/dockfries/infernus/commit/e0dbf454091197d6dc47814299c0ef07e9fa4511))
- **core:** add origin object/playerObject in same ObjectMp ([5577b43](https://github.com/dockfries/infernus/commit/5577b435f3185d8ef5dcdc8a19770432db6584da))
- **core:** add Pickup entity and improve entity constructors ([8f081f3](https://github.com/dockfries/infernus/commit/8f081f309b9020f73438984fb52a615a59e13321))
- **core:** add textdraw isPlayer ([4d7e619](https://github.com/dockfries/infernus/commit/4d7e61907503cdc969346d5cb83ce035021e109f))
- **core:** improve object attachment and return type consistency ([7a8cd43](https://github.com/dockfries/infernus/commit/7a8cd43c34189f22bc4ec29eb1a93e08b98f55da))
- **core:** make object drawDistance optional with default value ([62e2cb4](https://github.com/dockfries/infernus/commit/62e2cb40d9bc0b6706abb3acbef0b40868c55114))
- **core:** more **inject** methods ([f12efea](https://github.com/dockfries/infernus/commit/f12efea964d925c68fdf88245f89f0536ec02136))
- **core:** more LimitsEnum ([154f605](https://github.com/dockfries/infernus/commit/154f6057a8aaed74d7e7876aa4d563e05974aff0))
- **core:** npc getPlayer ([d76729c](https://github.com/dockfries/infernus/commit/d76729c73a813e649c1933005c43bed41d6bfde2))
- **core:** npc/player surfing object ([1ce048b](https://github.com/dockfries/infernus/commit/1ce048b55432b1db18f57350b9eb004d5591939f))
- **player:** add player map icon api ([0af89c8](https://github.com/dockfries/infernus/commit/0af89c85b547f2cbdf24e8dc81259be9e4db901c))
- **samp-voice:** try port samp-voice ([1aa9ffc](https://github.com/dockfries/infernus/commit/1aa9ffcb1951135b7136dcf392a43ee2087cfc89))
- **weapon-config:** use origin checkpoint logic replace streamer, add pickup event ([d2ef2b2](https://github.com/dockfries/infernus/commit/d2ef2b26633bfc05f9851339f8a4ee41f4e5dd4f))

### Bug Fixes

- **core:** gangzone perPlayerPool manage ([dbc1579](https://github.com/dockfries/infernus/commit/dbc15794fa020624cb1e11a71fa54072b27dbd34))
- **core:** textDraw perPlayerPool manage ([bd9f149](https://github.com/dockfries/infernus/commit/bd9f149690ecfbed6dfe41ccfaa0bbfb135ca6f1))

## [0.12.7](https://github.com/dockfries/infernus/compare/v0.12.6...v0.12.7) (2025-10-25)

### Features

- **core:** npc new natives, entity invalid enum ([05d0981](https://github.com/dockfries/infernus/commit/05d0981f9882149990686d8f9303af5ef6ff5082))

## [0.12.6](https://github.com/dockfries/infernus/compare/v0.12.5...v0.12.6) (2025-10-19)

### Bug Fixes

- **build:** rollup build dts includeExternal streamer ([713ab8f](https://github.com/dockfries/infernus/commit/713ab8feff62a5923942e197ed383a01045cb279))
- **build:** script build-all raknet should be fixed ([b836927](https://github.com/dockfries/infernus/commit/b836927967dbe3b379fe2e1158e7637d5880e40b))
- **core:** streamer area missing priority ([326518a](https://github.com/dockfries/infernus/commit/326518a65ff3763751f272f69c3e88e8cf76c7a6))
- **weapon-config:** sync upstream 339~341 pr ([1b7d586](https://github.com/dockfries/infernus/commit/1b7d586b84c53d8ab278a0c688c704f9a2eecb19))

## [0.12.5](https://github.com/dockfries/infernus/compare/v0.12.4...v0.12.5) (2025-10-15)

### Features

- **core:** add isUseScriptLoaded, support generic speculation load arguments ([e8864b8](https://github.com/dockfries/infernus/commit/e8864b8c4f06e6d3fd2bbbd10f074656abc52298))
- **core:** vehicle getRotation ([428f2f6](https://github.com/dockfries/infernus/commit/428f2f6e36641c108dada72287c142586c2f996b))

## [0.12.4](https://github.com/dockfries/infernus/compare/v0.12.3...v0.12.4) (2025-10-13)

### Features

- **core:** npc gamemodeexit clear skip ([eb53aa3](https://github.com/dockfries/infernus/commit/eb53aa32509f41b2755cf45470c5ab9fb57a56ef))

### Bug Fixes

- **core:** maybe compat sampgdk and npc component ([5651196](https://github.com/dockfries/infernus/commit/5651196cee51bc768c8613640bcbd93e64fa8716))
- **core:** npc spawn, respawn event name case ([d6d862d](https://github.com/dockfries/infernus/commit/d6d862dd7dbaaebd5d95f103a28989c3ad38c5bb))
- **fs:** gl_npcs, startPlayback is fixed path `npcmodes/records` ([7d3ef29](https://github.com/dockfries/infernus/commit/7d3ef29cf65aeb7a2364a3ccd6c886245553918c))

## [0.12.3](https://github.com/dockfries/infernus/compare/v0.12.2...v0.12.3) (2025-10-09)

### Features

- **streamer:** add constants module and refactor magic values ([f0442fb](https://github.com/dockfries/infernus/commit/f0442fb6a9f6ee6dd694f22bd8ef49a50c31db89))

### Bug Fixes

- **build:** `SIGINT` kill ([5daa071](https://github.com/dockfries/infernus/commit/5daa0719b084782b455f1e622aa5ddb083e74ca4))
- **core:** correct logical errors and resource handling in core controllers ([213ccaf](https://github.com/dockfries/infernus/commit/213ccaf7ecc6b8951a767538d9ee1ec5bc79f7de))
- **core:** correct typos and parameter naming in core entities ([e67f051](https://github.com/dockfries/infernus/commit/e67f051d01c7b9a703fffd4545f6457784bd435a))
- **core:** missing events identifier, some type ([b6260bd](https://github.com/dockfries/infernus/commit/b6260bd842ac6642b27406d85d1a2386a348e1f5))
- **raknet:** improve type safety and error handling in BitStream ([0311a5d](https://github.com/dockfries/infernus/commit/0311a5d5c52748f8a288d91845a6e369d0c279ac))

## [0.12.2](https://github.com/dockfries/infernus/compare/v0.12.1...v0.12.2) (2025-10-07)

### Features

- **core:** npc max_npcs, invalid id, types ([00939f5](https://github.com/dockfries/infernus/commit/00939f56ada0e829832e1e0a64324a636e36201d))
- **core:** npc node,path,record class, remove deprecate funcs ([d02da25](https://github.com/dockfries/infernus/commit/d02da253cbc4c7028262573309119fa2fe05836b))

### Bug Fixes

- **core:** iconv-lite import esm ([aa750ce](https://github.com/dockfries/infernus/commit/aa750ce815c029eeec969bcbe8cafda555c40ca3))
- **core:** npc id type ([0720271](https://github.com/dockfries/infernus/commit/0720271b8d93cb0809fc828f289634ef02c36ace))
- **raknet:** some read macros return type ([f8cca22](https://github.com/dockfries/infernus/commit/f8cca22575b10f202f6b339fcd04f154348f6a95))

## [0.12.1](https://github.com/dockfries/infernus/compare/v0.12.0...v0.12.1) (2025-09-04)

### Features

- **core:** add onNpcFinishMovePathPoint ([fe38204](https://github.com/dockfries/infernus/commit/fe38204915bb6c2097ad27ecc5907937ab4d2e40))
- **core:** npc apis ([8af6a88](https://github.com/dockfries/infernus/commit/8af6a88606b0c3895488d95fd06c2466350934dd))
- **core:** npc apis ([1c1b799](https://github.com/dockfries/infernus/commit/1c1b7990aaaf46e6b783e47b121157a40ff14e9e))
- **core:** npc apis ([d1d961e](https://github.com/dockfries/infernus/commit/d1d961e6e7b4c0e38e79010177e2eb956cd64680))
- **core:** npc create maybe put in player pool before onPlayerConnect? ([4f72f2d](https://github.com/dockfries/infernus/commit/4f72f2d8b03cc50f0029570b3493a7d469015ade))

### Bug Fixes

- **weapon-config:** fix recursion when setting health to NPC ([e6c609d](https://github.com/dockfries/infernus/commit/e6c609d5390dcc126753625a8fdddb6e707e5e35))

## [0.12.0](https://github.com/dockfries/infernus/compare/v0.11.15...v0.12.0) (2025-08-10)

### ⚠ BREAKING CHANGES

- **core:** get methods should return ret, so break changes
- **nex-ac:** result rename to ret

### Features

- **colandreas, map-loader:** maybe can check colandreas this way? ([2f5196d](https://github.com/dockfries/infernus/commit/2f5196d1625327c1a035f9e42a4508b1cd3f66b0))
- **colandreas:** global defined ([1156059](https://github.com/dockfries/infernus/commit/115605956dfe314a3da5d95f179ae23861128a47))
- **core:** get methods should return ret, so break changes ([0ece293](https://github.com/dockfries/infernus/commit/0ece2936de3fe69e856bf7f835c5197d0210fc73))
- **distance:** init ([884b920](https://github.com/dockfries/infernus/commit/884b920a020a2b1900c96606cefa6c2f3d2e3c62))
- **drift-detection:** init ([edd4cf4](https://github.com/dockfries/infernus/commit/edd4cf4abbc3df869c26d6ecf2903f875a7ca166))
- **nex-ac:** result rename to ret ([1fa7fc7](https://github.com/dockfries/infernus/commit/1fa7fc7de26561437a5b406078d4650043ea7056))
- **raknet:** global defined ([ff2ff20](https://github.com/dockfries/infernus/commit/ff2ff2093934ba187bdca34b0cd2f7baa49004b8))

### Bug Fixes

- **core, colandreas, fs, gps:** getPos/facingAngle ([3fed03a](https://github.com/dockfries/infernus/commit/3fed03a3a06db9675b4b2d9a70d4f78b7b51bea0))
- **core, fs, nex-ac:** getMethods ([9fd4393](https://github.com/dockfries/infernus/commit/9fd4393658371b7c6b5fb4126de43538730d7c9d))
- **core, fs:** getMethods ([d9ae995](https://github.com/dockfries/infernus/commit/d9ae995c4df4f559c939ffc1f1e3fa0d361e0f45))

## [0.11.15](https://github.com/dockfries/infernus/compare/v0.11.14...v0.11.15) (2025-08-03)

### Features

- **core:** npc 1106 ([eda67c7](https://github.com/dockfries/infernus/commit/eda67c757af3da058cede34d91adb1b6c65a8423))

### Bug Fixes

- **core:** npc id public ([1360f91](https://github.com/dockfries/infernus/commit/1360f914b0fd61c870d7bc1152d6c97e81f03dd5))

## [0.11.14](https://github.com/dockfries/infernus/compare/v0.11.13...v0.11.14) (2025-07-22)

### Features

- **map-loader:** init ([04d390c](https://github.com/dockfries/infernus/commit/04d390cc156b4aae5bbc27e4b23a599342a5f07e))
- **qrcode:** simple qrcode ([375ad38](https://github.com/dockfries/infernus/commit/375ad3897a2d74a0440356892fe6e1ee59074bcf))

### Bug Fixes

- **create-app:** tag_name error ([ba37dbe](https://github.com/dockfries/infernus/commit/ba37dbeeb64e4c3bd121906d49a4830266bb6b93))
- **weapon-config:** 329, 331 ([801e7ef](https://github.com/dockfries/infernus/commit/801e7ef032d81ef6d39fa2caadd2c07df2c43b28))

## [0.11.13](https://github.com/dockfries/infernus/compare/v0.11.12...v0.11.13) (2025-06-08)

### Features

- **create-app:** manually select open.mp asset (drawback is global cache like other deps) ([e55a8dd](https://github.com/dockfries/infernus/commit/e55a8dd8f26fe0487eb45ddd24966a8083cc5625))

### Bug Fixes

- **(create-app:** assetsByEnv.length ([e79baf1](https://github.com/dockfries/infernus/commit/e79baf1e40a58937664a7861df846e6ec7d27f54))
- **core, weapon-config:** idk, maybe we should unshift it, because special order? ([8b6f9cf](https://github.com/dockfries/infernus/commit/8b6f9cf67a68a1e5029746785a2753d3bea56fb1))
- **query:** udp not require too long timeouts because it makes no sense ([0f0d84f](https://github.com/dockfries/infernus/commit/0f0d84f8c6662a5300ee4e259278d58e892f30e7))

## [0.11.12](https://github.com/dockfries/infernus/compare/v0.11.11...v0.11.12) (2025-05-15)

### Bug Fixes

- **weapon-config:** some issues ([527d260](https://github.com/dockfries/infernus/commit/527d2601b5f7ecccddd4cbeb84c7bfc592971b84))

## [0.11.11](https://github.com/dockfries/infernus/compare/v0.11.10...v0.11.11) (2025-05-12)

### Features

- **core:** onCommandError getSuggestion ([f155e95](https://github.com/dockfries/infernus/commit/f155e95330473262134af2b0d9f4ff8411999ee6))
- **nex-ac:** try port, but there must be bugs ([3ecdb72](https://github.com/dockfries/infernus/commit/3ecdb7260e2566fe1a92fa7e23404c675b3fe660))
- **weapon-config:** try port, but there are bugs ([c0fcf77](https://github.com/dockfries/infernus/commit/c0fcf773c567b38c720e3cf16c2107138670c9fd))

### Bug Fixes

- **core:** getSurfing should no need params ([25b55eb](https://github.com/dockfries/infernus/commit/25b55ebb7826efa8186009ac8b9cf99d1165355c))
- **nex-ac:** maybe else ([5ff8a91](https://github.com/dockfries/infernus/commit/5ff8a91312a0c368e28bcc454e56210a6d9bbfd0))
- **nex-ac:** maybe if ([d2bd7e8](https://github.com/dockfries/infernus/commit/d2bd7e8979db6a28a1e4192a97e8f40038bb903b))

## [0.11.10](https://github.com/dockfries/infernus/compare/v0.11.9...v0.11.10) (2025-04-21)

### Features

- **core:** npc natives ([98a02d4](https://github.com/dockfries/infernus/commit/98a02d4d27ded13d82e95d040352c91c1b1a4045))
- **e-selection:** try port eSelection ([29fcc1b](https://github.com/dockfries/infernus/commit/29fcc1b67975d708d41d56d2e00e495622ea7007))
- **types:** minimized samp-node api types for infernus ([32c82c6](https://github.com/dockfries/infernus/commit/32c82c6165893e6ae6ffbe58f45bff301be32b91))

### Bug Fixes

- **core:** playerTextDraw/GangZone auto destroy valid check ([2065a19](https://github.com/dockfries/infernus/commit/2065a19e688fb5fa498fd4642c30beaf54791242))
- **core:** setPreviewVehColors type, objAlign enum typo, player innerProps ([f9fab4b](https://github.com/dockfries/infernus/commit/f9fab4b5eb1039c07629699e24c75e595c6efe85))
- **core:** vehicle getDriver should no need players params ([3eb0b2b](https://github.com/dockfries/infernus/commit/3eb0b2b641b60c3785b1c083df4634aee5105061))
- **query:** use chardetng when run out of samp-node ([495f502](https://github.com/dockfries/infernus/commit/495f5028c9dd776896ae159230a8ba638389f6e4))

## [0.11.9](https://github.com/dockfries/infernus/compare/v0.11.8...v0.11.9) (2025-03-17)

### Features

- **core:** experimental hook natives [#50](https://github.com/dockfries/infernus/issues/50) ([9de59d7](https://github.com/dockfries/infernus/commit/9de59d741904ba14decbacb56572b39cd912429d))
- **query:** use chardetng when run out of samp-node ([ef39c86](https://github.com/dockfries/infernus/commit/ef39c869cf56b499d1e836938149b871b9e7b22f))

### Bug Fixes

- **core:** `player.setChatBubble` charset [#49](https://github.com/dockfries/infernus/issues/49) ([b162188](https://github.com/dockfries/infernus/commit/b162188f0414ba09bab8f32ba6618a857d52b11f))

## [0.11.8](https://github.com/dockfries/infernus/compare/v0.11.7...v0.11.8) (2025-02-27)

### Features

- **core:** attachTo syntax sugar for `Dynamic3DTextLabel` [#48](https://github.com/dockfries/infernus/issues/48) ([62aad79](https://github.com/dockfries/infernus/commit/62aad79f4925972baedc70a3f4fddaa7c80179aa))
- **query:** simple API for send SA-MP queries ([11de555](https://github.com/dockfries/infernus/commit/11de55529dc705009cba9fb398a041f0eb5ded1d))
- **raknet:** update internal packet list ([74639bf](https://github.com/dockfries/infernus/commit/74639bf8c0c144f00a982e28a09298d159cd2757))
- **raknet:** update rpc list ([8d07d50](https://github.com/dockfries/infernus/commit/8d07d50974b5d3eab9ecc7613492a6bd640329a7))
- **rec:** file format converter ([a4adcef](https://github.com/dockfries/infernus/commit/a4adcef2f65aab9b8021cc19662bf18cd3c3b8aa))

### Bug Fixes

- **rec:** check the none type ([18396e5](https://github.com/dockfries/infernus/commit/18396e5e83d7e3d61b687f44870389d339639599))

## [0.11.7](https://github.com/dockfries/infernus/compare/v0.11.6...v0.11.7) (2025-02-05)

### Bug Fixes

- **core:** player.getDistanceFromPoint retval ([7d3b4c8](https://github.com/dockfries/infernus/commit/7d3b4c810e34cd56d1c94dbe500b8bd894d40208))
- **create-app:** removeDeps lockFile dep component ([5249522](https://github.com/dockfries/infernus/commit/5249522bdf5896f306b5cdb8541fb0fbaf34f47b))
- **root:** devDeps eslint/js ([1298bdc](https://github.com/dockfries/infernus/commit/1298bdcdd6a4bf8b72475612cd22ebf4e923689c))

## [0.11.6](https://github.com/dockfries/infernus/compare/v0.11.5...v0.11.6) (2025-01-13)

### Features

- **core:** add `player.isUsingOmp` ([07acf89](https://github.com/dockfries/infernus/commit/07acf8929ac4afa439f245388a9a2fe8ebc3f719))
- **gps:** wrapper for samp-gps-plugin ([#46](https://github.com/dockfries/infernus/issues/46)) ([a3dac5b](https://github.com/dockfries/infernus/commit/a3dac5b7312897f07263412bc834c7c2649ed2f1))

### Bug Fixes

- **create-app:** install all ([e6b2921](https://github.com/dockfries/infernus/commit/e6b29211a070fd346d3b6f2838fbe42345db9203))

## [0.11.5](https://github.com/dockfries/infernus/compare/v0.11.4...v0.11.5) (2025-01-04)

### Features

- **core:** more params for command & defineEvent throwOnError ? ([1f5f453](https://github.com/dockfries/infernus/commit/1f5f45341fc911fc91db6ef046f2aed6af895797))
- **create-app:** install --component option ([b7ea0ec](https://github.com/dockfries/infernus/commit/b7ea0ec5f0bea3299feed7b18590a2e1d072a865))

### Bug Fixes

- **create-app:** includes glob empty result, pawno path ([e590e33](https://github.com/dockfries/infernus/commit/e590e332585f77261be35663f44f4fc7c61dced2))
- **create-app:** maybe sort omp deps before add or remove ([476d454](https://github.com/dockfries/infernus/commit/476d4541e167c32fbab29dec27e38e3bba34cbff))

## [0.11.4](https://github.com/dockfries/infernus/compare/v0.11.3...v0.11.4) (2024-12-03)

### Features

- **core:** streamer static method, maybe we can add some utils ([381c683](https://github.com/dockfries/infernus/commit/381c683395df300a9551ca90bf72b0a5b67d7191))
- **core:** vehicle toggle methods syntax sugar ([6d6701c](https://github.com/dockfries/infernus/commit/6d6701c0e681f01ef766f06a28f9d9c56fdabf79))

### Bug Fixes

- **core:** event pusher again crash ([5e4da77](https://github.com/dockfries/infernus/commit/5e4da7715efef626ae96e6fe1984d4cea26bd5c7))
- **core:** isAndroid default true, skippable ([0f522eb](https://github.com/dockfries/infernus/commit/0f522eb642a9bc428eaa6874fdbf21135dec9853))

## [0.11.3](https://github.com/dockfries/infernus/compare/v0.11.2...v0.11.3) (2024-11-30)

### Features

- **core:** maybe we can try android checker? ([ebd481d](https://github.com/dockfries/infernus/commit/ebd481d75d9382e069ba0793d7fae51a01f3db5c))
- **core:** textdraw special char ([cf191a1](https://github.com/dockfries/infernus/commit/cf191a12e6ae212f5b227de743f4c49ae3b195dc))

### Bug Fixes

- **fs_debug:** some errors ([3f69fb9](https://github.com/dockfries/infernus/commit/3f69fb94bf7d905181ce63d392ab9e870f67b61b))
- **fs:** fs_debug object register ([b3ada29](https://github.com/dockfries/infernus/commit/b3ada29616583885efc83261ba2425ba9378f095))
- **fs:** fs_debug ssel timer ([6b215f6](https://github.com/dockfries/infernus/commit/6b215f66dd43ad51f919e55a1a6f7b422144ee39))

## [0.11.2](https://github.com/dockfries/infernus/compare/v0.11.1...v0.11.2) (2024-11-29)

### Features

- **fs:** fs_debug ([316dcda](https://github.com/dockfries/infernus/commit/316dcda2dc786759ef1d9b0abc8ffe6ec04666e2))
- **fs:** test_cmds ([c3b5b4f](https://github.com/dockfries/infernus/commit/c3b5b4fb7cf8ddc0931ea65aada7d529f2d8b54d))

### Bug Fixes

- **core, streamer:** typo, enum ([627e502](https://github.com/dockfries/infernus/commit/627e5026623e172a3a62cdaf2797a277e1b5a6c5))
- **core:** `GameText` special char ([d0fc8c4](https://github.com/dockfries/infernus/commit/d0fc8c4af55a1092e12a856f618c7e9d997219c0))
- **core:** onPlayerWeaponShot ([8133df3](https://github.com/dockfries/infernus/commit/8133df37b97c38035dcc9811d59e70554fadb098))
- **core:** setCameraLookAt default cut ([96b6420](https://github.com/dockfries/infernus/commit/96b64208589f42dd55184970a8208efe767c2231))
- **core:** vehicle `getParamsEx`, onUnoccupiedUpdate ([b6a98e6](https://github.com/dockfries/infernus/commit/b6a98e6ef12e1f397d949f7cf05b80a1b8b668ff))
- **fs:** build ([d4222f0](https://github.com/dockfries/infernus/commit/d4222f060ee2ad6d2280c74b51ab739be01e7848))

## [0.11.1](https://github.com/dockfries/infernus/compare/v0.11.0-beta.13...v0.11.1) (2024-11-03)

### ⚠ BREAKING CHANGES

- **core:** remove logger, use throw error

### Features

- **core:** remove logger, use throw error ([8fb796f](https://github.com/dockfries/infernus/commit/8fb796ff29d116087571d5de14bee93c4bc46241))
- **fcnpc:** didn't work, but it might help someone in the future ([49fc8ed](https://github.com/dockfries/infernus/commit/49fc8eda10b55314fc23ff8a6cec79fb5bace4d3))

### Bug Fixes

- **core, cef:** registerEvent with empty string, off bus, cef instances ([f8faed7](https://github.com/dockfries/infernus/commit/f8faed77bbd51c3d393f547bc1c6289f01e5d8dc))
- **core:** player, vehicle, DynamicActor params type ([e676c87](https://github.com/dockfries/infernus/commit/e676c878b604d3850f7810b529d97b2e45d506b3))
- **create-app:** minSatisfying check version ([f805525](https://github.com/dockfries/infernus/commit/f8055252064c63ea79e8520d01ba60e3e863f239))
- **streamer:** isToggleCallbacks return false ([871484b](https://github.com/dockfries/infernus/commit/871484b014a071228a0b49b6d2725e0eaa2a8ab5))

## [0.11.0-beta.13](https://github.com/dockfries/infernus/compare/v0.11.0-beta.12...v0.11.0-beta.13) (2024-08-23)

### Features

- **core:** cmd caseSensitive ([b6b4997](https://github.com/dockfries/infernus/commit/b6b49972a229c8a22ef3961926a19a1891176e9e))

### Bug Fixes

- **core:** cmd caseSensitive middleware ([722212d](https://github.com/dockfries/infernus/commit/722212d40769c8472566bbf4807960f1a96e6a44))
- **core:** i18n decodeFromBuf endsWith zero ([a450eb5](https://github.com/dockfries/infernus/commit/a450eb5c29d5300a2e0db5e40afa96b0ed4eb8ff))

## [0.11.0-beta.12](https://github.com/dockfries/infernus/compare/v0.11.0-beta.11...v0.11.0-beta.12) (2024-08-18)

### Bug Fixes

- **core:** vehicle get color params ([cbbf1b1](https://github.com/dockfries/infernus/commit/cbbf1b1783147491e95ad91201dc36b11aeb1ffe))
- **create-app:** raknet starter ([db6df22](https://github.com/dockfries/infernus/commit/db6df22146330fceff5aed5236dfab50a7529bcf))

### Performance Improvements

- **core:** maybe streamer destroy `OnGameModeExit` only need a flag ([868987b](https://github.com/dockfries/infernus/commit/868987bfddce188923a418f7a8a3e72f19e1237e))
- **core:** player instance, dialog ([ed8c6f2](https://github.com/dockfries/infernus/commit/ed8c6f2b5c261031435064d3e673167da17ae3f6))

## [0.11.0-beta.11](https://github.com/dockfries/infernus/compare/v0.11.0-beta.10...v0.11.0-beta.11) (2024-07-27)

### Features

- **create-app:** update-notifier ([53643c8](https://github.com/dockfries/infernus/commit/53643c85bb7667e4c31623412c4110f13dc53c1c))
- **fs:** gl_property ([3514695](https://github.com/dockfries/infernus/commit/3514695aa5367e7aa5bc862e733ff509cb5eedaa))

### Bug Fixes

- **core:** dynamic pickup type check range ([fbd4460](https://github.com/dockfries/infernus/commit/fbd4460fe360feb66627d20b1a44ed7b0bf25114))
- **core:** fs unload promise still pending, wrapper setTimeout ([369904b](https://github.com/dockfries/infernus/commit/369904b833ad024fe1cbe0183cb9697a96701409))
- **fs:** gl_property exit, read p_type ([7be63c7](https://github.com/dockfries/infernus/commit/7be63c72303b38be3126142aa9452c8da66efd18))

## [0.11.0-beta.10](https://github.com/dockfries/infernus/compare/v0.11.0-beta.9...v0.11.0-beta.10) (2024-07-22)

### Features

- **fs:** stunt_island ([59d2aba](https://github.com/dockfries/infernus/commit/59d2aba000489995052d18fdeabdead1383e19a3))

### Bug Fixes

- **core, fs:** isAdmin return, middleware error ([ce18a2c](https://github.com/dockfries/infernus/commit/ce18a2c0ab39f34f3dbf4ebc6b71348ca64d4bf6))
- **core, fs:** streamer event beforeEach typo, some fs unload ([d5b3941](https://github.com/dockfries/infernus/commit/d5b394107a15d1d9231f75e92c5cdb821bbdfd44))

## [0.11.0-beta.9](https://github.com/dockfries/infernus/compare/v0.11.0-beta.8...v0.11.0-beta.9) (2024-07-21)

### Features

- **core:** applyAnimation speed, time params, export animateUtils ([00ca113](https://github.com/dockfries/infernus/commit/00ca1136e629937b5f5dac86df33d90e1ec96554))
- **core:** some vehicle natives ([4ada610](https://github.com/dockfries/infernus/commit/4ada610497e0da63396933c01d5a5780227e7057))
- **fs:** gl_actions ([1cbd44b](https://github.com/dockfries/infernus/commit/1cbd44bbb104257f8b76289300f20e84b671891f))
- **fs:** gl_chat, pirate_ship ([52d17c3](https://github.com/dockfries/infernus/commit/52d17c33dec67555603d2f1913c7e01d7a1d8f8a))
- **fs:** gl_npcs, sf_building1, safe_animated ([a9a4032](https://github.com/dockfries/infernus/commit/a9a4032e522c69050dec455a47a33ee47d3436cb))
- **fs:** kylies_barn, ls_wells_fargo ([37b10df](https://github.com/dockfries/infernus/commit/37b10df69edc24ce9106de4cc796ff13fbced374))
- **fs:** ls_apartments1 ([c387a98](https://github.com/dockfries/infernus/commit/c387a985f6de96fd54bbb4aa73f24ba483db5ce8))
- **fs:** ls_beach_side ([415efcb](https://github.com/dockfries/infernus/commit/415efcb2eae073d9a9bbf93b67ceaaf77f506e9e))
- **fs:** ls_elevator ([c359ca2](https://github.com/dockfries/infernus/commit/c359ca2b343beb328753c5fb5922387a2ff45111))
- **fs:** ls_mall, constants type as const ([f472eb6](https://github.com/dockfries/infernus/commit/f472eb64ee684d39080a31465285e4d9dc06a3bb))
- **fs:** ls_prison_walls ([a237460](https://github.com/dockfries/infernus/commit/a23746015dfbcf873bdd590bd4bb631e2b4dfdaf))
- **fs:** modular_houses ([d9dacdd](https://github.com/dockfries/infernus/commit/d9dacdd3680cb3cc7439001a735d2d356a3384c0))
- **fs:** modular_island ([18ca4b8](https://github.com/dockfries/infernus/commit/18ca4b8251ee083fc1d49343431c442b3db9d820))
- **fs:** o_spawner ([b84c1f1](https://github.com/dockfries/infernus/commit/b84c1f1218b8f75e25510a6de95f47716f10c6d2))
- **fs:** sf_zombo_tech ([0aa8d47](https://github.com/dockfries/infernus/commit/0aa8d47de8b7cf40747b5fc035ca931a6299894c))
- **fs:** skin_changer ([1a436df](https://github.com/dockfries/infernus/commit/1a436dfe83f6d1ca1ac122a800dc35b7c655e164))
- **fs:** v_spawner ([979dbac](https://github.com/dockfries/infernus/commit/979dbac5300c220835f532c35dce338a01c8c017))

### Bug Fixes

- **core, fs:** some load errors, empty logger warn ([7d6298c](https://github.com/dockfries/infernus/commit/7d6298c059058ef2d2f65251f1583294deec75a0))
- **core:** fs forEach splice ([f3b0d9c](https://github.com/dockfries/infernus/commit/f3b0d9caa043e80a4493c868096df4428040be13))
- **core:** functions return, materialColor number type ([d374f44](https://github.com/dockfries/infernus/commit/d374f44dc62dd7105cde78bb98fd770b899ccb9b))
- **fs:** a51 type ([7939a1c](https://github.com/dockfries/infernus/commit/7939a1c07e4abdb35d8192b1a6d7a27e68f052c3))
- **fs:** o_v_spawner, skin_changer some errors ([0008083](https://github.com/dockfries/infernus/commit/00080834ad455201627975803ccc02957303ae94))
- **fs:** some errors ([48c90e4](https://github.com/dockfries/infernus/commit/48c90e49cd557bef2e0365269625912590f15ed2))
- **fs:** useFilterScript some ([3615203](https://github.com/dockfries/infernus/commit/36152038e72e8d08089ceb1a052df315e96ace74))

## [0.11.0-beta.8](https://github.com/dockfries/infernus/compare/v0.11.0-beta.7...v0.11.0-beta.8) (2024-07-03)

### Features

- **core:** applyAnimation forceSyncEnum ([387bcb9](https://github.com/dockfries/infernus/commit/387bcb91ce072c772c60c3d19a8ec55c4cd33172))
- **fs:** dillimore_gas script ([f0bc3cf](https://github.com/dockfries/infernus/commit/f0bc3cf15be0d547cea6a075d2f377bb75b9d60e))
- **fs:** ferris wheel ([b879a5e](https://github.com/dockfries/infernus/commit/b879a5e5ec5a4261e685b8facd0e7e9723a490de))
- **fs:** fly mode ([0410faf](https://github.com/dockfries/infernus/commit/0410fafd2ff1412d95707b21da1ae719c66e88a2))
- **fs:** gl_chat_bubble, max_ips, menu_test ([c60f8b1](https://github.com/dockfries/infernus/commit/c60f8b1eb138b48080f2ab97924d14a3d5554640))
- **fs:** gl_map_icon, npc_record, samp_anims ([484139f](https://github.com/dockfries/infernus/commit/484139f06bb8479755c70b1dd3fafe488feac6d8))
- **fs:** gl_real_time ([a5c7cc5](https://github.com/dockfries/infernus/commit/a5c7cc5ac8093ea8dbe88af6fa442283a531d591))
- **fs:** i_radio, net_stats ([b219edc](https://github.com/dockfries/infernus/commit/b219edc325fa2dd20441e5cc522523572e84e6ad))
- **fs:** player net_stats ([28354d1](https://github.com/dockfries/infernus/commit/28354d10f988f4efb1430a4e8815cd288a99c3a4))

## [0.11.0-beta.7](https://github.com/dockfries/infernus/compare/v0.11.0-beta.6...v0.11.0-beta.7) (2024-06-29)

### Features

- **cef:** maybe only use polyfill ([43b67a8](https://github.com/dockfries/infernus/commit/43b67a8655fe69711315748e0ff221f942ee47a0))
- **create-app:** better deps manage ([74eb27b](https://github.com/dockfries/infernus/commit/74eb27b55113b36a698f25af4e5fed1aeab76719))
- **fs:** anti flood ([e58d430](https://github.com/dockfries/infernus/commit/e58d43071018659b42ddcd5308a2f146470c9685))
- **fs:** base ([e1e5c96](https://github.com/dockfries/infernus/commit/e1e5c9698905bd098badd743f90d210c23e0fa56))
- **fs:** cargo ship ([b275246](https://github.com/dockfries/infernus/commit/b2752465fa5513e710015a7e9aad920841d986e0))

### Bug Fixes

- **ci:** pnpm action ([4890c43](https://github.com/dockfries/infernus/commit/4890c4379d5d1746c01a13b59654b5684d513247))
- **cli:** scriptName ([3cef7fd](https://github.com/dockfries/infernus/commit/3cef7fd6097dedbf9abfe5c39b7725e6d66c7eba))
- **cli:** usage bundle ([53fc2c1](https://github.com/dockfries/infernus/commit/53fc2c1c5d66c54b15331f72e4be76953fbe8e89))
- **core, streamer:** [#40](https://github.com/dockfries/infernus/issues/40) single reference paramTypes ret array ([c7226ae](https://github.com/dockfries/infernus/commit/c7226aef37c0f99aa4bcf6b8707fadada37b64c0))
- **core:** streamer type ([bfec2b8](https://github.com/dockfries/infernus/commit/bfec2b853cf48d6e7812230a2bf6cbe0958399ee))
- **create-app:** add or install deps removed, lockFile path ([50201cf](https://github.com/dockfries/infernus/commit/50201cf3285ebab4d57e2417b558aca15138a619))
- **create-app:** version params ([ec33ebd](https://github.com/dockfries/infernus/commit/ec33ebda7976ec9313c00d7184f60db062d97f7f))

### Performance Improvements

- **core:** maybe command can use same beforeEach ([e3ca9b5](https://github.com/dockfries/infernus/commit/e3ca9b5d5f92923514e091e9981e2fd94e284eba))

## [0.11.0-beta.6](https://github.com/dockfries/infernus/compare/v0.11.0-beta.5...v0.11.0-beta.6) (2024-05-07)

### Features

- **cef:** not sure if it works properly ([d670e79](https://github.com/dockfries/infernus/commit/d670e792539dc1a59b5f06105186ce7538eacc5c))
- **core:** sendRconCommand support charset ([9623b00](https://github.com/dockfries/infernus/commit/9623b00d2dc6140310e01e1787d0912e9487daa1))

## [0.11.0-beta.5](https://github.com/dockfries/infernus/compare/v0.11.0-beta.3...v0.11.0-beta.5) (2024-03-11)

### Features

- **core:** gangzone & textdraw chain call always return this ([456a394](https://github.com/dockfries/infernus/commit/456a394524c26486c91872628c321c483dfcb9ef))
- **core:** playerEvent onFpsUpdate, onLocale/CharsetChange ([b0451a7](https://github.com/dockfries/infernus/commit/b0451a7ff5e19b752e3427e1548847337976d52d))

## [0.11.0-beta.3](https://github.com/dockfries/infernus/compare/v0.11.0-beta.2...v0.11.0-beta.3) (2024-02-19)

### Bug Fixes

- **core:** textdraw setTextSize, isVisibleForPlayer not correctly call ([c2dad16](https://github.com/dockfries/infernus/commit/c2dad165a79fed90fb428f7d02a8ba61e08595b2))

## [0.11.0-beta.2](https://github.com/dockfries/infernus/compare/v0.11.0-beta.1...v0.11.0-beta.2) (2024-02-18)

### Features

- **fs:** attachments ([c5cb61d](https://github.com/dockfries/infernus/commit/c5cb61d35c3cb451df2b0d563aed5754a50fd9b9))

### Bug Fixes

- **core:** editAttachedObject, setAttachedObject default value ([d795575](https://github.com/dockfries/infernus/commit/d795575837e5de630a71e62c455cccb537ed047d))
- **core:** textdraw cancel middleware onDisconnect ([3e4f3ec](https://github.com/dockfries/infernus/commit/3e4f3ec76727abc9f5df48eb8a0a1aa97d4e114b))

## [0.11.0-beta.1](https://github.com/dockfries/infernus/compare/v0.10.0-beta.12...v0.11.0-beta.1) (2024-02-11)

### ⚠ BREAKING CHANGES

- **core:** please wait samp-node callNative return retval
- **streamer:** please wait samp-node callNative return retval
- **mapandreas:** please wait samp-node callNative return retval
- **colandreas:** please wait samp-node callNative return retval

### Features

- **colandreas:** `CA_Object` only create collision ([49a58d3](https://github.com/dockfries/infernus/commit/49a58d35b3339e84c6ae3165b91de5a2ef783a00))
- **colandreas:** please wait samp-node callNative return retval ([fb668d9](https://github.com/dockfries/infernus/commit/fb668d90c07f98e65da878793d91f6960d386156))
- **core:** please wait samp-node callNative return retval ([ad291e0](https://github.com/dockfries/infernus/commit/ad291e081503dec3556c5709f34299ae0fa140f3))
- **mapandreas:** please wait samp-node callNative return retval ([645c3c8](https://github.com/dockfries/infernus/commit/645c3c8c63e275b55a759b9b01768a1c52eed50c))
- **streamer:** please wait samp-node callNative return retval ([8a6e01e](https://github.com/dockfries/infernus/commit/8a6e01e7ac38494a16030c097b05cb793b9388a1))

### Bug Fixes

- **colandreas:** setPos, setRot may not dc ([a29b04f](https://github.com/dockfries/infernus/commit/a29b04f63b8cbddee723c8d3b09e9a221d18b72b))

### Performance Improvements

- **core:** use isValidVehModelId ([61493ef](https://github.com/dockfries/infernus/commit/61493ef35c11e5cea124089d09696bb4a8b80da9))

## [0.10.0-beta.12](https://github.com/dockfries/infernus/compare/v0.10.0-beta.11...v0.10.0-beta.12) (2024-02-07)

### Features

- **colandreas:** try to implement wrapper, not test ([5f7328b](https://github.com/dockfries/infernus/commit/5f7328b43235c759f16e7bc0e3bf8ebc202b7dd4))
- **core:** `vectorSize` use javascript implement ([f894106](https://github.com/dockfries/infernus/commit/f89410656292dd3e83e3cf187446e612f336a6a2))
- **core:** player getSpeed ([89f6eab](https://github.com/dockfries/infernus/commit/89f6eab9b9eadff4b755265e0d4d4269169918c5))

### Bug Fixes

- **create-app:** decompress overwrite ([53ad784](https://github.com/dockfries/infernus/commit/53ad7845975d6288438211ea2789cf64ea5bbfb8))

## [0.10.0-beta.11](https://github.com/dockfries/infernus/compare/v0.10.0-beta.10...v0.10.0-beta.11) (2024-02-01)

### Features

- **core:** add some new natives ([9ea2c9e](https://github.com/dockfries/infernus/commit/9ea2c9ec13c152d8e50e92a14fa27a88a2922025))

### Bug Fixes

- **streamer:** get actor animation ([1de139a](https://github.com/dockfries/infernus/commit/1de139a89332aaaa299396751ac221141ca0dee7))

## [0.10.0-beta.10](https://github.com/dockfries/infernus/compare/v0.10.0-beta.9...v0.10.0-beta.10) (2024-01-31)

### Features

- **streamer:** add `DynamicObjectNoCameraCollision` ([a90e10a](https://github.com/dockfries/infernus/commit/a90e10a9f8d9344b06be0d253f5de630fe02c4a7))

## [0.10.0-beta.9](https://github.com/dockfries/infernus/compare/v0.10.0-beta.8...v0.10.0-beta.9) (2024-01-31)

### ⚠ BREAKING CHANGES

- **core:** remove deprecated pool size functions
- **core:** remove partial generics and instances param
- **fs:** remove play sound players param

### Features

- **core:** add some new natives and callbacks ([e9a2b1a](https://github.com/dockfries/infernus/commit/e9a2b1ac0720578a7defd4305280a44ac9b0f255))
- **core:** key utils ([8a79286](https://github.com/dockfries/infernus/commit/8a79286e5d8899af684a3db11c168191050a5277))
- **core:** migrate `@infernus/wrapper` to core ([6204710](https://github.com/dockfries/infernus/commit/62047109b0bef372d09eed4a616d950b57632564))
- **core:** remove deprecated pool size functions ([32e864c](https://github.com/dockfries/infernus/commit/32e864c65cc8fb0c6dafed5bdef130dfcde20052))

### Bug Fixes

- **core:** textdraw is valid function ([e590fb4](https://github.com/dockfries/infernus/commit/e590fb4cf8498adc86599218f993f0e6d8327ccf))

### Code Refactoring

- **core:** remove partial generics and instances param ([1adf6c5](https://github.com/dockfries/infernus/commit/1adf6c59275c56005ae2409d054aa497340826b7))
- **fs:** remove play sound players param ([40d305f](https://github.com/dockfries/infernus/commit/40d305fc70276f45ebb317ef8280464ed4df6c4b))

## [0.10.0-beta.8](https://github.com/dockfries/infernus/compare/v0.10.0-beta.7...v0.10.0-beta.8) (2024-01-22)

### Bug Fixes

- **core:** valid str `-1`, weapon enum fist ([77df1c0](https://github.com/dockfries/infernus/commit/77df1c044ad4ab9f57d77a983db6c0bddbc2f0ad))
- **docs:** actions config pnpm version ([6433787](https://github.com/dockfries/infernus/commit/6433787b636e007f0561f51ccc291d2cc81f8499))
- **raknet:** error patch name ([a39fa56](https://github.com/dockfries/infernus/commit/a39fa56917cfc40740c67918200482c6254e5da6))
- **raknet:** invalid sync decorator ([5852dd1](https://github.com/dockfries/infernus/commit/5852dd12a103957199b528c8dd80bd5771f503ca))
- **raknet:** pass array/string through new polyfill ([f61eaf2](https://github.com/dockfries/infernus/commit/f61eaf291ec27c3aa45983e39c5119e1034e97e7))

## [0.10.0-beta.7](https://github.com/dockfries/infernus/compare/v0.10.0-beta.6...v0.10.0-beta.7) (2023-12-02)

### Features

- **raknet:** use defineEvent to support middleware ([5033488](https://github.com/dockfries/infernus/commit/50334881c83dc066922177c78730e193bcfc80e9))

### Bug Fixes

- **core:** error map key match for gangZone and textDraw ([4ff710f](https://github.com/dockfries/infernus/commit/4ff710fa92254f2699763d2030e651e3e1fc6c61))
- **core:** onDeath, onTakeDamage enum type generic inference, getKeys return hump ([258667b](https://github.com/dockfries/infernus/commit/258667bdfb199c1291aa5c3c3c2a8454373045c0))

## [0.10.0-beta.6](https://github.com/dockfries/infernus/compare/v0.10.0-beta.5...v0.10.0-beta.6) (2023-12-02)

### Features

- **core:** event constant `object.freeze` ([8a589f0](https://github.com/dockfries/infernus/commit/8a589f0e1724da38624db802c3261c6b8572aa78))

### Bug Fixes

- **core:** onCommandText replace /, failed to correctly define some i18n functions ([03276ae](https://github.com/dockfries/infernus/commit/03276ae03f39d4a29a6367ea3fb1bc3fee2ef375))

## [0.10.0-beta.5](https://github.com/dockfries/infernus/compare/v0.10.0-beta.4...v0.10.0-beta.5) (2023-12-01)

### Bug Fixes

- **core:** streamer destroy not set id -1, return onExit ([20a874b](https://github.com/dockfries/infernus/commit/20a874bbe0e2002aa7f0c5509d7a784a93493aaf))

## [0.10.0-beta.4](https://github.com/dockfries/infernus/compare/v0.10.0-beta.2...v0.10.0-beta.4) (2023-12-01)

### Bug Fixes

- **core:** command error performed key not used ([521489e](https://github.com/dockfries/infernus/commit/521489e01e914e80c5db39a5f9992ff57dc54b6a))
- **core:** fps heartbeat, command off index ([26858f0](https://github.com/dockfries/infernus/commit/26858f08ca3f5d7f1a3ba645db835467b477dee9))
- **core:** maybe right command error sequence ([15cdbb3](https://github.com/dockfries/infernus/commit/15cdbb36585ac75685199c30229aff535d22ca07))

## [0.10.0-beta.2](https://github.com/dockfries/infernus/compare/v0.10.0-beta.1...v0.10.0-beta.2) (2023-11-30)

### Bug Fixes

- **core:** find subcommand ([0e63ccf](https://github.com/dockfries/infernus/commit/0e63ccfd7b4047820404d23a5686fbb66acc4b62))

## [0.10.0-beta.1](https://github.com/dockfries/infernus/compare/v0.10.0-beta.0...v0.10.0-beta.1) (2023-11-30)

### Bug Fixes

- **core:** logger, onCommandError/Text, disconnect ([052000f](https://github.com/dockfries/infernus/commit/052000f2fb6a2abbd580fdba931f3f3ffdb02703))

## [0.10.0-beta.0](https://github.com/dockfries/infernus/compare/v0.9.8...v0.10.0-beta.0) (2023-11-30)

### ⚠ BREAKING CHANGES

- **filterscript, wrapper, streamer:** try to adapt core middleware pattern
- **core:** wip middleware pattern draft

### Features

- **wip-core:** simulate trigger event ([be0e26f](https://github.com/dockfries/infernus/commit/be0e26fc56b38fda259045b633b9e5498bb2fe17))

### Bug Fixes

- bump version files range ([2b711a3](https://github.com/dockfries/infernus/commit/2b711a3c78030875cfee996d0b23aff1701d3837))
- **core:** build circular deps ([943ca4e](https://github.com/dockfries/infernus/commit/943ca4e430a29f21b71b38d082467b944abf31b4))
- **git:** pre-commit hook contributors not add ([3270723](https://github.com/dockfries/infernus/commit/327072363580908a53f5301c7966ab8597165d88))

### Code Refactoring

- **core:** wip middleware pattern draft ([462ebbf](https://github.com/dockfries/infernus/commit/462ebbf8e944ce768985856172b418cf6f71fc22))
- **filterscript, wrapper, streamer:** try to adapt core middleware pattern ([d8acc3f](https://github.com/dockfries/infernus/commit/d8acc3f0c1b124de4c70b9b03a0d879a9bb5e1e9))

## [0.9.8](https://github.com/dockfries/infernus/compare/c188eaf9f339d1226c0415882cba1b651a384edf...v0.9.8) (2023-11-27)

### ⚠ BREAKING CHANGES

- remove public, abstract cb modification

### Features

- `cmdBus.on` support async ([24f86f3](https://github.com/dockfries/infernus/commit/24f86f3da9f5a8c02d279cf593b9b00a5fa8a085))
- 3d text add get color and charset function ([04cc324](https://github.com/dockfries/infernus/commit/04cc324c9b3b16527a1cddf0b3c76bb5ec376ab2))
- add net stats and some game mode function ([47c0fe7](https://github.com/dockfries/infernus/commit/47c0fe7e31b88438be5f16c0e9a12c8b50d56c13))
- add off command text ([a08b3ea](https://github.com/dockfries/infernus/commit/a08b3eaea936d744bf78dbf115dd49835ed19edc))
- add some game mode and player functions ([b49bbc8](https://github.com/dockfries/infernus/commit/b49bbc82c20aaec89050b42a6e41be3f0d55536a))
- add some game text natives ([1484060](https://github.com/dockfries/infernus/commit/148406094cfd9a3921480750dcc30b6f652d71d8))
- added 0.3dl download callback, perf vehicle color params ([5835467](https://github.com/dockfries/infernus/commit/5835467838b1e4a6099eede7b4423d1933e49777))
- added actor player give damage callback ([52e176c](https://github.com/dockfries/infernus/commit/52e176c3630fe96590d5ff1d7127a81e39d30747))
- added attach slot to player ([3e586e5](https://github.com/dockfries/infernus/commit/3e586e51cd37dcdfe12a4e4c7fd61674b3339f27))
- added dynamic area structure ([afafffa](https://github.com/dockfries/infernus/commit/afafffae52c999fa1764e4618dbdd226d849f3c7))
- added dynamic areas natives and callbacks ([d8fc1ce](https://github.com/dockfries/infernus/commit/d8fc1cef4104cc086e8aaccdba9127fc7e9c1f86))
- added gang zone ([93e95ad](https://github.com/dockfries/infernus/commit/93e95ad56e75a5e50034993b72cfb1d2c18b1b6c))
- added is valid for single class ([1706700](https://github.com/dockfries/infernus/commit/1706700971a00795686c6b13ee6c2934cfdf92a5))
- added isAndroid check ([c1e822a](https://github.com/dockfries/infernus/commit/c1e822a081bced4f94cd7cc7a24c46c75064c6bb))
- added most of streamer object fns and cbs ([fead4c5](https://github.com/dockfries/infernus/commit/fead4c5680bb7cefee343022ae846e8cc2cf9dbd))
- added omp menu natives ([18c2a00](https://github.com/dockfries/infernus/commit/18c2a00f954af2ccec93889bd4aff0463b0a20a6))
- added player animation functions ([69d93d6](https://github.com/dockfries/infernus/commit/69d93d6beda2b5398e156815d566babd048a95a4))
- added request class callback ([f87f6a1](https://github.com/dockfries/infernus/commit/f87f6a17c596998703f9aa778d6ddaa3add599ba))
- added some 0.3dl and player functions ([022edf5](https://github.com/dockfries/infernus/commit/022edf558751eb5261a1f1d43e1a8f997b515b01))
- added some animation functions ([8717ca4](https://github.com/dockfries/infernus/commit/8717ca4469d8d57e88480b3b416eb2bc2970f7ac))
- added some callbacks ([3dc116a](https://github.com/dockfries/infernus/commit/3dc116a50a5e0bbf50d122e0013e4084b443e5a9))
- added some functions ([ec714d6](https://github.com/dockfries/infernus/commit/ec714d652d2694cb0cece23143b484a73230b0ec))
- added some game mode and player functions ([dec5513](https://github.com/dockfries/infernus/commit/dec55139558c468ce88d0082688c44981295e3a2))
- added some omp text draw natives ([b8de494](https://github.com/dockfries/infernus/commit/b8de494ae4ee786936cabbf113e2a33c7a73222b))
- added some omp wrapper functions ([c5c4071](https://github.com/dockfries/infernus/commit/c5c4071f32f075a8b25e0739135883c338f9a10c))
- added some omp wrapper player functions ([f79662d](https://github.com/dockfries/infernus/commit/f79662d955e1607ac9a834ce2831fe177416a616))
- added some player and vehicle functions ([54c2ff7](https://github.com/dockfries/infernus/commit/54c2ff78b63cefed1535a7ee50a64ed72963ef79))
- added some player camera function ([d7befab](https://github.com/dockfries/infernus/commit/d7befab4f5d6afd8b04ce881a9c250be57d71383))
- added some player functions ([bbf89f2](https://github.com/dockfries/infernus/commit/bbf89f251eb400d6640a08af739c9b89a3343519))
- added some player functions ([1520270](https://github.com/dockfries/infernus/commit/1520270e81784e519bd5a5ebfed3a60fb30061ef))
- added some player functions ([f619998](https://github.com/dockfries/infernus/commit/f6199988ab24ae148f311be920b0e357098c09a8))
- added some player functions ([f9b63fe](https://github.com/dockfries/infernus/commit/f9b63fe9ffb70fc430a2984a3f712b64d9935c92))
- added some player functions ([3cf4da4](https://github.com/dockfries/infernus/commit/3cf4da489125aed5429450f1b1268cbb1684538f))
- added some textdraw functions ([92e2deb](https://github.com/dockfries/infernus/commit/92e2deb6705d80d6eef02d0df7a6dc9ec9b6fdfb))
- added some vehicle functions ([8acd5bc](https://github.com/dockfries/infernus/commit/8acd5bc921c5d4877bcad0a11dd6ba225d52044f))
- added some vehicle functions ([c3adc86](https://github.com/dockfries/infernus/commit/c3adc86233d66a5df27c70c31e2bebf5850c6673))
- added some vehicle functions ([9a90359](https://github.com/dockfries/infernus/commit/9a9035956c242d59e1ba6e8a7b96b35d551e13e6))
- added streamer 3d text label ([d685927](https://github.com/dockfries/infernus/commit/d685927e41fffec896dabfff56bf5db9e6197d7e))
- added streamer actor and callbacks ([1ddb2f2](https://github.com/dockfries/infernus/commit/1ddb2f2e1236222b3b5703cdd3962c9247071c75))
- added streamer area callbacks ([6d8ff9f](https://github.com/dockfries/infernus/commit/6d8ff9f090faaceb7dcdb9d756fd27365a43e6bf))
- added streamer callback and settings natives ([08b96b3](https://github.com/dockfries/infernus/commit/08b96b372d2ded4dc6e594c6062650d2d29db64c))
- added streamer checkpoint and callbacks ([5603ebb](https://github.com/dockfries/infernus/commit/5603ebb6ee0741656fd1654118a1ae759c22a3c7))
- added streamer map icon ([5b3db50](https://github.com/dockfries/infernus/commit/5b3db50bf39228831ebffc1e6949bdf53015e021))
- added streamer miscellaneous natives ([b0f8c56](https://github.com/dockfries/infernus/commit/b0f8c560b481967482096a170596f5e7f8ecdbe0))
- added streamer pickup and callback ([98829ef](https://github.com/dockfries/infernus/commit/98829efc689619992eb8dc0dae8815b02d9906ef))
- added streamer race cp and callbacks ([e2ce36f](https://github.com/dockfries/infernus/commit/e2ce36f31240c706764dfa62837f0174819aea65))
- added streamer updates ([bf896e4](https://github.com/dockfries/infernus/commit/bf896e49bd33479a631bd5763875a8c00d35c001))
- added testability `use` func ([214ea1f](https://github.com/dockfries/infernus/commit/214ea1f5229f079a55bc5a729306bc24c4fa6eee))
- addStaticVehicle ([34e113a](https://github.com/dockfries/infernus/commit/34e113a0ac6ceb9c47038d2f41df0dafdab5778b))
- adjust cb and fn which in i18n ([d2f5f7c](https://github.com/dockfries/infernus/commit/d2f5f7cfaaf798dc1af66f64b589a4b7ca361e13))
- adjust enums ([664b662](https://github.com/dockfries/infernus/commit/664b6620b85ac63b8ba767793a2a83e3d34cfb34))
- adjust game mode callback ([59f2b65](https://github.com/dockfries/infernus/commit/59f2b6575aa96007a003aadcfe59a236e8c45017))
- base menu ([e9ec979](https://github.com/dockfries/infernus/commit/e9ec9794071f4d0ec9129d58f2f33a7c03889f28))
- base vehicle create logger warn ([daedc71](https://github.com/dockfries/infernus/commit/daedc713077e865eaed32cb74f483f942710b422))
- better way call player callback ([452c4d0](https://github.com/dockfries/infernus/commit/452c4d0c16d2d198180bf94a81c956d75affa473))
- callbacks ([db3a720](https://github.com/dockfries/infernus/commit/db3a72097d44b923af89308c0fc54b954ec570b7))
- cmdBus error callback ([cce5ced](https://github.com/dockfries/infernus/commit/cce5cedaf33c7a5bfc068d3b80d334e236e5346c))
- cmdbus extends player emit ([f762bcb](https://github.com/dockfries/infernus/commit/f762bcbd920a87dd731b47af150f93c150d242bb))
- complementary functions for native menus ([25bd9ea](https://github.com/dockfries/infernus/commit/25bd9eaa5fbc53bc6f026f627629d67759e2bdb6))
- console redirect logger ([f85a288](https://github.com/dockfries/infernus/commit/f85a2886efdb4307609d64e33facb1fdeebbb7b0))
- **core:** getConsoleVarAs functions ([d14777f](https://github.com/dockfries/infernus/commit/d14777f8b89ed19c6d7fe2270003703755024fbf))
- **core:** getSurfingPlayerObject ([2bd4ec6](https://github.com/dockfries/infernus/commit/2bd4ec624981d2d1e6eee192566ffcb36727d5c5))
- **core:** object OnPlayerEditAttachedObject and getModel ([f30ebdb](https://github.com/dockfries/infernus/commit/f30ebdb744d496432e9627839a54a4f00735e362))
- **core:** textdraw isGlobal func ([f16e358](https://github.com/dockfries/infernus/commit/f16e3586205d111bf2a0e2b6f61e4a71976264e1))
- **core:** weapon enum ([5ce793c](https://github.com/dockfries/infernus/commit/5ce793c802f9a95d4e5e03b242e071004c178661))
- create-app for npm init ([0127e44](https://github.com/dockfries/infernus/commit/0127e44ad81aa249adab1ea1f9b21274ece4f751))
- dynamic add locales by merge ([7382bf9](https://github.com/dockfries/infernus/commit/7382bf9e086db15dcf765fcbcf1d6729b783d8a1))
- enums ([c188eaf](https://github.com/dockfries/infernus/commit/c188eaf9f339d1226c0415882cba1b651a384edf))
- function about allow and enable ([ff60926](https://github.com/dockfries/infernus/commit/ff6092620ba216148f9f96d1c2e21158b447ad2b))
- game mode add player class ([8d80116](https://github.com/dockfries/infernus/commit/8d80116b45d091c876ef612529779b4199087126))
- game text class ([6d591d0](https://github.com/dockfries/infernus/commit/6d591d02bd4b2c1788a76d2f51fdc3f98d8e4b00))
- gamemode exit auto destroy if exist event, stream in/out callback ([de3c8d7](https://github.com/dockfries/infernus/commit/de3c8d77cff4c4f407d2bde9d0e5e6e87d0cf201))
- i18n language adapt ([80d2c07](https://github.com/dockfries/infernus/commit/80d2c07d6da1c48430b62f0f52140b354ff54b05))
- interpolate camera ([f8b4439](https://github.com/dockfries/infernus/commit/f8b4439a1b2ce2359581df6608b6a12109374e33))
- mapandreas wrapper ([0fd6c7f](https://github.com/dockfries/infernus/commit/0fd6c7f5e5277858cd36d81c2a67a08b1e2c7019))
- netstat functions ([94fa8b6](https://github.com/dockfries/infernus/commit/94fa8b670eb8be965c405f42e5723fd07f32ddf4))
- new command callback like `izcmd` ([d811cc4](https://github.com/dockfries/infernus/commit/d811cc414d93d005f86418386482bc44b853087e))
- npc event and function ([c22ced1](https://github.com/dockfries/infernus/commit/c22ced1d2ce96b9082546d7c6d001f07ab95f7e4))
- omp new gang zone natives and callbacks ([d2fa614](https://github.com/dockfries/infernus/commit/d2fa61455c401b17fd9787dee1cf29b0fa8cb005))
- on pause timestamp param ([a8dcf1d](https://github.com/dockfries/infernus/commit/a8dcf1da005a33c8f38a8ddf078e8be616c03686))
- pino as logger ([3d183b2](https://github.com/dockfries/infernus/commit/3d183b2fdde420e37cea7f05ad4c97384f2339bb))
- pino logger with prettyPrint ([7f75ac3](https://github.com/dockfries/infernus/commit/7f75ac368647124c44a52ef6ccbed3aaacedcefe))
- player and vehicle adjust ([bd85db6](https://github.com/dockfries/infernus/commit/bd85db66fb85e014132f09b94258b77c92df3b35))
- player event command search prototype cmdbus ([c0631da](https://github.com/dockfries/infernus/commit/c0631da61ecaf4d62b2f7467a17df49bf369a917))
- player fps getter ([9a32621](https://github.com/dockfries/infernus/commit/9a32621be37be591e65f3a122917b40fc142d30d))
- player spectate ([a184358](https://github.com/dockfries/infernus/commit/a18435841f5c546cf064cb896d0f0abc709b6771))
- player weapon functions ([28e59e5](https://github.com/dockfries/infernus/commit/28e59e55aa243c9186af089b73aadf23e24fd543))
- raknet(wip), rename folder and package ([82b15ee](https://github.com/dockfries/infernus/commit/82b15eec3fb7643052d5d9f2e17340e10e7d3722))
- remove cmd bus global export ([b1a741e](https://github.com/dockfries/infernus/commit/b1a741e452e0bd5ba81447968e518052af39bf73))
- set skin and create vehicle new param ignore range ([6ad4740](https://github.com/dockfries/infernus/commit/6ad474045bfea7aece91bc1fab4b06c0bb27129f))
- some function and callback about interior ([34447d6](https://github.com/dockfries/infernus/commit/34447d6e3b9e673e8208f95f8e6fe5038e51ffd2))
- streamer data manipulation ([2580df4](https://github.com/dockfries/infernus/commit/2580df4cd979f70ff03f1f28e757fdec43ed7d80))
- streamer object material with charset ([142eef1](https://github.com/dockfries/infernus/commit/142eef1fbae49163387bd26b6ace2376d51ec5b5))
- support all callbacks with async ([696e941](https://github.com/dockfries/infernus/commit/696e941587232984b584d9bf09e55380f7c62a93))
- support install script by use function ([c4f146c](https://github.com/dockfries/infernus/commit/c4f146c22d3172c7a26304b0463a3cf793cdcbb9))
- support omp component raknet by patch call public ([8f855a8](https://github.com/dockfries/infernus/commit/8f855a828e61c4268ee5434909d3e45278623457))
- text draw skeleton ([6209d1e](https://github.com/dockfries/infernus/commit/6209d1e1a7a40df87e493673783470831ec90872))
- textdraw callback ([9bab94a](https://github.com/dockfries/infernus/commit/9bab94a790305c4facfdba24494a537ffa65c2cd))
- try extends call ([48d11a3](https://github.com/dockfries/infernus/commit/48d11a3b06336d7f1dbb45dd838c301e0420a3e6))
- try migrating some of the features ([839948b](https://github.com/dockfries/infernus/commit/839948b73b3daddd6efa21cf122b2d079a132d44))
- unify some attributes in the player event class ([e6baccc](https://github.com/dockfries/infernus/commit/e6baccc33fc73cc1e7a62aa5bf758475cbee3fec))
- update latest omp natives ([c35e4a6](https://github.com/dockfries/infernus/commit/c35e4a65cd481ef3f4de75c152b1f7f8f20211a9))
- veh/player static check, perf private attrs, color ([7aac09e](https://github.com/dockfries/infernus/commit/7aac09e46b0d18d698db28ffa580f31f22fadd5a))
- vehicle all callbacks ([8a14c4e](https://github.com/dockfries/infernus/commit/8a14c4ebcbaa379921273c1be5d3abff69483471))
- vehicle component utils ([75aca78](https://github.com/dockfries/infernus/commit/75aca78908e5b9754676837baee7430aa68561b1))

### Bug Fixes

- appears that the return has an impact on the execution result ([eec3744](https://github.com/dockfries/infernus/commit/eec374408a481a68cad2e60f1879b3eabfc079ef))
- callback this error ([4a4076e](https://github.com/dockfries/infernus/commit/4a4076e42c5d4808c05017ff9490909c6487c2a0))
- can't import ([e3bbfad](https://github.com/dockfries/infernus/commit/e3bbfadcfa0972fddd444910afd1c10a80abcfd9))
- check is android while not reach limit ([0bab338](https://github.com/dockfries/infernus/commit/0bab3384fea5cc9b357b41db429386c03a019357))
- checkpoint type inference tips ([1e2408d](https://github.com/dockfries/infernus/commit/1e2408d1563db818cb0a6ee0903f8b92bc1e5fbb))
- circular dependency ([f0c9bae](https://github.com/dockfries/infernus/commit/f0c9bae9a97e05ea45823993695f36529c1b62cc))
- client check no response ([8cd393c](https://github.com/dockfries/infernus/commit/8cd393ca9d9c444016e78a1a65ee9fa516829476))
- command idx overstep ([76863ff](https://github.com/dockfries/infernus/commit/76863ffbfe618439cd125affdf0dae6e560a3695))
- config json overwritten and spaces, bump version ([3982f47](https://github.com/dockfries/infernus/commit/3982f47394a830306d717b379c8a3e48c15967f1))
- **core:** invalid enum menu value ([9cf2adb](https://github.com/dockfries/infernus/commit/9cf2adb0b55d76efbe0add61ea84ca2199b34d73))
- error call ([7c67a8f](https://github.com/dockfries/infernus/commit/7c67a8f6e16bd774c6dbdc12a32025b04db72553))
- error streamer actor event name ([c174dea](https://github.com/dockfries/infernus/commit/c174deaefe3cf89e33fd89581250788403fe490c))
- error vehicle emit bus ([fb68389](https://github.com/dockfries/infernus/commit/fb6838953b34412379c09775d862c9f0dbf2afd9))
- gamemode abstract event ([379a849](https://github.com/dockfries/infernus/commit/379a8498c252f8b04d7c4cb9fa96b9d6ae25c1a5))
- i18n deconstruction this problem ([324497f](https://github.com/dockfries/infernus/commit/324497fa0033f42f257a8c38be4251e57e685840))
- isAndroid promise resolve not call ([b2a4455](https://github.com/dockfries/infernus/commit/b2a44556275434e380dc4a5ccb511ad63671a7e0))
- logger error ([23466f5](https://github.com/dockfries/infernus/commit/23466f5d203a03ba547c261223e59caecc19a158))
- no error msg if the secondary command not processed ([4f8fcd3](https://github.com/dockfries/infernus/commit/4f8fcd30e7fcd7d12753a4b9f3f00fbcc2d99423))
- not triggered according to the correct player ([8f9b882](https://github.com/dockfries/infernus/commit/8f9b8822303abd49a46090281fab8f2c7f056e0d))
- omitted textdraw exposure ([885d2e7](https://github.com/dockfries/infernus/commit/885d2e774bd3f667d448b04f4a4e198ba8eaaaf7))
- onCommandText this pointer ([cfd1492](https://github.com/dockfries/infernus/commit/cfd14926430f04a43921b79a80913decf3c722e1))
- ontext promise 0 ([bcc4b9b](https://github.com/dockfries/infernus/commit/bcc4b9bd52eca7db2937108c5b8335cbc0dff499))
- pause iteration ([74a8667](https://github.com/dockfries/infernus/commit/74a8667a40905989f7207b3dde00f4549ac6ccda))
- pretty print and export logger ([8a039c5](https://github.com/dockfries/infernus/commit/8a039c568b0e869ffb666f8d75fe01b5739fe412))
- promisify callback this ([c43fa45](https://github.com/dockfries/infernus/commit/c43fa452a10c062e2def52636554fab58534f1fc))
- promisify wrap stream in/out callback ([c7d139f](https://github.com/dockfries/infernus/commit/c7d139f3fb7cd6519def33fc10a03a86f44bf0eb))
- raknet sync decorator loop call, npm ignore ([38a675f](https://github.com/dockfries/infernus/commit/38a675f9a443eec014632281566b043cca04b37e))
- recurse cmd bus and no onCommandReceived bug ([ae8ab43](https://github.com/dockfries/infernus/commit/ae8ab438db416322216388cf6a05dd8cb2a5fc3b))
- removePromisifyCallback trigger time ([28aa8a3](https://github.com/dockfries/infernus/commit/28aa8a3c3ffc36c0d46919045b3e1b34b65758f9))
- return logger error ([5dca7c9](https://github.com/dockfries/infernus/commit/5dca7c9f4efa1a09fef096dc7ee64a4c4b716782))
- rollback some deprecated redirect native [#21](https://github.com/dockfries/infernus/issues/21) ([baecf92](https://github.com/dockfries/infernus/commit/baecf9223c69d5e62cd781aaefd660b4084f2fd2))
- should be no throttling of the overall update callbacks ([b3c0bf1](https://github.com/dockfries/infernus/commit/b3c0bf15bb96c0314f5c4e11bbcd344cbd28f96a))
- splice to slice, try fix async `cmdBus.on` ([110973c](https://github.com/dockfries/infernus/commit/110973cd78012026884bdaa73be61b3fbff70794))
- streamer update ex params ([efddc2a](https://github.com/dockfries/infernus/commit/efddc2acad86c0764c692f653ce1e39046ecf23d))
- textdraw error count and unregisterEvent ([4a3c1a0](https://github.com/dockfries/infernus/commit/4a3c1a030670382ab7c50b9095775ec7e58a4441))
- use func not initialized when restarted ([bf61ee9](https://github.com/dockfries/infernus/commit/bf61ee91945bc565e8e2b402fd0a7bd0de0e281e))
- wrong enum check limited vehicle ([5490cb1](https://github.com/dockfries/infernus/commit/5490cb17875e143271580cb5056041f93bdbd2ad))

### Performance Improvements

- basePlayer isNpc ([6a5f23b](https://github.com/dockfries/infernus/commit/6a5f23b4bf208ceb9d0cbbb5a0ff86f951c567de))
- clear dialog promise waiting ([a15c97a](https://github.com/dockfries/infernus/commit/a15c97ad54ae1aea7fb98568d5987a7ef9184468))
- get fps and pause resume callback ([f9d7c3b](https://github.com/dockfries/infernus/commit/f9d7c3b6d92524cf4c9513cda7b5b2104184fca8))
- hide dialog before show ([75fe91f](https://github.com/dockfries/infernus/commit/75fe91fb042e0abf117a59f693305a5052faf424))
- i18n error process exit and banEx with charset ([862a189](https://github.com/dockfries/infernus/commit/862a189f3392f83e77724442ded3830c07b0e908))
- logger structure ([0a42471](https://github.com/dockfries/infernus/commit/0a424712b3d49a2befb973d84e8c023857e2a6f7))
- OnPlayerUpdate 16.67 calls per second ([87443ad](https://github.com/dockfries/infernus/commit/87443ad7b8b1639710588c0398128ca7e1430ea8))
- optimize structure ([8bc1d3c](https://github.com/dockfries/infernus/commit/8bc1d3c615b551cc85d65ab753dcf5c69da750d8))
- **raknet:** parameter playerId is changed to support Player class or number ([5c5321c](https://github.com/dockfries/infernus/commit/5c5321c5d254f1a9b003805108a61ca6c23ff0ec))
- reduced array traversal with map storage ([e24040a](https://github.com/dockfries/infernus/commit/e24040a087d0b450538084b96cda670f8ff6427d))
- remove player unparsed dialog queue ([d5290a6](https://github.com/dockfries/infernus/commit/d5290a679d744f2b402c64e2c831400cb9ed1139))
- static dot value ([b3812fa](https://github.com/dockfries/infernus/commit/b3812fa28147d186eef17105fb503b9d0140fc5d))
- throttling calls to fps remain correct value ([561d0ff](https://github.com/dockfries/infernus/commit/561d0ffdc23bfec0d187a9238965f9c2e478aa56))

### Code Refactoring

- remove public, abstract cb modification ([56f6342](https://github.com/dockfries/infernus/commit/56f63420b30203fe1f10c829d0dc359843200658))
