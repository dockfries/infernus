export const npcNames = [
  "TrainDriverLV",
  "TrainDriverLS",
  "TrainDriverSF",
  "PilotLV",
  "PilotSF",
  "PilotLS",
  "OnfootTest",
  "DriverTest",
  "DriverTest2",
] as const;

export const spawnInfo = {
  [npcNames[0]]: [69, 255, 1462.0745, 2630.8787, 10.8203, 0.0],
  [npcNames[1]]: [69, 255, 1700.7551, -1953.6531, 14.8756, 0.0],
  [npcNames[2]]: [69, 255, -1942.795, 168.4164, 27.0006, 0.0],
  [npcNames[3]]: [69, 61, 0.0, 0.0, 0.0, 0.0],
  [npcNames[4]]: [69, 61, 0.0, 0.0, 0.0, 0.0],
  [npcNames[5]]: [69, 61, 0.0, 0.0, 0.0, 0.0],
  [npcNames[6]]: [69, 61, 2388.1003, -1279.8933, 25.1291, 94.3321],
  [npcNames[7]]: [69, 61, 2388.1003, -1279.8933, 25.1291, 94.3321],
  [npcNames[8]]: [69, 61, 2388.1003, -1279.8933, 25.1291, 94.3321],
};

export const vehiclePutId = {
  [npcNames[0]]: 1,
  [npcNames[1]]: 9,
  [npcNames[2]]: 5,
  [npcNames[3]]: 13,
  [npcNames[4]]: 14,
  [npcNames[5]]: 15,
  [npcNames[7]]: 376,
  [npcNames[8]]: 875,
};
