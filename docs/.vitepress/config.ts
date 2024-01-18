import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/infernus/",
  title: "Infernus",
  description: "NodeJS library for scripting Open Multiplayer",
  themeConfig: {
    nav: [{ text: "home", link: "/" }],
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Quick Start", link: "/quick-start" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/dockfries/infernus" },
    ],
  },

  locales: {
    root: {
      label: "English",
      lang: "en-US",
    },
    "zh-CN": {
      label: "中文",
      lang: "zh-CN",
      description: "用于编写Open Multiplayer脚本的NodeJS库",
      themeConfig: {
        nav: [{ text: "首页", link: "/zh-CN" }],
        sidebar: [
          {
            text: "开始",
            items: [
              { text: "起步", link: "/zh-CN/introduction" },
              { text: "快速上手", link: "/zh-CN/quick-start" },
            ],
          },
        ],
        darkModeSwitchLabel: "外观切换",
        docFooter: {
          next: "下一篇",
          prev: "上一篇",
        },
        editLink: {
          pattern: "https://github.com/dockfries/infernus/edit/main/docs/:path",
          text: "编辑此页",
        },
        lastUpdatedText: "最后一次更新",
        outlineTitle: "在此页面上",
        returnToTopLabel: "回到顶部",
        sidebarMenuLabel: "菜单",
      },
    },
  },
});
