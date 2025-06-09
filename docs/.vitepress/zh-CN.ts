import { createRequire } from "module";
import { defineConfig, type DefaultTheme } from "vitepress";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const zh_CN = defineConfig({
  lang: "zh-CN",
  description: "用于编写Open Multiplayer脚本的Node.js库",
  themeConfig: {
    nav: nav(),

    sidebar: [
      { base: "/zh-CN/", text: "开始", items: sidebarGuide() },
      {
        base: "/zh-CN/essentials/",
        text: "基础",
        items: sidebarEssentials(),
      },
      { base: "/zh-CN/plugins/", text: "插件", items: sidebarPlugins() },
    ],

    editLink: {
      pattern: "https://github.com/dockfries/infernus/edit/main/docs/:path",
      text: "在Github上编辑此页",
    },

    darkModeSwitchLabel: "外观切换",
    docFooter: {
      next: "下一篇",
      prev: "上一篇",
    },
    lastUpdatedText: "最后一次更新",
    outlineTitle: "页面导航",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "首页", link: "/zh-CN/" },
    { text: "Open Multiplayer", link: "https://open.mp/zh-CN" },
    {
      text: "插件",
      items: [
        {
          text: "omp-node",
          link: "https://github.com/omp-node",
        },
        {
          text: "samp-node",
          link: "https://github.com/dockfries/samp-node",
        },
        {
          text: "Streamer",
          link: "https://github.com/samp-incognito/samp-streamer-plugin",
        },
        {
          text: "RakNet",
          link: "https://github.com/katursis/Pawn.RakNet",
        },
        {
          text: "MapAndreas",
          link: "https://github.com/philip1337/samp-plugin-mapandreas",
        },
        {
          text: "ColAndreas",
          link: "https://github.com/Pottus/ColAndreas",
        },
        {
          text: "samp-cef",
          link: "https://github.com/Pycckue-Bnepeg/samp-cef",
        },
        {
          text: "samp-gps",
          link: "https://github.com/AmyrAhmady/samp-gps-plugin",
        },
      ],
    },
    {
      text: pkg.version,
      items: [
        {
          text: "更新日志",
          link: "https://github.com/dockfries/infernus/blob/main/CHANGELOG.md",
        },
      ],
    },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    { text: "起步", link: "introduction" },
    { text: "快速上手", link: "quick-start" },
  ];
}

function sidebarEssentials(): DefaultTheme.SidebarItem[] {
  return [
    { text: "事件", link: "events" },
    { text: "生命周期", link: "life-cycle" },
    { text: "国际化", link: "i18n" },
    { text: "对话框", link: "dialogs" },
    { text: "特性", link: "features" },
    { text: "Use", link: "use" },
  ];
}

function sidebarPlugins(): DefaultTheme.SidebarItem[] {
  return [{ text: "介绍", link: "introduction" }];
}

export const search = {
  "zh-CN": {
    translations: {
      button: {
        buttonText: "搜索文档",
        buttonAriaLabel: "搜索文档",
      },
      modal: {
        noResultsText: "无法找到相关结果",
        resetButtonTitle: "清除查询条件",
        displayDetails: "查看详情列表",
        footer: {
          selectText: "选择",
          closeText: "关闭",
          navigateText: "切换",
        },
      },
    },
  },
};
