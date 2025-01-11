import { createRequire } from "module";
import { defineConfig, type DefaultTheme } from "vitepress";

const require = createRequire(import.meta.url);
const pkg = require("../../package.json");

export const en_US = defineConfig({
  lang: "en-US",
  description: "Node.js library for scripting Open Multiplayer",
  themeConfig: {
    nav: nav(),

    sidebar: [
      { base: "/", text: "Getting Started", items: sidebarGuide() },
      { base: "/essentials/", text: "Essentials", items: sidebarEssentials() },
      { base: "/plugins/", text: "Plugins", items: sidebarPlugins() },
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
          text: "omp-node",
          link: "https://github.com/omp-node",
        },
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
          text: "Changelog",
          link: "https://github.com/dockfries/infernus/blob/main/CHANGELOG.md",
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

function sidebarPlugins(): DefaultTheme.SidebarItem[] {
  return [{ text: "Introduction", link: "introduction" }];
}
