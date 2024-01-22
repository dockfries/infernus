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
    {
      text: "Plugins",
      items: [
        {
          text: "samp-node",
          link: "https://github.com/AmyrAhmady/samp-node",
        },
        {
          text: "Streamer",
          link: "https://github.com/samp-incognito/samp-streamer-plugin",
        },
        {
          text: "RakNet",
          link: "https://github.com/katursis/Pawn.RakNet",
        },
      ],
    },
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
    { text: "Lifecycle", link: "life-cycle" },
    { text: "Internationalization", link: "i18n" },
    { text: "Dialogs", link: "dialogs" },
    { text: "Features", link: "features" },
    { text: "Use", link: "use" },
  ];
}