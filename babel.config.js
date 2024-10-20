module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            jzk: './src',
          },
        },
      ],
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './src/config/uiconfig.js',
          logTimings: false,
          disableExtraction: true,
        },
      ],
    ],
  };
};
