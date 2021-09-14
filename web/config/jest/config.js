const path = require("path");

// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const ROOT_PROJECT_FOLDER = path.resolve(__dirname, "..", "..");

module.exports = {
  testEnvironment: "jsdom",
  rootDir: ROOT_PROJECT_FOLDER,
  roots: ["<rootDir>/src"],
  transform: {
    ".(js|jsx|ts|tsx)": path.resolve(__dirname, "sucraseTransformer.js"),
  },
  moduleNameMapper: {
    "^@shared/(.*)$": path.resolve(__dirname, "..", "..", "..", "shared", "$1"),
    "^@web/(.*)$": "<rootDir>/src/$1",
  },
};
