import { defineConfig } from "vitepress";
import { shared } from "./shared";
import { en_US } from "./en-US";
import { zh_Hans, markdown as zhHansMarkdown } from "./zh-Hans";
import { es_ES, markdown as esESMarkdown } from "./es-ES";

export default defineConfig({
  ...shared,
  locales: {
    root: { label: "English", ...en_US },
    "zh-Hans": { label: "简体中文", ...zh_Hans, markdown: zhHansMarkdown },
    "es-ES": { label: "Español", ...es_ES, markdown: esESMarkdown },
  },
});
