import { defineConfig } from "vitepress";
import { search as zhSearch } from "./zh-CN";

export const shared = defineConfig({
  base: "/infernus/",
  title: "Infernus",
  lastUpdated: true,

  themeConfig: {
    outline: "deep",
    search: {
      provider: "local",
      options: {
        locales: { ...zhSearch },
      },
    },
  },
});
