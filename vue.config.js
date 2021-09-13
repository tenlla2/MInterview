module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "https://the-one-api.dev/v2",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/api": "" },
        logLevel: "debug",
      },
    },
  },

  transpileDependencies: ["vuetify"],
};
