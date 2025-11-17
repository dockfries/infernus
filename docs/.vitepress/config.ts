import { defineConfig } from "vitepress";
import { shared } from "./shared";
import { en_US } from "./en-US";
import { zh_Hans } from "./zh-Hans";
import { es_ES } from "./es-ES";

export default defineConfig({
  ...shared,
  locales: {
    root: { label: "English", ...en_US },
    "zh-Hans": { label: "简体中文", ...zh_Hans },
    "es-ES": { label: "Español", ...es_ES },
  },
});
