import { defineConfig } from "vitepress";
import { shared } from "./shared";
import { en_US } from "./en-US";
import { zh_CN } from "./zh-CN";

export default defineConfig({
  ...shared,
  locales: {
    root: { label: "English", ...en_US },
    "zh-CN": { label: "简体中文", ...zh_CN },
  },
});
