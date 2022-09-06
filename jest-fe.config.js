module.exports = {
  displayName: "frontend",
  setupFilesAfterEnv: ["./jest-fe.setup.js"],
  collectCoverage: true,
  coverageReporters: ["json"],
  coverageDirectory: "./coverage/jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    "<rootDir>[/\\\\](node_modules|.next|cypress)[/\\\\]",
  ],
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\](ky)[/\\\\].+\\.(ts|tsx)$",
  ],
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleNameMapper: {
    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    /* Handle aliases */
    "^~(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/test/api"],
}
