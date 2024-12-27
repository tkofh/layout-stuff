// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "radix-vue/nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-security",
  ],

  components: {
    dirs: [
      {
        path: "~/components",
        ignore: ["**/internal/**"],
      },
    ],
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  css: [
    "~/assets/styles/index.css",
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

  nitro: {
    compressPublicAssets: true,
    // preset: "static",
  },

  vite: {
    build: {
      target: ["esnext"],
    },
  },

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

  security: {
    nonce: true,
    sri: true,
  },
});
