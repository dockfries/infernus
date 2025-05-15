import { innerGameModeConfig } from "../../config";

export function setDisableSyncBugs(toggle: boolean) {
  innerGameModeConfig.disableSyncBugs = toggle;
}

export function setKnifeSync(toggle: boolean) {
  innerGameModeConfig.knifeSync = toggle;
}
