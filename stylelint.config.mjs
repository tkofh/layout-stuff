export default {
  extends: ["stylelint-config-standard-vue"],
  plugins: ["stylelint-plugin-logical-css"],
  rules: {
    "plugin/use-logical-properties-and-values": [true, { severity: "warning" }],
    "plugin/use-logical-units": [true, { severity: "warning" }],
  },
  cacheLocation: "node_modules/.cache/.stylelintcache",
};
