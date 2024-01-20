import { defineConfig } from "vitepress";
import { search as zhSearch } from "./zh-CN";

export const shared = defineConfig({
  base: "/infernus/",
  title: "Infernus",
  lastUpdated: true,

  themeConfig: {
    outline: "deep",
    socialLinks: [
      { icon: "github", link: "https://github.com/dockfries/infernus" },
    ],
    search: {
      provider: "local",
      options: {
        locales: { ...zhSearch },
      },
    },
  },
});
