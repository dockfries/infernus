import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/infernus/",
  title: "Infernus",
  description: "NodeJS library for scripting Open Multiplayer",
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: "local",
      options: {
        locales: {
          "zh-CN": {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                },
              },
            },
          },
        },
      },
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Open Multiplayer", link: "https://open.mp" },
    ],
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Quick Start", link: "/quick-start" },
        ],
      },
      {
        text: "Essential",
        items: [
          { text: "Events", link: "/essentials/events" },
          { text: "Internationalization", link: "/essentials/i18n" },
          { text: "Differences", link: "/essentials/differences" },
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
        nav: [
          { text: "首页", link: "/zh-CN/" },
          { text: "Open Multiplayer", link: "https://open.mp" },
        ],
        sidebar: [
          {
            text: "开始",
            items: [
              { text: "起步", link: "/zh-CN/introduction" },
              { text: "快速上手", link: "/zh-CN/quick-start" },
            ],
          },
          {
            text: "基础",
            items: [
              { text: "事件", link: "/zh-CN/essentials/events" },
              { text: "国际化", link: "/zh-CN/essentials/i18n" },
              { text: "差异", link: "/zh-CN/essentials/differences" },
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
