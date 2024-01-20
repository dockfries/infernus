import { defineConfig, type DefaultTheme } from "vitepress";

export const zh_CN = defineConfig({
  lang: "zh-CN",
  description: "用于编写Open Multiplayer脚本的NodeJS库",
  themeConfig: {
    nav: nav(),

    sidebar: [
      { base: "/zh-CN/", text: "开始", items: sidebarGuide() },
      {
        base: "/zh-CN/essentials/",
        text: "基础",
        items: sidebarEssentials(),
      },
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
    { text: "Open Multiplayer", link: "https://open.mp/zh-cn" },
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
    { text: "国际化", link: "i18n" },
    { text: "差异", link: "differences" },
  ];
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
