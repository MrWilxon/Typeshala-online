const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  collectCoverageFrom: [
    "src/lib/**/*.{ts,tsx}",
    "src/data/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
  ],
};

module.exports = createJestConfig(config);
