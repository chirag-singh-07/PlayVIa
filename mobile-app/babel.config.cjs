module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin", // Must be last
      "expo-router/babel",
      // FIX: add expo-env
      "expo-env",
    ],
  };
};
