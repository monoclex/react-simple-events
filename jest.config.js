export default {
  preset: "ts-jest",

  transform: {
    "\\.(t|j)sx?$": "ts-jest",
  },

  // get ts-jest to transform `/node_modules/nanoevents`
  transformIgnorePatterns: ["something-that-wont-match-any-directory"],

  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.jest.json",
    },
  },
};
