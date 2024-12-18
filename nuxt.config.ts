// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "radix-vue/nuxt", "@nuxtjs/color-mode"],

  devtools: { enabled: true },

  css: [
    "sanitize.css",
    "sanitize.css/assets.css",
    "sanitize.css/typography.css",
    "sanitize.css/forms.css",
    "sanitize.css/system-ui.css",
    "sanitize.css/ui-monospace.css",
    "@radix-ui/colors/gray.css",
    "@radix-ui/colors/gray-dark.css",
  ],

  colorMode: {
    classSuffix: "-theme",
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-01",

  eslint: {
    config: {
      tooling: true,
      nuxt: {
        sortConfigKeys: true,
      },
      typescript: {
        strict: true,
      },
    },
  },

  radix: {
    prefix: "Radix",
  },
});
