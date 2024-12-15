//jest.config.ts
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/tests"],

  setupFiles: ["dotenv/config"],
  collectCoverage: true,
  coverageReporters: ["text", "html"],
  coverageDirectory: "<rootDir>/coverage/",
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
