import { initAt400LS } from "./at400_ls";
import { initAt400LV } from "./at400_lv";
import { initAt400SF } from "./at400_sf";
import { initDriverTest2 } from "./driver_test2";
import { initMatTest2 } from "./mat_test2";
import { initOnFootTest } from "./onfoot_test";
import { initTrainLs } from "./train_ls";
import { initTrainLv } from "./train_lv";
import { initTrainSf } from "./train_sf";

export function initNpcModes() {
  return [
    ...initAt400LS(),
    ...initAt400LV(),
    ...initAt400SF(),
    ...initTrainLs(),
    ...initTrainLv(),
    ...initTrainSf(),
    ...initMatTest2(),
    ...initOnFootTest(),
    ...initDriverTest2(),
  ];
}
