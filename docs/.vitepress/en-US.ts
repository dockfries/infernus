import { defineConfig, type DefaultTheme } from "vitepress";

export const en_US = defineConfig({
  lang: "en-US",
  description: "NodeJS library for scripting Open Multiplayer",
  themeConfig: {
    nav: nav(),

    sidebar: [
      { base: "/", text: "Getting Started", items: sidebarGuide() },
      { base: "/essentials/", text: "Essentials", items: sidebarEssentials() },
    ],

    editLink: {
      pattern: "https://github.com/dockfries/infernus/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "Home", link: "/" },
    { text: "Open Multiplayer", link: "https://open.mp" },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    { text: "Introduction", link: "introduction" },
    { text: "Quick Start", link: "quick-start" },
  ];
}

function sidebarEssentials(): DefaultTheme.SidebarItem[] {
  return [
    { text: "Events", link: "events" },
    { text: "Internationalization", link: "i18n" },
    { text: "Differences", link: "differences" },
  ];
}
