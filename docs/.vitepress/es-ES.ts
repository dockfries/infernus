import { defineConfig, type DefaultTheme } from "vitepress";

export const es_ES = defineConfig({
  lang: "es-ES",
  description:
    "Librería de Node.js para la creación de scripts en Open Multiplayer",
  themeConfig: {
    nav: nav(),

    sidebar: [
      { base: "/es-ES/", text: "Comenzar", items: sidebarGuide() },
      {
        base: "/es-ES/essentials/",
        text: "Esenciales",
        items: sidebarEssentials(),
      },
      { base: "/es-ES/plugins/", text: "Plugins", items: sidebarPlugins() },
    ],

    editLink: {
      pattern: "https://github.com/dockfries/infernus/edit/main/docs/:path",
      text: "Editar esta página en GitHub",
    },

    darkModeSwitchLabel: "Cambiar apariencia",
    docFooter: {
      next: "Siguiente",
      prev: "Anterior",
    },
    lastUpdatedText: "Última actualización",
    outlineTitle: "Navegación de la página",
    returnToTopLabel: "Volver al principio",
    sidebarMenuLabel: "Menú",
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "Inicio", link: "/es-ES/" },
    { text: "Open Multiplayer", link: "https://open.mp/es" },
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
      ],
    },
  ];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    { text: "Introducción", link: "introduction" },
    { text: "Inicio rápido", link: "quick-start" },
  ];
}

function sidebarEssentials(): DefaultTheme.SidebarItem[] {
  return [
    { text: "Eventos", link: "events" },
    { text: "Ciclo de vida", link: "life-cycle" },
    { text: "Internacionalización", link: "i18n" },
    { text: "Diálogos", link: "dialogs" },
    { text: "Características", link: "features" },
    { text: "Uso", link: "use" },
  ];
}

function sidebarPlugins(): DefaultTheme.SidebarItem[] {
  return [{ text: "Introducción", link: "introduction" }];
}

export const search = {
  "es-ES": {
    translations: {
      button: {
        buttonText: "Buscar en la documentación",
        buttonAriaLabel: "Buscar en la documentación",
      },
      modal: {
        noResultsText: "No se encontraron resultados",
        resetButtonTitle: "Restablecer consulta",
        displayDetails: "Ver lista de detalles",
        footer: {
          selectText: "Seleccionar",
          closeText: "Cerrar",
          navigateText: "Navegar",
        },
      },
    },
  },
};
